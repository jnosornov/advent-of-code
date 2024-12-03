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

  const fruits = collectFruits({ fruit, callbacks: [() => fruitOne(reports)] })
  const { fruit1 } = fruits

  logFruits({
    title: "Red-Nosed Sports",
    fruitOne: {
      message: fruit1 ? `the total amount of safe reports are ${chalk.yellow(numeral(fruit1).format("0,0"))}` : null
    }
  })
}

function fruitOne(reports) {
  let totalOfSafeReports = 0

  for (let i = 0; i <= reports.length - 1; i++) {
    let areLevelsIncreasing
    let isSafeReport = true
    const report = reports[i]

    for (let j = 1; j <= report.length - 1; j++) {
      const levelsDelta = parseInt(reports[i][j]) - parseInt(reports[i][j - 1])
      const isWithinSafeLimits = Math.abs(levelsDelta) >= 1 && Math.abs(levelsDelta) <= 3 && levelsDelta !== 0
      const isLevelsBehaviorTheSame = (areLevelsIncreasing === undefined || areLevelsIncreasing === (levelsDelta > 0))
      areLevelsIncreasing = levelsDelta > 0

      if (isWithinSafeLimits && isLevelsBehaviorTheSame) continue
      isSafeReport = false
      break
    }

    if (!isSafeReport) continue
    totalOfSafeReports++
  }

  return totalOfSafeReports
}

run(() => init({ fruit: "1" }))
