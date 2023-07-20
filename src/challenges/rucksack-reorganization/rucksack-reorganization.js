import chalk from "chalk"
import numeral from "numeral"
import { getFileContent } from "../../helpers/file.js"
import { collectFruits, logFruits, run } from "../../helpers/general.js"

const getRuckSackSharedItem = (rucksack) => {
  // maps rucksack first compartment item types
  const map = new Map()
  let sharedItem

  for (const item in rucksack) {
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

const getGroupBadge = (rucksacks) => {
  // maps Elves group rucksacks item types
  let badge
  const map = new Map()

  for (let i = 0; i < rucksacks.length; i++) {
    const rucksack = rucksacks[i]
    const nthRucksack = i + 1

    for (const item in rucksack) {
      const itemType = rucksack[item]
      const mapItem = map.get(itemType)

      if (!mapItem && nthRucksack === 1) {
        map.set(itemType, 1)
        continue
      }

      if (mapItem && nthRucksack === 2) {
        map.set(itemType, 2)
        continue
      }

      if (mapItem && nthRucksack === 3 && mapItem === 2) {
        map.set(itemType, 3)

        const _mapItem = map.get(itemType)
        if (_mapItem === rucksacks.length) {
          badge = itemType
          return badge
        }
      }
    }
  }
}

export default async function init({ fruit }) {
  const { contents: rucksacks } = await getFileContent({
    base: import.meta.url,
    opts: (entry) => entry.split("\n")
  })

  const fruits = collectFruits({ fruit, callbacks: [fruitOne, fruitTwo] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Rucksack Reorganization",
    fruitOne: {
      message: fruit1 ? `the comparments' shared item priority sum is ${chalk.yellow(numeral(fruit1).format("0,0"))}` : null
    },
    fruitTwo: {
      message: fruit2 ? `the badges' priority sum is ${chalk.yellow(numeral(fruit2).format("0,0"))}` : null
    }
  })

  return fruits

  function fruitOne() {
    let prioritySum = 0
    for (let i = 0; i < rucksacks.length; i++) {
      const rucksack = rucksacks[i]
      const sharedItem = getRuckSackSharedItem(rucksack)

      const arrangementPriority = getArrangementPriority(sharedItem)
      prioritySum = prioritySum + arrangementPriority
    }

    return prioritySum
  }

  function fruitTwo() {
    let prioritySum = 0
    for (let i = 0; i < rucksacks.length; i++) {
      const isElvesGroup = ((i + 1) % 3) === 0

      if (!isElvesGroup) continue
      const badge = getGroupBadge([rucksacks[i - 2], rucksacks[i - 1], rucksacks[i]])

      const arrangementPriority = getArrangementPriority(badge)
      prioritySum = prioritySum + arrangementPriority
    }

    return prioritySum
  }
}

run(() => init({ fruit: "both" }))

export {
  getRuckSackSharedItem,
  getArrangementPriority,
  getGroupBadge
}
