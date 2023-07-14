import { equal } from "assert"
import SupplyStacks from "./supply-stacks.js"

describe("Supply Stacks", () => {
  it("matches crates at the top of each stack when crane CrateMover 9000 is used", async () => {
    const test = "CMZ"
    const { fruit1 } = await SupplyStacks({ fruit: "1" })

    equal(fruit1, test)
  })

  it("matches crates at the top of each stack when crane CrateMover 9001 is used", async () => {
    const test = "MCD"
    const { fruit2 } = await SupplyStacks({ fruit: "2" })

    equal(fruit2, test)
  })
})
