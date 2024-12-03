import { equal } from "assert"
import RedNosedSports from "./red-nosed-sports.js"

describe("Red-Nosed Sports", () => {
  it("matches the number of safe reports", async () => {
    const safeReports = 2
    const { fruit1 } = await RedNosedSports({ fruit: "1" })

    equal(fruit1, safeReports)
  })
})
