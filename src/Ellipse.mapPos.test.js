import { Ellipse } from './index.js'

// List spread rate at vectors of 2:1 ellipse
function listVectors () {
  const ellipse = new Ellipse(1, 0, 2)
  let str = 'Spread rate ratio at various angles for 2:1 ellipse\n'
  for (let degrees = 0; degrees <= 180; degrees += 5) {
    const rosRight = ellipse.rosAtBeta(degrees)
    const rosLeft = ellipse.rosAtBeta(360 - degrees)
    str += `${degrees} = ${rosRight.toFixed(6)} ${360 - degrees} = ${rosLeft.toFixed(6)}\n`
  }
  return str
}
listVectors()

// Create an Ellipse with ros=1, heading 0 degrees from North, and 2:1 ratio
const ellipse102 = new Ellipse(1, 0, 2)
const rosFromHead = []
for (let degrees = 0; degrees < 360; degrees += 1) {
  rosFromHead.push(ellipse102.rosAtBeta(degrees))
}

test('new Ellipse()', () => {
  expect(ellipse102.rosHead).toEqual(1)
  expect(ellipse102.headingFromNorth).toEqual(0)
  expect(ellipse102.lwRatio).toEqual(2)
})

test('vectorMapPosition() fire heading 0 degrees (north)', () => {
  const t1 = 100
  let dfn = 0 // degrees from north
  let dfh = 0 // degrees from head
  expect(ellipse102.vectorDegreesFromHead(dfn)).toEqual(dfh)
  let pos = ellipse102.vectorMapPosition(0, 0, dfn, t1) // pos at North
  expect(pos.x).toEqual(0)
  expect(pos.y).toEqual(100)

  dfn = 90
  dfh = 90
  expect(ellipse102.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse102.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(13.397459621556141, 14)
  expect(pos.y).toBeCloseTo(0, 14)

  dfn = 180
  dfh = 180
  expect(ellipse102.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse102.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(0, 14)
  expect(pos.y).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.y).toBeCloseTo(-7.179676972449085, 14)

  dfn = 270
  dfh = 270
  expect(ellipse102.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse102.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(-13.397459621556141, 14)
  expect(pos.y).toBeCloseTo(0, 14)
})

test('vectorMapPosition() fire heading 180 degrees (south)', () => {
  const t1 = 100
  const ellipse = new Ellipse(1, 180, 2)

  let dfn = 0 // degrees from north
  let dfh = 180 // degrees from head
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  let pos = ellipse.vectorMapPosition(0, 0, dfn, t1) // pos at North
  expect(pos.x).toEqual(0)
  expect(pos.y).toEqual(t1 * rosFromHead[dfh])
  expect(pos.y).toBeCloseTo(7.179676972449085, 14)

  dfn = 90
  dfh = 270
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(13.397459621556141, 14)
  expect(pos.y).toBeCloseTo(0, 14)

  dfn = 180
  dfh = 0
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(0, 13)
  expect(pos.y).toBeCloseTo(-t1 * rosFromHead[dfh], 14)

  dfn = 270
  dfh = 90
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(-13.397459621556141, 14)
  expect(pos.y).toBeCloseTo(0, 14)
})

test('vectorMapPosition() fire heading 90 degrees (east)', () => {
  const t1 = 100
  const ellipse = new Ellipse(1, 90, 2)
  let dfn, dfh, pos

  dfn = 0 // degrees from north
  dfh = 270 // degrees from head
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1) // pos at North
  expect(pos.x).toBeCloseTo(0, 14)
  expect(pos.y).toBeCloseTo(13.397459621556141, 14)

  dfn = 90
  dfh = 0
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(100, 14)
  expect(pos.y).toBeCloseTo(0, 13)

  dfn = 180
  dfh = 90
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(0, 13)
  expect(pos.y).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.y).toBeCloseTo(-13.397459621556141, 14)

  dfn = 270
  dfh = 180
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(-7.179676972449085, 14)
  expect(pos.y).toBeCloseTo(0, 14)
})

test('vectorMapPosition() fire heading 270 degrees (west)', () => {
  const t1 = 100
  const ellipse = new Ellipse(1, 270, 2)
  let dfn, dfh, pos

  dfn = 0 // degrees from north
  dfh = 90 // degrees from head
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1) // pos at North
  expect(pos.x).toBeCloseTo(0, 14)
  expect(pos.y).toBeCloseTo(13.397459621556141, 14)

  dfn = 90
  dfh = 180 // back
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(7.179676972449085, 14)
  expect(pos.y).toBeCloseTo(0, 13)

  dfn = 180
  dfh = 270
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(0, 13)
  expect(pos.y).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.y).toBeCloseTo(-13.397459621556141, 14)

  dfn = 270
  dfh = 0
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.x).toBeCloseTo(-100, 14)
  expect(pos.y).toBeCloseTo(0, 13)
})

test('vectorMapPosition() fire heading 45 degrees (east)', () => {
  const t1 = 100
  const ellipse = new Ellipse(1, 45, 2)
  let dfn, dfh, pos

  dfn = 0 // degrees from north
  dfh = 315 // degrees from head
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1) // pos at North
  expect(pos.x).toBeCloseTo(0, 14)
  expect(pos.y).toBeCloseTo(t1 * rosFromHead[dfh], 14)

  dfn = 90
  dfh = 45
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(t1 * rosFromHead[dfh], 14)
  expect(pos.y).toBeCloseTo(0, 13)

  dfn = 180
  dfh = 135
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(0, 13)
  expect(pos.y).toBeCloseTo(-t1 * rosFromHead[dfh], 14)

  dfn = 270
  dfh = 225
  expect(ellipse.vectorDegreesFromHead(dfn)).toEqual(dfh)
  pos = ellipse.vectorMapPosition(0, 0, dfn, t1)
  expect(pos.x).toBeCloseTo(-t1 * rosFromHead[dfh], 14)
  expect(pos.y).toBeCloseTo(0, 14)
})
