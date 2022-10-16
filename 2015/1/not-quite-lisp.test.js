const assert = require('assert')
const { findSantasFloor } = require('./solution.js')

describe('NOT QUITE LISP', () => {
  it('Santa should deliver presents to the third floor (3rd floor)', () => {
    const santaInstructions = '((('

    const expectedFloor = 3
    const algorithmOutput = findSantasFloor(santaInstructions)
    assert.equal(algorithmOutput, expectedFloor)
  })

  it('Santa should deliver presents to the fourth basement floor (4th basement floor) ', () => {
    const santaInstructions = '))))'

    const expectedFloor = -4
    const algorithmOutput = findSantasFloor(santaInstructions)
    assert.equal(algorithmOutput, expectedFloor)
  })

  it('Santa should deliver presents to the lobby (entrance floor)', () => {
    const santaInstructions = '((()))'

    const expectedFloor = 0
    const algorithmOutput = findSantasFloor(santaInstructions)
    assert.equal(algorithmOutput, expectedFloor)
  })

  it('Santa instructions are missing', () => {
    const expectedFloor = undefined

    const algorithmOutput = findSantasFloor()
    assert.equal(algorithmOutput, expectedFloor)
  })

  it('Santa instructions are corrupted', () => {
    const santaInstructions = '(()))/'

    const expectedFloor = undefined
    const algorithmOutput = findSantasFloor(santaInstructions)
    assert.equal(algorithmOutput, expectedFloor)
  })
})