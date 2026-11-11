// Recorta la imagen elegida al tamaño pedido para que quepa en localStorage
export async function fitImage(file: File, width: number, height: number) {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
  if (file.size > 12 * 1024 * 1024) throw new Error('La imagen pesa más de 12 MB.')

  const bitmap = await createImageBitmap(file)
  const scale = Math.max(width / bitmap.width, height / bitmap.height)
  const sw = width / scale
  const sh = height / scale
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, (bitmap.width - sw) / 2, (bitmap.height - sh) / 2, sw, sh, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/webp', 0.84)
}
