import getFileContent from "../helpers/file.js";
import { DROPLET_SIDES } from "./constants.js"

function setDropletsMap(droplets) {
  return droplets.reduce((accum, droplet) => {
    return {
      ...accum,
      [droplet]: 0,
    }
  }, {});
};

function listLikelihoodNearByDroplets(droplets) {
  return droplets.reduce((accum, droplet) => {
    const nearByDroplets = getNearByDroplets(droplet);

    return [
      ...accum,
      ...nearByDroplets
    ]
  }, []);
};

// TODO: simplify
function getNearByDroplets(droplet) {
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

function getAirCubes(adjacentCubes) {
  return adjacentCubes.reduce((accum, cube) => {
    accum[cube] = (accum[cube] || 0) + 1;

    return {
      ...accum,
      airCubes: accum[cube] === 6 ? [...accum.airCubes, cube] : [...accum.airCubes]
    }
  }, { airCubes: [] });
};

(async function init() {
  const contents = await getFileContent({
    path: new URL("./puzzle-input.txt", import.meta.url),
  }).catch((error) => console.log(error));

  const droplets = contents.split("\n");

  (function firstStar() {
    const dropletsMap = setDropletsMap(droplets);
    const likelihoodNearByDroplets = listLikelihoodNearByDroplets(droplets);
  
    let dropletsConnectedSides = 0;
    for (let i = 0; i < likelihoodNearByDroplets.length; i++) {
      const droplet = likelihoodNearByDroplets[i];
      if (!dropletsMap.hasOwnProperty(droplet)) continue;

      dropletsMap[droplet] += 1;
      dropletsConnectedSides += 1;
    }

    const dropletsSides = droplets.length * DROPLET_SIDES;
    const surfaceArea = dropletsSides - dropletsConnectedSides;

    console.log(`The surface area of the scanned lava droplets is ${surfaceArea}`);
  })();


  function secondStar() {
    const { airCubes } = getAirCubes(possibleAdjacentDroplets);
  
    // the intersection of adjacent cubes could be a droplet
    const realAirCubes = airCubes.filter((el) => !droplets.includes(el));
  
    const exteriorSurface = totalCubeFaces - adjacentFacesCounter - (realAirCubes.length * 6);
    console.log("EXTERIOR SURFACE", exteriorSurface);
  }
})();