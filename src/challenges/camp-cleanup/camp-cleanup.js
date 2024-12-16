import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Camp Cleanup",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
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
}

function fruitOne(pairSectionIds) {
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

function fruitTwo(pairSectionIds) {
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

run(() => init({ star: "both" }))
