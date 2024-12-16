import { equal } from "assert"
import RedNosedSports, { checkReportSafeness } from "./red-nosed-sports.js"

describe("Red-Nosed Sports", () => {
  it("matches the number of safe reports", async () => {
    const safeReports = 2
    const [fruit1] = await RedNosedSports({ star: "1" })

    equal(fruit1, safeReports)
  })

  it("matches the number of safe reports after the Problem Dampener reactor module was mounted", async () => {
    const safeReports = 4
    const [fruit2] = await RedNosedSports({ star: "2" })

    equal(fruit2, safeReports)
  })

  it("returns safe report when all levels are increasing, and are within safe limits", () => {
    const isSafeReport = checkReportSafeness({ report: ["42", "45", "47", "50"] })
    equal(isSafeReport, true)
  })

  it("returns safe report when all levels are decreasing, and are within safe limits", () => {
    const isSafeReport = checkReportSafeness({ report: ["50", "47", "45", "42"] })
    equal(isSafeReport, true)
  })
})
