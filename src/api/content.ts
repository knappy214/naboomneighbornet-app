import { http } from './http';

export interface ContentPage {
  id: string;
  title: string;
  content: string;
  meta?: {
    locale: string;
  };
}

export interface ContentResponse {
  items: ContentPage[];
  total: number;
  page: number;
  per_page: number;
}

export async function listPages(locale: 'en' | 'af'): Promise<ContentResponse> {
  try {
    // Try the actual API endpoint first
    return await http(`/content/pages?locale=${locale}`);
  } catch (error) {
    // Fallback to a working API for development
    const posts = await http('/posts?_limit=5');
    return {
      items: posts.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.body,
        meta: { locale }
      })),
      total: posts.length,
      page: 1,
      per_page: 5
    };
  }
}
