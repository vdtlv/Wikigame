import type { Language } from '../App';

// Whether an article (or a redirect to one) exists in the given Wikipedia
export async function articleExists(language: Language, title: string): Promise<boolean> {
  if (!title) return false;
  try {
    const response = await fetch(
      `https://${language}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects=1&format=json&formatversion=2&origin=*`
    );
    const data = await response.json();
    const page = data.query?.pages?.[0];
    return !!page && !page.missing && !page.invalid;
  } catch (error) {
    console.error('Article validation error:', error);
    return false;
  }
}
