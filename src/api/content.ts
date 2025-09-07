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
  return http(`/content/pages?locale=${locale}`);
}
