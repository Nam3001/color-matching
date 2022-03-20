function shuffle(list) {
  let currIndex = list.length - 1, randomIndex
  for (let i = currIndex; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = list[currIndex]
    list[currIndex] = list[randomIndex]
    list[randomIndex] = temp
  }
}

export function getRandomColor(count) {
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome ']

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length]
    })
    colorList.push(color)
  }
  const fullColorList = [...colorList, ...colorList]
  shuffle(fullColorList)
  return fullColorList
}