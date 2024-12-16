import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"
import { NEW_LINE, EMPTY_SPACE } from "../../constants.js"

class RockPaperScissors {
  constructor({ rounds, scoring, useStrategy = false }) {
    this.score = 0
    this.rounds = rounds
    this.scoring = scoring
    this.useStrategy = useStrategy
    this.gameShapes = { rock: "R", paper: "P", scissors: "S" }
    this.roundOutcome = { lose: "X", draw: "Y", win: "Z" }
  }

  #mapToGameShape(value) {
    const obj = {
      A: "rock",
      B: "paper",
      C: "scissors",
      X: "rock",
      Y: "paper",
      Z: "scissors"
    }

    return this.gameShapes[obj[value]]
  }

  #mapStrategyToGameShape(round) {
    const { elf: elfShape, me: strategy } = round

    if (strategy === this.roundOutcome.lose) {
      if ((elfShape === this.gameShapes.rock)) {
        return this.gameShapes.scissors
      }

      if ((elfShape === this.gameShapes.paper)) {
        return this.gameShapes.rock
      }

      if ((elfShape === this.gameShapes.scissors)) {
        return this.gameShapes.paper
      }
    }

    if (strategy === this.roundOutcome.draw) {
      return elfShape
    }

    if (strategy === this.roundOutcome.win) {
      if ((elfShape === this.gameShapes.rock)) {
        return this.gameShapes.paper
      }

      if ((elfShape === this.gameShapes.paper)) {
        return this.gameShapes.scissors
      }

      if ((elfShape === this.gameShapes.scissors)) {
        return this.gameShapes.rock
      }
    }
  }

  #mapRoundToGameShapes(round) {
    if (this.useStrategy) {
      return Object
        .values(round)
        .reduce((accum, value, index, array) => {
          const elfShape = this.#mapToGameShape(array[0])

          if (index === 0) {
            return {
              ...accum,
              elf: elfShape
            }
          }

          return {
            ...accum,
            me: this.#mapStrategyToGameShape({ elf: elfShape, me: value })
          }
        }, {})
    }

    return Object
      .values(round)
      .reduce((accum, value, index) => {
        const gameShape = this.#mapToGameShape(value)

        if (index === 0) {
          return {
            ...accum,
            elf: gameShape
          }
        }

        return {
          ...accum,
          me: gameShape
        }
      }, {})
  }

  #scoringRules(shapeValue, elfShapeValue) {
    const draw = (shapeValue === elfShapeValue)

    const win =
      (shapeValue === "R" && elfShapeValue === "S") ||
      (shapeValue === "P" && elfShapeValue === "R") ||
      (shapeValue === "S" && elfShapeValue === "P")

    const lose =
      (shapeValue === "R" && elfShapeValue === "P") ||
      (shapeValue === "P" && elfShapeValue === "S") ||
      (shapeValue === "S" && elfShapeValue === "R")

    return {
      conditions: {
        draw,
        win,
        lose
      }
    }
  }

  #computeRoundOutcome({ round, index }) {
    const { elf: elfShapeValue, me: shapeValue } = round

    const shapeKey = Object
      .keys(this.gameShapes)
      .find(key => this.gameShapes[key] === shapeValue)
    const shapeScoring = this.scoring.shape[shapeKey]

    const rules = this.#scoringRules(shapeValue, elfShapeValue)

    if (rules.conditions.draw) {
      this.score += shapeScoring + this.scoring.roundOutcome.draw
    }

    if (rules.conditions.win) {
      this.score += shapeScoring + this.scoring.roundOutcome.won
    }

    if (rules.conditions.lose) {
      this.score += shapeScoring + this.scoring.roundOutcome.lost
    }
  }

  play() {
    for (let i = 0; i < this.rounds.length; i++) {
      const round = this.#mapRoundToGameShapes(this.rounds[i])
      this.#computeRoundOutcome({ round, index: i })
    }

    return this.score
  }
}

function fruitOne(rounds) {
  const Tournament = new RockPaperScissors({
    rounds,
    scoring: {
      shape: {
        rock: 1,
        paper: 2,
        scissors: 3
      },
      roundOutcome: {
        lost: 0,
        draw: 3,
        won: 6
      }
    }
  })

  return Tournament.play()
}

function fruitTwo(rounds) {
  const Tournament = new RockPaperScissors({
    rounds,
    scoring: {
      shape: {
        rock: 1,
        paper: 2,
        scissors: 3
      },
      roundOutcome: {
        lost: 0,
        draw: 3,
        won: 6
      }
    },
    useStrategy: true
  })

  return Tournament.play()
}

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Red-Nosed Sports",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url)),
    opts: (entry) => {
      const n = entry.split(`${NEW_LINE}`)
      return n.map((el, index) => {
        const [elf, me] = el.split(`${EMPTY_SPACE}`)

        return {
          elf,
          me
        }
      })
    }
  })
}

run(() => init({ star: "both" }))
