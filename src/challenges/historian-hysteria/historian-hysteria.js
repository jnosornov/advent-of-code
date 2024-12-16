import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Historian Hysteria",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (entry) => {
      const lines = entry.split(NEW_LINE)

      const firstGroupList = []
      const secondGroupList = []

      lines.forEach((line) => {
        const columns = line.split(/\s+/)
        firstGroupList.push(parseInt(columns[0]))
        secondGroupList.push(parseInt(columns[1]))
      })

      return { firstGroupList, secondGroupList }
    }
  })
}

function fruitOne({ firstGroupList, secondGroupList }) {
  let accum = 0
  const distances = []

  firstGroupList.sort()
  secondGroupList.sort()

  firstGroupList.forEach((item, index) => {
    const distance = Math.abs(item - secondGroupList[index])
    accum = accum + distance
    distances.push(distance)
  })

  return accum
}

function fruitTwo({ firstGroupList, secondGroupList }) {
  const map = {}
  let similarityScore = 0

  firstGroupList.forEach((item) => {
    map[item] = 0
  })

  secondGroupList.forEach((item) => {
    if (map[item] !== undefined) {
      map[item]++
    }
  })

  firstGroupList.forEach((item) => {
    similarityScore = similarityScore + item * map[item]
  })

  return similarityScore
}

run(() => init({ star: "both" }))
