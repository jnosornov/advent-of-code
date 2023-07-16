import chalk from "chalk"
import numeral from "numeral"
import { getFileContent } from "../../helpers/file.js"
import { logFruits, collectFruits, run } from "../../helpers/general.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"

  const datastream = await getFileContent({
    path: new URL(filename, import.meta.url)
  })

  function fruitOne() {
    const charactersMap = new Map()
    const markerCharacters = 4

    for (let i = 0; i <= datastream.length - 1; i++) {
      const character = datastream[i]

      charactersMap.has(character)
        ? charactersMap.set(character, charactersMap.get(character) + 1)
        : charactersMap.set(character, 1)

      const isMarker = charactersMap.size === markerCharacters && i >= (markerCharacters - 1)
      if (isMarker) return i + 1

      if (i < (markerCharacters - 1)) continue

      const outOfWindowCharacter = datastream[i - (markerCharacters - 1)]
      const outOfWindowCharacterOccurrence = charactersMap.get(outOfWindowCharacter)

      outOfWindowCharacterOccurrence > 1
        ? charactersMap.set(outOfWindowCharacter, outOfWindowCharacterOccurrence - 1)
        : charactersMap.delete(outOfWindowCharacter)
    }
  }

  function fruitTwo() {
    const charactersMap = new Map()
    const markerCharacters = 14

    for (let i = 0; i <= datastream.length - 1; i++) {
      const character = datastream[i]

      charactersMap.has(character)
        ? charactersMap.set(character, charactersMap.get(character) + 1)
        : charactersMap.set(character, 1)

      const isMarker = charactersMap.size === markerCharacters && i >= (markerCharacters - 1)
      if (isMarker) return i + 1

      if (i < (markerCharacters - 1)) continue

      const outOfWindowCharacter = datastream[i - (markerCharacters - 1)]
      const outOfWindowCharacterOccurrence = charactersMap.get(outOfWindowCharacter)

      outOfWindowCharacterOccurrence > 1
        ? charactersMap.set(outOfWindowCharacter, outOfWindowCharacterOccurrence - 1)
        : charactersMap.delete(outOfWindowCharacter)
    }
  }

  const fruits = collectFruits({ fruit, callbacks: [fruitOne, fruitTwo] })
  const { fruit1, fruit2 } = fruits

  logFruits({
    title: "Tuning Troubles",
    fruitOne: {
      message: fruit1 ? `A total of ${chalk.yellow(numeral(fruit1).format("0,0"))} characters need to be processed before the first start-of-packet marker is detected` : null
    },
    fruitTwo: {
      message: fruit2 ? `A total of ${chalk.yellow(numeral(fruit2).format("0,0"))} characters need to be processed before the first start-of-message marker is detected` : null
    }
  })

  return fruits
}

run(() => init({ fruit: "both" }))
