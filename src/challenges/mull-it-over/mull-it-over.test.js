import { equal } from "assert"
import MullItOver from "./mull-it-over.js"

describe("Mull It Over", () => {
  it("should match the result of the uncorrupted instructions", async () => {
    const uncorruptedOperationsResult = 161
    const { fruit1 } = await MullItOver({ fruit: "1" })

    equal(fruit1, uncorruptedOperationsResult)
  })
})