import chalk from "chalk"
import numeral from "numeral"
import { run, collectFruits, logFruits } from "../../helpers/general.js"
import { NEW_LINE } from "../../constants.js"
import { getFileContent } from "../../helpers/file.js"

export default async function init({ fruit }) {
  // TODO: move within getFileContent
  const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"

  const contents =  await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => {
      const n = entry.split(`${NEW_LINE}${NEW_LINE}`)
      return n.map(el => el.split(`${NEW_LINE}`))
    },
  })

  const { input: elvesFoodInventory } = contents
  const fruits = collectFruits({ fruit, callbacks: [fruitOne, fruitTwo] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Calorie Counting",
    fruitOne: {
      message: `the most calories carried by an Elf is ${chalk.yellow(numeral(fruit1.elfCalories).format('0,0'))} calories`
    },
    fruitTwo: {
      message: `the total calories carried by the top three Elves is ${chalk.yellow(numeral(fruit2.elvesCalorieAmount).format('0,0'))} calories`
    }
  })

  return fruits

  function fruitOne() {
    let elfCalorieCounter = 0
    let mostCalories = { elf: null, elfCalories: null }

    for (let i = 0; i < elvesFoodInventory.length; i++) {
      const elfInventory = elvesFoodInventory[i]

      for (let j = 0; j < elfInventory.length; j++) {
        elfCalorieCounter = elfCalorieCounter + parseInt(elfInventory[j])
      }

      const { elf, elfCalories } = mostCalories

      if(!elf || (elfCalories < elfCalorieCounter)) {
        mostCalories.elf = i
        mostCalories.elfCalories = elfCalorieCounter
      }

      elfCalorieCounter = 0
    }

    return mostCalories
  }

  function fruitTwo() {
    let elfCalorieCounter = 0
    let elvesFoodCalories = []

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
      let topThreeMostCalories = {}
      const totalElves = 3
      
      for (let i = sorted.length - elfCounter; i >= sorted.length - totalElves; i--) {
        topThreeMostCalories[elfCounter] = sorted[i]
        elvesCalories += sorted[i].elfCalories
        elfCounter++
      }

      topThreeMostCalories.elvesCalorieAmount = elvesCalories
      return topThreeMostCalories
    }

    function quicksort(items) {
      if (items.length <= 1) {
        return items
      }

      let leftItems = []
      let rightItems = []
      let pivot = items[0]

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
}

run(() => init({ fruit: "both" }))