import getFileContent from "../helpers/file.js";
import { DROPLET_SIDES } from "./constants.js"

function setMap(droplets) {
  return droplets.reduce((accum, droplet) => {
    return {
      ...accum,
      [droplet]: 0,
    }
  }, { area: droplets.length * DROPLET_SIDES });
};

function getLikelihoodDroplets(droplets) {
  return droplets.reduce((accum, droplet) => {
    return [
      ...accum,
      ...nearByDroplets(droplet)
    ]
  }, []);
};

// TODO: simplify
function nearByDroplets(droplet) {
  const dropletCoordinates = droplet.split(",");

  return dropletCoordinates.reduce((accum, coordinate, index, array) => {
    let temp = [];
    const _coordinate = parseInt(coordinate);

    if (index === 0) {
      temp.push(`${_coordinate + 1},${array[index + 1]},${array[index + 2]}`);
      temp.push(`${_coordinate - 1},${array[index + 1]},${array[index + 2]}`);
    }

    if (index === 1) {
      temp.push(`${array[index - 1]},${_coordinate + 1},${array[index + 1]}`);
      temp.push(`${array[index - 1]},${_coordinate - 1},${array[index + 1]}`);
    }

    if (index === 2) {
      temp.push(`${array[index - 2]},${array[index - 1]},${_coordinate + 1}`);
      temp.push(`${array[index - 2]},${array[index - 1]},${_coordinate - 1}`);
    }

    return [
      ...accum,
      ...temp
    ]
  }, []);
};

function getDropletsSurfaceArea(droplets) {
  const map = setMap(droplets);
  const mightBeDroplet = getLikelihoodDroplets(droplets);

  for (let i = 0; i < mightBeDroplet.length; i++) {
    const droplet = mightBeDroplet[i];
    if (!map.hasOwnProperty(droplet)) continue;

    map[droplet] += 1;
    map.area -= 1;
  }

  return map.area;
}

function getDropletsExteriorSurface(droplets) {
  return 0;
}

(async function init() {
  const opts = (entry) => entry.split("\n");

  const contents = await getFileContent({
    path: new URL("./puzzle-input.txt", import.meta.url),
    opts,
  }).catch((error) => console.log(error));

  const { input: droplets } = contents;
  const surfaceArea = getDropletsSurfaceArea(droplets);
  const exteriorSurface = getDropletsExteriorSurface(droplets);

  console.log(`⭐   scanned lava droplets surface area: ${surfaceArea}`);
  console.log(`⭐⭐ scanned lava droplets exterior area: ${exteriorSurface}`);
})();