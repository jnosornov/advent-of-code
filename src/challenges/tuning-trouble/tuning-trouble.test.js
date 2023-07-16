import { equal } from "assert"
import TuningTrouble from "./tuning-trouble.js"

describe("Tuning Trouble", () => {
  it("matches characters processed before the first start-of-packet marker is detected", async () => {
    const test = 7
    const { fruit1 } = await TuningTrouble({ fruit: "1" })

    equal(fruit1, test)
  })
})
