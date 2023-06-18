import { equal } from "assert"
import CampCleanup from "./camp-cleanup.js"

describe("Camp Cleanup", () => {
  it("mathes one range fully containing section assignments", async() => {
    const test = 2
    const { fruit1 } = await CampCleanup({ fruit: "1" })
    
    equal(fruit1, test)
  })

  it("mathes all overlaping pairs section assignments", async() => {
    const test = 4
    const { fruit2 } = await CampCleanup({ fruit: "2" })
    
    equal(fruit2, test)
  })
})