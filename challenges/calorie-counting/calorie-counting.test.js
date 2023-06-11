import { equal } from "assert"
import CalorieCounting from "./calorie-counting.js"

describe("Calorie Counting", () => {
  it("matches the most calories carried by an Elf", async () => {
    const test = 24000
    const { fruit1 } = await CalorieCounting({ fruit: "1" })

    equal(fruit1.elfCalories, test)
  })
})