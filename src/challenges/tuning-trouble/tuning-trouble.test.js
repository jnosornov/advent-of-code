import { equal } from "assert"
import TuningTrouble from "./tuning-trouble.js"

describe("Tuning Trouble", () => {
  it("matches characters processed before the first start-of-packet marker is detected", async () => {
    const test = 7
    const [fruit1] = await TuningTrouble({ star: "1" })

    equal(fruit1, test)
  })

  it("matches characters processed before the first start-of-message marker is detected", async () => {
    const test = 19
    const [fruit2] = await TuningTrouble({ star: "2" })

    equal(fruit2, test)
  })
})
