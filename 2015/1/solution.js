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

async function solve() {
  const metadata = await getFileMetadata({ year: '2015', exerciseId: '1' })
  const floor = findSantasFloor(metadata)
  
  logger.log('YEAR 2015')
  logger.log('DAY 1 - NOT QUITE LISP')
  logger.log(`🍄 Santa needs to deliver presents to the ${floor}th floor`)
}

exports.findSantasFloor = findSantasFloor