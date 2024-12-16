import { equal } from "assert"
import MullItOver, { getOperand } from "./mull-it-over.js"

describe("Mull It Over", () => {
  it("should match the result of the uncorrupted instructions", async () => {
    const uncorruptedOperationsResult = 161
    const [fruit1] = await MullItOver({ star: "1" })

    equal(fruit1, uncorruptedOperationsResult)
  })

  it.skip("should match the result of the uncorrupted instructions with enable operations", async () => {
    const uncorruptedOperationsResult = 48
    const [fruit2] = await MullItOver({ star: "2" })

    equal(fruit2, uncorruptedOperationsResult)
  })

  it("should not return an operand when memory is incorret", () => {
    const operand = getOperand({ memory: 2345, index: 0 })
    equal(operand, null)
  })

  it ("should return a three character operand", () => {
    const operand = getOperand({ memory: "245ty", index: 0 })
    equal(operand, "245")
  })

  it ("should return a one character operand", () => {
    const operand = getOperand({ memory: "245ty", index: 2 })
    equal(operand, "5")
  })
})
