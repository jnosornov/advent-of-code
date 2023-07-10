import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"

  const contents = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => {
      const listSectionAssignments = entry.split(NEW_LINE)
      return listSectionAssignments.map(pairSections => {
        const ids = pairSections.match(/[0-9]+/g).map(el => parseInt(el))

        return [
          { lower: ids[0], upper: ids[1] },
          { lower: ids[2], upper: ids[3] }
        ]
      })
    }
  })

  const { input: pairSectionIds } = contents

  function fruitOne() {
    let overlapingPairsCounter = 0

    for (let i = 0; i < pairSectionIds.length; i++) {
      const elfPair = pairSectionIds[i]
      const [firstElf, secondElf] = elfPair

      const sectionIdsOverlap =
        (firstElf.lower >= secondElf.lower && firstElf.upper <= secondElf.upper) ||
        (secondElf.lower >= firstElf.lower && secondElf.upper <= firstElf.upper)

      if (!sectionIdsOverlap) continue
      overlapingPairsCounter++
    }

    return overlapingPairsCounter
  }

  function fruitTwo() {
    let overlapingPairsCounter = 0

    for (let i = 0; i < pairSectionIds.length; i++) {
      const elfPair = pairSectionIds[i]
      const [firstElf, secondElf] = elfPair

      const sectionIdsOverlap = firstElf.lower <= secondElf.upper && secondElf.lower <= firstElf.upper

      if (!sectionIdsOverlap) continue
      overlapingPairsCounter++
    }

    return overlapingPairsCounter
  }

  const fruits = collectFruits({ fruit, callbacks: [fruitOne, fruitTwo] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Camp Cleanup",
    fruitOne: {
      message: fruit1 ? `one range fully contains the other in ${chalk.yellow(numeral(fruit1).format("0,0"))} pair assigments` : null
    },
    fruitTwo: {
      message: fruit2 ? `one range contains the other in ${chalk.yellow(numeral(fruit2).format("0,0"))} pair assignments` : null
    }
  })

  return fruits
}

run(() => init({ fruit: "both" }))
