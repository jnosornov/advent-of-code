import { equal } from "assert"
import RockPaperScissors from "./rock-paper-scissors.js"

describe("Rock Paper Scissors", () => {
  it("matches the game score", async () => {
    const test = 15
    const { fruit1 } = await RockPaperScissors({ fruit: "1" })

    equal(fruit1.gameScore, test)
  })
})