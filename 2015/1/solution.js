// time complexity: O(n)
// space complexity: O(1)

function findSantasFloor(santaInstructions) {
  let floor = 0

  for (const instruction in santaInstructions) {
    const goesUpOneFloor = santaInstructions[instruction] === '('
    goesUpOneFloor ? floor++ : floor--
  }

  return floor
}

export default findSantasFloor