import getFileContent from "../helpers/file.js"
import run from "../helpers/run.js"

const getRuckSackSharedItem = (rucksack) => {
  const map = new Map()
  let sharedItem

  for (let item in rucksack) {
    const _item = parseInt(item) + 1
    const middleIndex = rucksack.length / 2
    const itemType = rucksack[item]
    const mapItem = map.get(itemType)

    if (_item > middleIndex) {
      if (!mapItem) continue

      sharedItem = itemType
      break
    }

    if (_item <= middleIndex) {
      if (!mapItem) {
        map.set(itemType, 1)
        continue
      }
   
      map.set(itemType, mapItem + 1)
    }
  }

  return sharedItem
}

const getArrangementPriority = (itemType) => {
  const ascii = itemType.charCodeAt(0)

  if (itemType.match(/[a-z]/)) {
    return ascii - 96
  }

  if (itemType.match(/[A-Z]/)) {
    return ascii - 38
  }

  return 0
}

async function init(filename = "./input.txt") {
  const opts = (entry) => entry.split("\n")

  const contents = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts,
  })

  const { input: rucksacks } = contents

  let prioritySum = 0
  for (let i = 0; i < rucksacks.length; i++) {
    const rucksack = rucksacks[i]
    const sharedItem = getRuckSackSharedItem(rucksack)

    const arrangementPriority = getArrangementPriority(sharedItem)
    prioritySum = prioritySum + arrangementPriority
  }

  return prioritySum
}

run(init);

export {
  getRuckSackSharedItem,
  getArrangementPriority,
  init as default,
}