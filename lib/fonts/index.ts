// Este archivo contiene la fuente Inter Bold en formato base64 para uso en Edge Runtime
export const interBoldFont = fetch(
  new URL('../../fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());