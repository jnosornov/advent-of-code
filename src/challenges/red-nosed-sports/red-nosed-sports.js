import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE, EMPTY_SPACE } from "../../constants.js"
import { removeListItem } from "../../helpers/tools.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: reports } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => {
      const lines = entry.split(NEW_LINE)
      return lines.map((item) => item.split(EMPTY_SPACE))
    }
  })

  const fruits = collectFruits({ fruit, callbacks: [() => fruitOne(reports), () => fruitTwo(reports)] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Red-Nosed Sports",
    fruitOne: {
      message: fruit1 ? `the total amount of safe reports are ${chalk.yellow(numeral(fruit1).format("0,0"))}` : null
    },
    fruitTwo: {
      message: fruit2 ? `the total amount of safe reports after the Problem Dampener module was mounted are ${chalk.yellow(numeral(fruit2).format("0,0"))}` : null
    }
  })

  return fruits
}

function fruitOne(reports) {
  let totalOfSafeReports = 0

  for (let i = 0; i <= reports.length - 1; i++) {
    const report = reports[i]
    const isSafeReport = checkReportSafeness({ report })

    if (!isSafeReport) continue
    totalOfSafeReports++
  }

  return totalOfSafeReports
}

function fruitTwo(reports) {
  let totalOfSafeReports = 0

  for (let i = 0; i <= reports.length - 1; i++) {
    const report = reports[i]
    const isSafeReport = checkReportSafeness({ report, tolerance: 1 })

    if (!isSafeReport) continue
    totalOfSafeReports++
  }

  return totalOfSafeReports
}

export function checkReportSafeness({ report, tolerance = 0 }) {
  const areLevelsIncreasing = []

  for (let j = 0; j < report.length - 1; j++) {
    const start = report[j]
    const end = report[j + 1]
    const delta = parseInt(end) - parseInt(start)

    areLevelsIncreasing.push(delta > 0)
    const areLevelsStable = delta === 0
    const isWithinSafeLimits = Math.abs(delta) >= 1 && Math.abs(delta) <= 3
    const isLevelsBehaviorTheSame = areLevelsIncreasing.length > 1 ? ((areLevelsIncreasing[j] === areLevelsIncreasing[j - 1]) && !areLevelsStable) : true

    if (isWithinSafeLimits && isLevelsBehaviorTheSame) continue
    if (tolerance === 0) return false

    const indexesToRemove = j > 0 ? [j - 1, j, j + 1] : [j, j + 1]
    return withReactorModule({ report, indexesToRemove, tolerance: tolerance - 1 })
  }

  return true
}

function withReactorModule({ report, indexesToRemove, tolerance }) {
  const reports = indexesToRemove.map((levelIndex) => removeListItem({ list: report, index: levelIndex }))

  for (let k = 0; k <= reports.length - 1; k++) {
    const report = reports[k]
    const isSafeReport = checkReportSafeness({ report, tolerance })
    if (isSafeReport) return true
  }

  return false
}

run(() => init({ fruit: "both" }))