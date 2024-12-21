import { equal } from "assert"
import CeresSearch from "./ceres-search.js"

describe("Ceres Search", () => {
  it("mathes the number of XMAS found", async () => {
    const test = 18
    const [fruit1] = await CeresSearch({ star: "1" })

    equal(fruit1, test)
  })
})
