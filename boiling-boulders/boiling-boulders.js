const fs = require("fs/promises");
const path = require("path");

function dropletsOverlap(droplets) {
  return droplets.reduce((accum, droplet) => {
    return {
      ...accum,
      [droplet]: 0,
    }
  }, {});
};

function getAirCubes(adjacentCubes) {
  return adjacentCubes.reduce((accum, cube) => {
    accum[cube] = (accum[cube] || 0) + 1;

    return {
      ...accum,
      airCubes: accum[cube] === 6 ? [...accum.airCubes, cube] : [...accum.airCubes]
    }
  }, { airCubes: [] });
}

// might generate original droplets coordinates
function dropletCloseByDroplets(droplets) {
  return droplets.reduce((accum, droplet) => {
    const closeByDroplets = nearByDroplets(droplet);

    return [
      ...accum,
      ...closeByDroplets
    ]
  }, []);
}

function nearByDroplets(droplet) {
  const coordinates = droplet.split(",");

  return coordinates.reduce((accum, coordinate, index, array) => {
    let temp = [];
    const c = parseInt(coordinate);

    if (index === 0) {
      temp.push(`${c + 1},${array[index + 1]},${array[index + 2]}`);
      temp.push(`${c - 1},${array[index + 1]},${array[index + 2]}`);
    }

    if (index === 1) {
      temp.push(`${array[index - 1]},${c + 1},${array[index + 1]}`);
      temp.push(`${array[index - 1]},${c - 1},${array[index + 1]}`);
    }

    if (index === 2) {
      temp.push(`${array[index - 2]},${array[index - 1]},${c + 1}`);
      temp.push(`${array[index - 2]},${array[index - 1]},${c - 1}`);
    }

    return [
      ...accum,
      ...temp
    ]
  }, []);
}

(async function init() {
  try {
    const filePath = path.join(__dirname, "/puzzle-input.txt");
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const droplets = data.split("\n");

    const totalCubeFaces = droplets.length * 6;
    const hashMap = dropletsOverlap(droplets);
    const possibleAdjacentDroplets = dropletCloseByDroplets(droplets);

    let adjacentFacesCounter = 0;
    for (let i = 0; i < possibleAdjacentDroplets.length; i++) {
      const dropletExists = hashMap[possibleAdjacentDroplets[i]] !== undefined;
     
      if (dropletExists) {
        hashMap[possibleAdjacentDroplets[i]] += 1;
        adjacentFacesCounter += 1;
      }
    }

    const surfarceArea = totalCubeFaces - adjacentFacesCounter;
    console.log("SCANNED LAVA DROPLET SURFACE AREA:", surfarceArea);

    const { airCubes } = getAirCubes(possibleAdjacentDroplets);

    // the intersection of adjacent cubes could be a droplet
    const realAirCubes = airCubes.filter((el) => !droplets.includes(el));

    const exteriorSurface = totalCubeFaces - adjacentFacesCounter - (realAirCubes.length * 6);
    console.log("EXTERIOR SURFACE", exteriorSurface);
  } catch (error) {
    console.log(error);
  }
})();