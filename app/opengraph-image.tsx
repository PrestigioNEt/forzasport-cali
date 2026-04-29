import OpengraphImage from 'components/opengraph-image';

export const contentType = 'image/png';
export const runtime = 'edge';

export default async function Image() {
  const fontData = await fetch(
    new URL('/Moderat Font/Moderat-Bold.ttf', `file://${process.cwd()}/public`)
  ).then((res) => res.arrayBuffer());
  
  return await OpengraphImage({ font: fontData });
}