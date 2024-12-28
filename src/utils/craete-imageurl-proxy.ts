export const createImageUrlProxy = (
  imageUrl: string,
  width?: string,
  quality?: string,
  format?: string
) => {
  return !width || !quality || !format
    ? `/api/proxy?url=${imageUrl}`
    : `/api/proxy?url=${imageUrl}&w=${width}&q=${quality}&format=${format}`
}
