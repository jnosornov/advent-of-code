import { equal } from "assert"
import HistorianHysteria from "./historian-hysteria.js"

describe("Historian Hysteria", () => {
  it("matches the total distance between both location lists", async () => {
    const totalDistance = 11
    const { fruit1 } = await HistorianHysteria({ fruit: "1" })

    equal(fruit1, totalDistance)
  })

  it("matches the similarity score", async () => {
    const similarityScore = 31
    const { fruit2 } = await HistorianHysteria({ fruit: "2" })

    equal(fruit2, similarityScore)
  })
})
