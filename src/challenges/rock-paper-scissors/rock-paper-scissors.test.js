import { equal } from "assert"
import RockPaperScissors from "./rock-paper-scissors.js"

describe("Rock Paper Scissors", () => {
  it("matches game score when game strategy is based on game shapes", async () => {
    const test = 15
    const [fruit1] = await RockPaperScissors({ star: "1" })

    equal(fruit1, test)
  })

  it("matches game score when game strategy is based on round outcome", async () => {
    const test = 12
    const [fruit2] = await RockPaperScissors({ star: "2" })
    equal(fruit2, test)
  })
})
