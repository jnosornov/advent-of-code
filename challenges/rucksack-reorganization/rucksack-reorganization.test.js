import { equal } from "assert"
import RucksackReorganization,
{ getRuckSackSharedItem,
  getArrangementPriority,
  getGroupBadge
} from "./rucksack-reorganization.js"

describe("Rucksack Reorganization", () => {
  describe("finds rucksack's shared item type between compartments", () => {
    it("for the 1st rucksack", () => {
      const test = "p"
      const sharedItem = getRuckSackSharedItem("vJrwpWtwJgWrhcsFMMfFFhFp")
  
      equal(sharedItem, test)
    })
  
    it("for the 2nd rucksack", () => {
      const test = "L"
      const sharedItem = getRuckSackSharedItem("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL")
  
      equal(sharedItem, test)
    })
    
    it("for the 3rd rucksack", () => {
      const test = "P"
      const sharedItem = getRuckSackSharedItem("PmmdzqPrVvPwwTWBwg")
  
      equal(sharedItem, test)
    })
  
    it("for the 4th rucksack", () => {
      const test = "v"
      const sharedItem = getRuckSackSharedItem("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn")
  
      equal(sharedItem, test)
    })
  
    it("for the 5th rucksack", () => {
      const test = "t"
      const sharedItem = getRuckSackSharedItem("ttgJtRGJQctTZtZT")
  
      equal(sharedItem, test)
    })
  
    it("for the 6th rucksack", () => {
      const test = "s"
      const sharedItem = getRuckSackSharedItem("CrZsJsPPZsGzwwsLwLmpwMDw")
  
      equal(sharedItem, test)
    })
  })

  describe("matches item type arregment priority", () => {
    it("when item is lowercase lower bound", () => {
      const test = 1
      const itemPriority = getArrangementPriority("a")

      equal(itemPriority, test)
    })

    it("when item is lowercase upper bound", () => {
      const test = 26
      const itemPriority = getArrangementPriority("z")

      equal(itemPriority, test)
    })

    it("when item is uppercase lower bound", () => {
      const test = 27
      const itemPriority = getArrangementPriority("A")

      equal(itemPriority, test)
    })

    it("when item is uppercase upper bound", () => {
      const test = 52
      const itemPriority = getArrangementPriority("Z")

      equal(itemPriority, test)
    })
  })

  describe("finds group badge", () => {
    it("for the 1st Elves group", () => {
      const test = "r"
      const groupBadge = getGroupBadge([
        "vJrwpWtwJgWrhcsFMMfFFhFp",
        "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
        "PmmdzqPrVvPwwTWBwg"
      ])

      equal(groupBadge, test)
    })

    it("for the 2nd Elves group", () => {
      const test = "Z"
      const groupBadge = getGroupBadge([
        "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
        "ttgJtRGJQctTZtZT",
        "CrZsJsPPZsGzwwsLwLmpwMDw"
      ])

      equal(groupBadge, test)
    })
  })


  describe("matches the rucksacks priority sum", () => {
    it("when the item type shared between compartments is found", async () => {
      const test = 157
      const { fruit1 } = await RucksackReorganization({ fruit: "1" })
  
      equal(fruit1, test)
    })

    it("when the Elves group badge item type is found", async () => {
      const test = 70
      const { fruit2 } = await RucksackReorganization({ fruit: "2" })
  
      equal(fruit2, test)
    })
  })
})