export function removeListItem({ list, index }) {
  const updatedList = []

  for (let i = 0; i <= list.length - 1; i++) {
    if (i === index) continue
    updatedList.push(list[i])
  }

  return updatedList
}

export function isNumeric(string) {
  return !isNaN(parseInt(string))
}
