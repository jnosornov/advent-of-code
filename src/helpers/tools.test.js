import { equal, deepEqual } from "assert"
import { removeListItem, isNumeric } from "./tools.js"

describe("tools", () => {
  describe("removeListItem", () => {
    it("should remove the item out of the list", () => {
      const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 2 })
      const expected = ["4", "10", "3"]

      deepEqual(updatedList, expected)
    })

    it("should remove the first item in the list", () => {
      const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 0 })
      const expected = ["10", "15", "3"]

      deepEqual(updatedList, expected)
    })

    it("should remove the last item in the list", () => {
      const updatedList = removeListItem({ list: ["4", "10", "15", "3"], index: 3 })
      const expected = ["4", "10", "15"]

      deepEqual(updatedList, expected)
    })
  })

  describe("isNumeric", () => {
    it("should return false when string is not numeric", () => {
      const text = "r"

      equal(isNumeric(text), false)
    })

    it("should return true when string is numeric", () => {
      const text = "9"

      equal(isNumeric(text), true)
    })
  })
})
