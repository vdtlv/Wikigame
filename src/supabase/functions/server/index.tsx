import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-92321c2f/health", (c) => {
  return c.json({ status: "ok" });
});

// Get user profile
app.get("/make-server-92321c2f/user-profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`user_profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create or update user profile
app.post("/make-server-92321c2f/user-profile", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, nickname, email } = body;
    
    if (!userId || !nickname) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const profile = {
      userId,
      nickname,
      email,
      regdate: new Date().toISOString(),
    };
    
    await kv.set(`user_profile:${userId}`, profile);
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error saving user profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Generate random access code
function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create party
app.post("/make-server-92321c2f/party/create", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, startArticle, endArticle, language } = body;
    
    if (!userId) {
      return c.json({ error: "User ID required" }, 400);
    }
    
    // Generate unique party ID and access code
    const partyUid = crypto.randomUUID();
    let accessCode = generateAccessCode();
    
    // Ensure access code is unique
    let existingParty = await kv.get(`party_by_code:${accessCode}`);
    while (existingParty) {
      accessCode = generateAccessCode();
      existingParty = await kv.get(`party_by_code:${accessCode}`);
    }
    
    const party = {
      partyUid,
      accessCode,
      createDate: new Date().toISOString(),
      creatorId: userId,
      startArticle: startArticle || null,
      endArticle: endArticle || null,
      language: language || 'en',
      status: 'waiting', // waiting, in_progress, completed
      members: [userId],
    };
    
    // Store party by UID and by access code
    await kv.set(`party:${partyUid}`, party);
    await kv.set(`party_by_code:${accessCode}`, partyUid);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error creating party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Join party by access code
app.post("/make-server-92321c2f/party/join", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, accessCode } = body;
    
    if (!userId || !accessCode) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    // Find party by access code
    const partyUid = await kv.get(`party_by_code:${accessCode.toUpperCase()}`);
    
    if (!partyUid) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Get party details
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Add user to members if not already in
    if (!party.members.includes(userId)) {
      party.members.push(userId);
      await kv.set(`party:${partyUid}`, party);
    }
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error joining party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user's parties
app.get("/make-server-92321c2f/user/:userId/parties", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Get all parties where user is a member
    const allPartiesData = await kv.getByPrefix("party:");
    const userParties = allPartiesData
      .filter((party: any) => party.members && party.members.includes(userId))
      .sort((a: any, b: any) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
    
    return c.json(userParties);
  } catch (error) {
    console.log("Error fetching user parties:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get party details
app.get("/make-server-92321c2f/party/:partyUid", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    return c.json(party);
  } catch (error) {
    console.log("Error fetching party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update party articles (host only)
app.post("/make-server-92321c2f/party/:partyUid/articles", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const body = await c.req.json();
    const { userId, startArticle, endArticle } = body;
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Only creator can update articles
    if (party.creatorId !== userId) {
      return c.json({ error: "Only host can update articles" }, 403);
    }
    
    party.startArticle = startArticle;
    party.endArticle = endArticle;
    await kv.set(`party:${partyUid}`, party);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error updating party articles:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Start party game (host only)
app.post("/make-server-92321c2f/party/:partyUid/start", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const body = await c.req.json();
    const { userId } = body;
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Only creator can start the game
    if (party.creatorId !== userId) {
      return c.json({ error: "Only host can start the game" }, 403);
    }
    
    party.status = 'in_progress';
    party.startTime = new Date().toISOString();
    await kv.set(`party:${partyUid}`, party);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error starting party game:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Save game result to party
app.post("/make-server-92321c2f/party/:partyUid/result", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const body = await c.req.json();
    const { userId, clicks, timeElapsed, path } = body;
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Initialize results array for current game if it doesn't exist
    if (!party.results) {
      party.results = [];
    }
    
    // Add or update user's result
    const existingResultIndex = party.results.findIndex((r: any) => r.userId === userId);
    const result = {
      userId,
      clicks,
      timeElapsed,
      path,
      completedAt: new Date().toISOString(),
    };
    
    if (existingResultIndex >= 0) {
      party.results[existingResultIndex] = result;
    } else {
      party.results.push(result);
    }
    
    await kv.set(`party:${partyUid}`, party);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error saving game result:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Reset party for new game (host only)
app.post("/make-server-92321c2f/party/:partyUid/reset", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const body = await c.req.json();
    const { userId } = body;
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Only creator can reset
    if (party.creatorId !== userId) {
      return c.json({ error: "Only host can reset the party" }, 403);
    }
    
    // Move current results to game history if there are any
    if (party.results && party.results.length > 0) {
      if (!party.gameHistory) {
        party.gameHistory = [];
      }
      party.gameHistory.push({
        startArticle: party.startArticle,
        endArticle: party.endArticle,
        completedAt: new Date().toISOString(),
        results: party.results,
      });
    }
    
    // Reset game state
    party.status = 'waiting';
    party.results = [];
    party.startTime = null;
    
    await kv.set(`party:${partyUid}`, party);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error resetting party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete party
app.delete("/make-server-92321c2f/party/:partyUid", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const userId = c.req.query("userId");
    
    if (!userId) {
      return c.json({ error: "User ID required" }, 400);
    }
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Only creator can delete the party
    if (party.creatorId !== userId) {
      return c.json({ error: "Only host can delete the party" }, 403);
    }
    
    // Delete party by UID and by access code
    await kv.del(`party:${partyUid}`);
    await kv.del(`party_by_code:${party.accessCode}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Leave party
app.post("/make-server-92321c2f/party/:partyUid/leave", async (c) => {
  try {
    const partyUid = c.req.param("partyUid");
    const body = await c.req.json();
    const { userId } = body;
    
    const party = await kv.get(`party:${partyUid}`);
    
    if (!party) {
      return c.json({ error: "Party not found" }, 404);
    }
    
    // Remove user from members
    party.members = party.members.filter((id: string) => id !== userId);
    
    // If host left and there are other members, assign new host
    if (party.creatorId === userId && party.members.length > 0) {
      party.creatorId = party.members[0];
    }
    
    // If no members left, delete the party
    if (party.members.length === 0) {
      await kv.del(`party:${partyUid}`);
      return c.json({ success: true, partyDeleted: true });
    }
    
    await kv.set(`party:${partyUid}`, party);
    
    return c.json({ success: true, party });
  } catch (error) {
    console.log("Error leaving party:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Send magic link via UniSender Go
app.post("/make-server-92321c2f/send-magic-link", async (c) => {
  try {
    const body = await c.req.json();
    const { email, language = 'en' } = body;
    
    if (!email || !email.includes('@')) {
      return c.json({ error: "Invalid email" }, 400);
    }
    
    console.log('📧 Generating magic link for:', email);
    
    // Generate magic link with our redirect URL
    const { data: magicData, error: magicError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: 'https://wikirunner.ru',
      },
    });

    if (magicError || !magicData?.properties?.action_link) {
      console.error('❌ Error generating magic link:', magicError);
      return c.json({ error: "Failed to generate magic link" }, 500);
    }

    const magicLink = magicData.properties.action_link;
    console.log('🔗 Magic link generated:', magicLink);
    console.log('🔍 Magic link domain:', new URL(magicLink).hostname);
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Verification code generated:', verificationCode);
    console.log('📧 Will send to email:', email);
    
    // Store code in KV with 1 hour expiration
    const codeKey = `email_code:${email}:${verificationCode}`;
    const codeData = {
      email,
      code: verificationCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      used: false,
    };
    await kv.set(codeKey, codeData);
    console.log('💾 Code stored in database with key:', codeKey);
    
    // Get UniSender Go API key
    const unisenderApiKey = Deno.env.get('UNISENDER_API_KEY');
    if (!unisenderApiKey) {
      console.error('❌ UNISENDER_API_KEY not configured');
      return c.json({ error: "Email service not configured" }, 500);
    }
    
    console.log('🔑 Using API key:', unisenderApiKey.substring(0, 10) + '...');
    
    // Prepare email content using UniSender template
    const subject = language === 'ru' ? 'Вход в WikiGame' : 'Login to WikiGame';
    
    // Send email via UniSender Go API
    console.log('📮 Sending email via UniSender Go...');
    console.log('📧 Recipient:', email);
    console.log('🔑 API Key length:', unisenderApiKey.length);
    
    const emailPayload = {
      message: {
        recipients: [
          {
            email: email,
          }
        ],
        global_substitutions: {
          magic_link: magicLink,
          verification_code: verificationCode,
        },
        template_id: 'e584baba-cab3-11f0-a1ba-025779db5bd3',
        subject: subject,
        from_email: 'noreply@wikirunner.ru',
        from_name: 'WikiGame',
        track_links: 0,
        track_read: 0,
      }
    };
    
    console.log('📦 Sending to UniSender Go API...');
    
    const unisenderResponse = await fetch('https://go2.unisender.ru/ru/transactional/api/v1/email/send.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': unisenderApiKey,
      },
      body: JSON.stringify(emailPayload),
    });
    
    const responseText = await unisenderResponse.text();
    console.log('📡 Response status:', unisenderResponse.status);
    console.log('📡 Response body:', responseText);
    
    if (!unisenderResponse.ok) {
      console.error('❌ UniSender Go HTTP error:', unisenderResponse.status, responseText);
      
      // Parse error message for user-friendly feedback
      try {
        const errorJson = JSON.parse(responseText);
        console.error('❌ Parsed error:', errorJson);
        
        if (errorJson.code === 114 || errorJson.code === 115) {
          return c.json({ 
            error: 'Sender email not verified. Please verify noreply@wikirunner.ru in UniSender Go dashboard: Settings → Sender Addresses. Or contact support to use a different sender email.' 
          }, 500);
        }
        
        return c.json({ error: `UniSender error: ${errorJson.message || errorJson.code}` }, 500);
      } catch (e) {
        // Not JSON, return raw error
        return c.json({ error: `Email sending failed: ${responseText}` }, 500);
      }
    }
    
    let unisenderResult;
    try {
      unisenderResult = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse response:', responseText);
      return c.json({ error: 'Invalid response from email service' }, 500);
    }
    
    console.log('📨 UniSender response:', JSON.stringify(unisenderResult, null, 2));
    
    if (unisenderResult.status === 'error') {
      console.error('❌ UniSender Go error:', unisenderResult);
      return c.json({ error: `Email sending failed: ${unisenderResult.message || 'Unknown error'}` }, 500);
    }
    
    console.log('✅ Email sent successfully via UniSender Go');
    if (unisenderResult.job_id) {
      console.log('📧 Job ID:', unisenderResult.job_id);
    }
    return c.json({ success: true, message: 'Magic link sent' });
    
  } catch (error) {
    console.error('❌ Error in send-magic-link:', error);
    return c.json({ error: "Internal server error while sending email" }, 500);
  }
});

// Verify email code and sign in
app.post("/make-server-92321c2f/verify-code", async (c) => {
  try {
    const body = await c.req.json();
    const { email, code } = body;
    
    if (!email || !code) {
      return c.json({ error: "Email and code are required" }, 400);
    }
    
    console.log('🔍 Verifying code for:', email);
    
    // Look up code in database
    const codeKey = `email_code:${email}:${code}`;
    const codeData = await kv.get(codeKey);
    
    if (!codeData) {
      console.log('❌ Code not found');
      return c.json({ error: "Invalid or expired code" }, 400);
    }
    
    // Check if code is expired
    if (new Date(codeData.expiresAt) < new Date()) {
      console.log('❌ Code expired');
      await kv.del(codeKey);
      return c.json({ error: "Code has expired" }, 400);
    }
    
    // Check if code was already used
    if (codeData.used) {
      console.log('❌ Code already used');
      return c.json({ error: "Code has already been used" }, 400);
    }
    
    console.log('✅ Code verified successfully');
    
    // Mark code as used
    codeData.used = true;
    await kv.set(codeKey, codeData);
    
    // Find or create user in Supabase
    let userId: string;
    let isNewUser = false;
    
    // Try to find existing user
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === email);
    
    if (existingUser) {
      console.log('✅ Existing user found:', existingUser.id);
      userId = existingUser.id;
    } else {
      // Create new user
      console.log('🆕 Creating new user...');
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
      });
      
      if (createError || !newUserData.user) {
        console.error('❌ Error creating user:', createError);
        return c.json({ error: "Failed to create user" }, 500);
      }
      
      console.log('✅ User created:', newUserData.user.id);
      userId = newUserData.user.id;
      isNewUser = true;
    }
    
    console.log('✅ Code verification complete, user ID:', userId);
    
    return c.json({ 
      success: true, 
      userId: userId,
      email: email,
      isNewUser,
    });
    
  } catch (error) {
    console.error('❌ Error in verify-code:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);