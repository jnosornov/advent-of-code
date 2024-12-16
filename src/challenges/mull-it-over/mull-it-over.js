import path from "path"
import { fileURLToPath } from "url"
import { isNumeric } from "../../helpers/tools.js"
import { runChallenge, run } from "../../helpers/general.js"

export default async function init() {
  return await runChallenge({
    star: "both",
    challenge: "Moll It Over",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url))
  })
}

function fruitOne(memory) {
  return computeMemory(memory)
}

function fruitTwo(memory) {
  return computeMemoryWithOperations(memory)
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

export function computeMemoryWithOperations(memory) {
  let result = 0
  let areInstructionsEnabled = true

  for (let i = 0; i <= memory.length - 1; i++) {
    const matchesEnableInstruction = `${memory[i]}${memory[i + 1]}${memory[i + 2]}${memory[i + 3]}` === "do()"
    const matchesDisableInstruction = `${memory[i]}${memory[i + 1]}${memory[i + 2]}${memory[i + 3]}${memory[i + 4]}${memory[i + 5]}${memory[i + 6]}` === "don't()"

    if (matchesEnableInstruction) {
      areInstructionsEnabled = true
      continue
    }

    if (matchesDisableInstruction) {
      areInstructionsEnabled = false
      continue
    }

    if (!areInstructionsEnabled) continue

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

run(() => init())
