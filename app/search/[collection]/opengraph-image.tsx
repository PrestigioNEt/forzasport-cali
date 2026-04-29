import OpengraphImage from 'components/opengraph-image';
import { getCollection } from 'lib/shopify';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const contentType = 'image/png';

export default async function Image({ params }: { params: { collection: string } }) {
  try {
    const collection = await getCollection(params.collection);
    const title = collection?.seo?.title || collection?.title || '';
    const fontBuffer = await readFile(join(process.cwd(), 'public', 'Moderat Font', 'Moderat-Bold.ttf'));
    const font = new Uint8Array(fontBuffer).buffer;
    return await OpengraphImage({ title, font });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating OpenGraph image:', error);
    }
    throw error;
  }
}