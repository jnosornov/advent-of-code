import chalk from "chalk"
import numeral from "numeral"
import { getFileContent } from "./file.js"
import { FRUIT_POINTER } from "../constants.js"

async function runChallenge({ star, challenge, solutions, directory, opts }) {
  const puzzle = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents } = await getFileContent({ path: `${directory}/${puzzle}`, opts })
  const stars = collectStars({
    star,
    contents,
    callbacks: solutions
  })

  logStars({ challenge, stars })
  return stars
}

function run(callback) {
  const { NODE_ENV } = process.env
  if (NODE_ENV === "test") return
  callback()
}

function collectStars({ star, contents, callbacks = [] }) {
  if (!callbacks.length) return []
  const [cb1, cb2] = callbacks

  if (star === "1" && cb1) return [cb1(contents)]
  if (star === "2" && cb2) return [cb2(contents)]

  if (star === "both" && (cb1 && cb2)) {
    return [cb1(contents), cb2(contents)]
  }

  return []
}

function logStars({ challenge = "", stars = [] }) {
  const [first, second] = stars

  console.log("\r")
  console.log(chalk.bold(challenge))
  console.log("\r")

  if (first !== undefined) {
    console.log(`${FRUIT_POINTER} 1: ${chalk.yellow(numeral(first).format("0,0"))}`)
  }

  if (second !== undefined) {
    console.log(`${FRUIT_POINTER} 2: ${chalk.yellow(numeral(second).format("0,0"))}`)
  }

  console.log("\r")
}

export { run, runChallenge }
