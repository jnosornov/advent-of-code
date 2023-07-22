import { getFileContent } from "../../helpers/file.js"
import { run } from "../../helpers/general.js"
import { DROPLET_SIDES } from "./constants.js"

function setMap(droplets) {
  return droplets.reduce((accum, droplet) => {
    return {
      ...accum,
      [droplet]: 0
    }
  }, { area: droplets.length * DROPLET_SIDES })
};

function getLikelihoodDroplets(droplets) {
  return droplets.reduce((accum, droplet) => {
    return [
      ...accum,
      ...nearByDroplets(droplet)
    ]
  }, [])
};

// TODO: simplify
function nearByDroplets(droplet) {
  const dropletCoordinates = droplet.split(",")

  return dropletCoordinates.reduce((accum, coordinate, index, array) => {
    const temp = []
    const _coordinate = parseInt(coordinate)

    if (index === 0) {
      temp.push(`${_coordinate + 1},${array[index + 1]},${array[index + 2]}`)
      temp.push(`${_coordinate - 1},${array[index + 1]},${array[index + 2]}`)
    }

    if (index === 1) {
      temp.push(`${array[index - 1]},${_coordinate + 1},${array[index + 1]}`)
      temp.push(`${array[index - 1]},${_coordinate - 1},${array[index + 1]}`)
    }

    if (index === 2) {
      temp.push(`${array[index - 2]},${array[index - 1]},${_coordinate + 1}`)
      temp.push(`${array[index - 2]},${array[index - 1]},${_coordinate - 1}`)
    }

    return [
      ...accum,
      ...temp
    ]
  }, [])
};

function getDropletsSurfaceArea(droplets) {
  const map = setMap(droplets)
  const mightBeDroplet = getLikelihoodDroplets(droplets)

  for (let i = 0; i < mightBeDroplet.length; i++) {
    const droplet = mightBeDroplet[i]
    // TODO: have a look at this eslint rule
    // eslint-disable-next-line no-prototype-builtins
    if (!map.hasOwnProperty(droplet)) continue

    map[droplet] += 1
    map.area -= 1
  }

  return map.area
}

async function init() {
  const filename = process.env.NODE_ENV === "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: droplets } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => entry.split("\n")
  })

  const surfaceArea = getDropletsSurfaceArea(droplets)

  console.log(`⭐ scanned lava droplets surface area: ${surfaceArea}`)
  return { surfaceArea }
};

run(init)

export {
  init
}
