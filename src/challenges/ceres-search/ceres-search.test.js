import { equal } from "assert"
import CeresSearch from "./ceres-search.js"

describe("Ceres Search", () => {
  it("mathes the number of XMAS found", async () => {
    const test = 18
    const [fruit1] = await CeresSearch({ star: "1" })

    equal(fruit1, test)
  })

  it("mathes the number of MAS in the X form found", async () => {
    const test = 9
    const [fruit2] = await CeresSearch({ star: "2" })

    equal(fruit2, test)
  })
})
