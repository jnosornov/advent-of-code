import chalk from "chalk"
import numeral from "numeral"
import { collectFruits, logFruits, run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import { isNumeric } from "../../helpers/tools.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: corruptedMemory } = await getFileContent({
    path: new URL(filename, import.meta.url)
  })

  const fruits = collectFruits({ fruit, callbacks: [() => fruitOne(corruptedMemory)] })
  const { fruit1 } = fruits

  logFruits({
    title: "Mull It Over",
    fruitOne: {
      message: fruit1 ? `the result of adding the uncorrupted instructions are ${chalk.yellow(numeral(fruit1).format("0,0"))}` : null
    }
  })

  return fruits
}

function fruitOne(memory) {
  return computeMemory(memory)
}

export function computeMemory(memory) {
  let result = 0

  for (let i = 0; i <= memory.length - 1; i++) {
    const matchesStartOfOperation = `${memory[i]}${memory[i + 1]}${memory[i + 2]}${memory[i + 3]}` === "mul("
    const multiplicand = getOperand({ memory, index: i + 4 })

    if (multiplicand.length === 0) continue
    const separatorIdx = i + 4 + multiplicand.length
    const matchesOperandsSeparator = memory[separatorIdx] === ","

    const multiplier = getOperand({ memory, index: separatorIdx + 1 })

    if (multiplier.length === 0) continue
    const endOfOperationIdx = separatorIdx + multiplier.length + 1
    const matchesEndOfOperation = memory[endOfOperationIdx] === ")"

    const isValidInstruction = matchesStartOfOperation && matchesOperandsSeparator && matchesEndOfOperation

    if (!isValidInstruction) continue
    result = result + (parseInt(multiplicand) * parseInt(multiplier))
  }

  return result
}

export function getOperand({ memory, index, times = 3 }) {
  if (typeof memory !== "string") return null

  let item = null
  let counter = 0
  let operand = ""

  do {
    times = times - 1
    item = memory[index + counter]
    operand = isNumeric(item) ? `${operand}${item}` : operand

    counter++
  } while (times > 0 && isNumeric(item))

  return operand
}

run(() => init({ fruit: "1" }))
