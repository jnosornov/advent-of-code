import path from "path"
import { fileURLToPath } from "url"
import { run, runChallenge } from "../../helpers/general.js"

export default async function init({ star }) {
  return await runChallenge({
    star,
    challenge: "Supply Stacks",
    solutions: [fruitOne, fruitTwo],
    directory: path.dirname(fileURLToPath(import.meta.url))
  })
}

function fruitOne(datastream) {
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

function fruitTwo(datastream) {
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

run(() => init({ star: "both" }))
