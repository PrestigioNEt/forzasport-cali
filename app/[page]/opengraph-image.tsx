import OpengraphImage from 'components/opengraph-image';
import { getPage } from 'lib/shopify';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const contentType = 'image/png';

export default async function Image({ params }: { params: { page: string } }) {
  try {
    const page = await getPage(params.page);
    const title = page?.seo?.title || page?.title || '';
    const fontBuffer = await readFile(join(process.cwd(), 'public', 'Moderat Font', 'Moderat-Bold.ttf'));
    // Convert Buffer to ArrayBuffer (always ArrayBuffer, never SharedArrayBuffer)
    const font = new Uint8Array(fontBuffer).buffer;
    return await OpengraphImage({ title, font });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating OpenGraph image:', error);
    }
    throw error;
  }
}