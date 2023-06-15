import chalk from "chalk"
import { run, logFruits, collectFruits } from "../../helpers/general.js"
import { NEW_LINE, EMPTY_SPACE } from "../../constants.js"
import { getFileContent } from "../../helpers/file.js"

class RockPaperScissors {
  constructor({ rounds, scoring }) {
    this.score = 0
    this.rounds = rounds
    this.scoring = scoring
    this.gameShapes = { rock: "R", paper: "P", scissors: "S" }
  }
  
  #mapToGameShapes(shape) {
    const obj = {
      A: "rock",
      B: "paper",
      C: "scissors",
      X: "rock",
      Y: "paper",
      Z: "scissors"
    }

    return this.gameShapes[obj[shape]]
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
      this.score += shapeScoring + this.scoring.roundOutcome["draw"]
    }

    if (rules.conditions.win) {
      this.score += shapeScoring + this.scoring.roundOutcome["won"]
    }

    if (rules.conditions.lose) {
      this.score += shapeScoring + this.scoring.roundOutcome["lost"]
    }
  }

  play() {
    for (let i = 0; i < this.rounds.length; i++) {
      const round = Object
        .values(this.rounds[i])
        .reduce((accum, shape, index) => {
          const gameShape = this.#mapToGameShapes(shape)

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

      this.#computeRoundOutcome({ round, index: i })
    }

    return this.score
  }
}

export default async function init({ fruit }) {
   // TODO: move within getFileContent
   const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"

   const contents =  await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => {
      const n = entry.split(`${NEW_LINE}`)
      return n.map((el, index) => {
        const [elf, me] = el.split(`${EMPTY_SPACE}`)
        
        return {
          elf,
          me
        }
      })
    },
  })

  const { input: rounds } = contents

  function fruitOne() {
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

    return {
      gameScore: Tournament.play()
    }
  }
  

  const fruits = collectFruits({ fruit, callbacks: [fruitOne]})
  const { fruit1 } = fruits

  logFruits({
    title: "Rock Paper Scissors",
    fruitOne: {
      message: `after playing all the rounds the score is ${chalk.yellow(fruit1.gameScore)} points`
    }
  })

  return fruits
}

run(() => init({ fruit: "1" }))