import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { NEW_LINE, EMPTY_SPACE } from "../../constants.js"

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

function checkReportSafeness({ report, tolerance = 0 }) {
  let isSafeReport = true

  const LOWER_SAFE_LIMIT = 1
  const UPPER_SAFE_LIMIT = 3
  let areLevelsIncreasing = null

  for (let j = 0; j < report.length - 1; j++) {
    const start = report[j]
    const end = report[j + 1]
    const delta = parseInt(end) - parseInt(start)

    const isLevelsBehaviorTheSame = areLevelsIncreasing === null || areLevelsIncreasing === (delta > 0)
    const isWithinSafeLimits = Math.abs(delta) >= LOWER_SAFE_LIMIT && Math.abs(delta) <= UPPER_SAFE_LIMIT && delta !== 0
    areLevelsIncreasing = delta > 0

    if (isWithinSafeLimits && isLevelsBehaviorTheSame) continue

    if (tolerance !== 0) {
      let isToleranceReportSafe = false
      const toleranceReports = [
        removeListItem({ list: report, index: j }),
        removeListItem({ list: report, index: j + 1 })
      ]

      for (let k = 0; k <= toleranceReports.length - 1; k++) {
        const isSafe = checkReportSafeness({ report: toleranceReports[k] })

        if (!isSafe) continue
        isToleranceReportSafe = true
        break
      }

      if (isToleranceReportSafe) break
    }

    isSafeReport = false
    break
  }

  return isSafeReport
}

function removeListItem({ list, index }) {
  const updatedList = []

  for (let i = 0; i <= list.length - 1; i++) {
    if (i === index) continue
    updatedList.push(list[i])
  }

  return updatedList
}

run(() => init({ fruit: "2" }))
