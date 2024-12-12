import { deepEqual } from "assert"
import { removeListItem } from "./tools.js"

describe("removeListItem", () => {
  it("it should remove the item out of the list", () => {
    const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 2 })
    const expected = ["4", "10", "3"]

    deepEqual(updatedList, expected)
  })

  it("it should remove the first item in the list", () => {
    const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 0 })
    const expected = ["10", "15", "3"]

    deepEqual(updatedList, expected)
  })

  it("it should remove the last item in the list", () => {
    const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 3 })
    const expected = ["4", "10", "15"]

    deepEqual(updatedList, expected)
  })
})
