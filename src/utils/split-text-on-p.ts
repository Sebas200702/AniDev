export const splitTextOnP = (text: string) => {
  const midpoint = Math.floor(text.length / 2)
  if (text.length < 400) return [text, '']

  let splitPoint = text.lastIndexOf('.', midpoint)
  if (splitPoint === -1) {
    splitPoint = text.indexOf('.', midpoint)
  }

  if (splitPoint === -1) {
    return [text, '']
  }
  const part1 = text.slice(0, splitPoint + 1).trim()
  const part2 = text.slice(splitPoint + 1).trim()

  return [part1, part2]
}
