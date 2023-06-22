import { equal } from "assert"
import CalorieCounting from "./calorie-counting.js"

describe("Calorie Counting", () => {
  it("matches the most calories carried by an Elf", async () => {
    const test = 24000
    const { fruit1 } = await CalorieCounting({ fruit: "1" })
    console.log("test 1", fruit1)

    equal(fruit1.elfCalories, test)
  })

  it("matches the top three elves calories amount", async () => {
    const test = 45000
    const { fruit2 } = await CalorieCounting({ fruit: "2" })

    equal(fruit2.elvesCalorieAmount, test)
  })
})
