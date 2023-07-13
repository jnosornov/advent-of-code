import { equal } from "assert"
import SupplyStacks from "./supply-stacks.js"

describe("Supply Stacks", () => {
  it("matches crates at the top of each stack when rearrangement procedure completes", async () => {
    const test = "CMZ"
    const { fruit1 } = await SupplyStacks({ fruit: "1" })

    equal(fruit1, test)
  })
})
