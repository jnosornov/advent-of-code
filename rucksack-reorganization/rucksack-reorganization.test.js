import { equal } from "assert"
import rucksackReorganization,{ getRuckSackSharedItem, getArrangementPriority } from "./rucksack-reorganization.js"

describe("Rucksack Reorganization", () => {
  describe("finds rucksack's shared item type between compartments", () => {
    it("for the 1st rucksack", () => {
      const rucksack = "vJrwpWtwJgWrhcsFMMfFFhFp"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "p"
  
      equal(sharedItem, expectedItem)
    })
  
    it("for the 2nd rucksack", () => {
      const rucksack = "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "L"
  
      equal(sharedItem, expectedItem)
    })
    
    it("for the 3rd rucksack", () => {
      const rucksack = "PmmdzqPrVvPwwTWBwg"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "P"
  
      equal(sharedItem, expectedItem)
    })
  
    it("for the 4th rucksack", () => {
      const rucksack = "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "v"
  
      equal(sharedItem, expectedItem)
    })
  
    it("for the 5th rucksack", () => {
      const rucksack = "ttgJtRGJQctTZtZT"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "t"
  
      equal(sharedItem, expectedItem)
    })
  
    it("for the 6th rucksack", () => {
      const rucksack = "CrZsJsPPZsGzwwsLwLmpwMDw"
      const sharedItem = getRuckSackSharedItem(rucksack)
      const expectedItem = "s"
  
      equal(sharedItem, expectedItem)
    })
  })

  describe("matches item type arregment priority", () => {
    it("when item is lowercase lower bound", () => {
      const item = "a"
      const itemPriority = getArrangementPriority(item)
      const expectedPriority = 1

      equal(itemPriority, expectedPriority)
    })

    it("when item is lowercase upper bound", () => {
      const item = "z"
      const itemPriority = getArrangementPriority(item)
      const expectedPriority = 26

      equal(itemPriority, expectedPriority)
    })

    it("when item is uppercase lower bound", () => {
      const item = "A"
      const itemPriority = getArrangementPriority(item)
      const expectedPriority = 27

      equal(itemPriority, expectedPriority)
    })

    it("when item is uppercase upper bound", () => {
      const item = "Z"
      const itemPriority = getArrangementPriority(item)
      const expectedPriority = 52

      equal(itemPriority, expectedPriority)
    })
  })

  it("matches the rucksacks priority sum", async () => {
    const prioritySum = await rucksackReorganization("./input.sample.txt")
    const expectedSum = 157

    equal(prioritySum, expectedSum)
  })
})