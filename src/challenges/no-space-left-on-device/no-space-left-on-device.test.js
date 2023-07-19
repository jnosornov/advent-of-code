import { equal } from "assert"
import NoSpaceLeftOnDevice from "./no-space-left-on-device.js"

describe("No Space Left On Device", () => {
  it("matches the sum of sizes of the directories with at most 100000 file size", async () => {
    const test = 95437
    const { fruit1 } = await NoSpaceLeftOnDevice({ fruit: "1" })

    equal(fruit1, test)
  })
})