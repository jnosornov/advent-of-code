import { equal } from "assert"
import CalorieCounting from "./calorie-counting.js"

describe("Calorie Counting", () => {
  it("matches the most calories carried by an Elf", async () => {
    const test = 24000
    const [fruit1] = await CalorieCounting({ star: "1" })

    equal(fruit1, test)
  })

  it("matches the top three elves calories amount", async () => {
    const test = 45000
    const [fruit2] = await CalorieCounting({ star: "2" })

    equal(fruit2, test)
  })
})
