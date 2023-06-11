import { run, collectFruits } from "../../helpers/general.js"
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
  const fruits = collectFruits({ fruit, callbacks: [fruitOne] })

  const { fruit1 } = fruits

  // TODO: improve logger
  console.log("Calorie Counting")
  console.log(`The Elf carrying the most calories is Elf ${fruit1.elf}, carrying ${fruit1.elfCalories} calories`)

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
}

run(() => init({ fruit: "1" }))