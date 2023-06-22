import { equal } from "assert"
import * as boilingBoulders from "./boiling-boulders.js"

describe("Boiling Bolders", () => {
  it("the scanned lava droplets surface area is 64", async () => {
    const { surfaceArea } = await boilingBoulders.init("./input.sample.txt")
    equal(surfaceArea, 64)
  })

  it("the scanned lava droplets surface area is 3496", async () => {
    const { surfaceArea } = await boilingBoulders.init()
    equal(surfaceArea, 3496)
  })
})
