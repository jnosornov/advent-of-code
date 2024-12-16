import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Counting Calories",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (entry) => {
      const n = entry.split(`${NEW_LINE}${NEW_LINE}`)
      return n.map(el => el.split(`${NEW_LINE}`))
    }
  })
}

function fruitOne(elvesFoodInventory) {
  let elfCalorieCounter = 0
  const mostCalories = { elf: null, elfCalories: null }

  for (let i = 0; i < elvesFoodInventory.length; i++) {
    const elfInventory = elvesFoodInventory[i]

    for (let j = 0; j < elfInventory.length; j++) {
      elfCalorieCounter = elfCalorieCounter + parseInt(elfInventory[j])
    }

    const { elf, elfCalories } = mostCalories

    if (!elf || (elfCalories < elfCalorieCounter)) {
      mostCalories.elf = i
      mostCalories.elfCalories = elfCalorieCounter
    }

    elfCalorieCounter = 0
  }

  return mostCalories.elfCalories
}

function fruitTwo(elvesFoodInventory) {
  let elfCalorieCounter = 0
  const elvesFoodCalories = []

  for (let i = 0; i < elvesFoodInventory.length; i++) {
    const elfInventory = elvesFoodInventory[i]

    for (let j = 0; j < elfInventory.length; j++) {
      elfCalorieCounter = elfCalorieCounter + parseInt(elfInventory[j])
    }

    elvesFoodCalories.push({ elf: i, elfCalories: elfCalorieCounter })
    elfCalorieCounter = 0
  }

  const sorted = quicksort(elvesFoodCalories)
  return topThreeElves(sorted)

  function topThreeElves(sorted) {
    let elfCounter = 1
    let elvesCalories = 0
    const topThreeMostCalories = {}
    const totalElves = 3

    for (let i = sorted.length - elfCounter; i >= sorted.length - totalElves; i--) {
      topThreeMostCalories[elfCounter] = sorted[i]
      elvesCalories += sorted[i].elfCalories
      elfCounter++
    }

    topThreeMostCalories.elvesCalorieAmount = elvesCalories
    return topThreeMostCalories.elvesCalorieAmount
  }

  function quicksort(items) {
    if (items.length <= 1) {
      return items
    }

    const leftItems = []
    const rightItems = []
    const pivot = items[0]

    for (let i = 1; i < items.length; i++) {
      const curr = items[i]

      if (curr.elfCalories < pivot.elfCalories) {
        leftItems.push(curr)
      } else {
        rightItems.push(curr)
      }
    }

    return [...quicksort(leftItems), pivot, ...quicksort(rightItems)]
  }
}

run(() => init({ star: "both" }))
