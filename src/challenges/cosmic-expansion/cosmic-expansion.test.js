import { equal } from "assert"
import CosmicExpansion from "./cosmic-expansion.js"

describe("Cosmic Expansion", () => {
  it("matches the path length between galaxy pairs when galaxies are younger", async () => {
    const expected = 374
    const [fruit1] = await CosmicExpansion({ star: "1" })

    equal(fruit1, expected)
  })

  it("matches the path length between galaxy pairs when galaxies are older", async () => {
    const expected = 82000210
    const [fruit2] = await CosmicExpansion({ star: "2" })

    equal(fruit2, expected)
  })
})
