import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE } from "../../constants.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: lists } = await getFileContent({
    path: new URL(filename, import.meta.url),
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

  const fruits = collectFruits({ fruit, callbacks: [() => fruitOne({ ...lists }), () => fruitTwo({ ...lists })] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Historian Hysteria",
    fruitOne: {
      message: fruit1 ? `the total distance between location lists is ${chalk.yellow(numeral(fruit1).format("0,0"))} units` : null
    },
    fruitTwo: {
      message: fruit2 ? `the similarity score is ${chalk.yellow(numeral(fruit2).format("0,0"))} units` : null
    }
  })

  return fruits
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

run(() => init({ fruit: "both" }))
