const { getFileMetadata } = require('../../utils/file.js')
const logger = require('../../utils/logger.js')

// time complexity: O(n)
// space complexity: O(1)
function findSantasFloor(santaInstructions) {
  if (!santaInstructions) {
    logger.log('missing Santa instructions')
    return
  }

  let floor = 0
  const OPENING_PARENTHESIS = '('
  const CLOSING_PARENTHESIS = ')'

  for (const instruction in santaInstructions) {
    const goesUpOneFloor = santaInstructions[instruction] == OPENING_PARENTHESIS
    const goesDownOneFloor = santaInstructions[instruction] == CLOSING_PARENTHESIS

    if (!goesUpOneFloor && !goesDownOneFloor) {
      logger.log('Santa instructions are corrupted')
      return
    }

    if (goesUpOneFloor) {
      floor++
    }

    if (goesDownOneFloor) {
      floor--
    }
  }

  return floor
}

// time complexity: O(n)
// space complexity: O(1)
function findSantasBasementInstruction(santaInstructions) {
  if (!santaInstructions) {
    logger.log('missing Santa instructions')
    return
  }

  let floor = 0
  let basementFloorInstructionPosition
  const OPENING_PARENTHESIS = '('
  const CLOSING_PARENTHESIS = ')'
  const BASEMENT_FLOOR = -1

  for (const instruction in santaInstructions) {
    const goesUpOneFloor = santaInstructions[instruction] == OPENING_PARENTHESIS
    const goesDownOneFloor = santaInstructions[instruction] == CLOSING_PARENTHESIS

    if (!goesUpOneFloor && !goesDownOneFloor) {
      logger.log('Santa instructions are corrupted')
      return
    }

    if (goesUpOneFloor) {
      floor++
    }

    if (goesDownOneFloor) {
      floor--
    }

    if (floor == BASEMENT_FLOOR) {
      basementFloorInstructionPosition = parseInt(instruction) + 1
      break
    }
  }

  if (!basementFloorInstructionPosition) {
    logger.log('Santa does not enter basement ever')
  }

  return basementFloorInstructionPosition
}

async function solve() {
  logger.log('YEAR 2015')
  logger.log('DAY 1 - NOT QUITE LISP')
  logger.log('\n')

  const metadata = await getFileMetadata({ year: '2015', exerciseId: '1' })
  partOne()
  partTwo()

  function partOne() {
    const floor = findSantasFloor(metadata)
    logger.log(`🍄 Santa needs to deliver presents to the ${floor}th floor`)
  }

  function partTwo() {
    const basementInstruction = findSantasBasementInstruction(metadata)
    logger.log(`🍄 Santa enters the basemenet for the first time at instruction ${basementInstruction}`)
  }
}

solve()

exports.findSantasFloor = findSantasFloor
exports.findSantasBasementInstruction = findSantasBasementInstruction