import { fireBehaviorAt, Ellipse, FirePerimeter } from './index.js'
import { perimeter, perimeterInfiniteSeries, perimeterRamanujan } from './FireEllipseLibrary.js'

test('new FirePerimeter()', () => {
  const ellipse = new Ellipse(1, 0, 2)
  expect(ellipse.rosHead).toEqual(1)
  expect(ellipse.headingFromNorth).toEqual(0)
  expect(ellipse.lwRatio).toEqual(2)

  const fp = new FirePerimeter(0, 0, ellipse, 24, 1)
  expect(fp.nodes).toEqual(24)
  let node = fp.first
  let n = 0
  do {
    expect(node.data.x).toEqual(0)
    expect(node.data.y).toEqual(0)
    expect(node.data.d).toEqual(n * 360 / fp.nodes)
    expect(fp.distanceToNext(node)).toEqual(0)
    // console.log(n, node.data.d)
    node = node.next
    n++
  } while (node.next !== fp.first.next)
  expect(n).toEqual(24)
  expect(fp.perimeter()).toEqual(0)
})

test('FirePerimeter.expand()', () => {
  // Try magic function for fire fireBehavior
  const fire = fireBehaviorAt(0, 0, 0)
  const ellipse = new Ellipse(fire.ros, fire.heading, fire.ratio)
  const fp = new FirePerimeter(0, 0, ellipse)
  for (let t = 1; t <= 100; t += 1) {
    fp.expand(1)
  }
  let node = fp.first
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(100, 14)

  node = fp.nodeAtAngle(90)
  expect(node.data.d).toEqual(90)
  expect(node.data.x).toBeCloseTo(13.397459621556141, 12)
  expect(node.data.y).toBeCloseTo(0, 14)

  node = fp.nodeAtAngle(180)
  expect(node.data.d).toEqual(180)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(-7.179676972449085, 12)

  node = fp.nodeAtAngle(270)
  expect(node.data.d).toEqual(270)
  expect(node.data.x).toBeCloseTo(-13.397459621556141, 12)
  expect(node.data.y).toBeCloseTo(0, 14)

  expect(fp.nodes).toEqual(388)
})

test('FirePerimeter.perimeter() for various node spacing', () => {
  const ellipse = new Ellipse(1, 0, 2)
  const fp = new FirePerimeter(0, 0, ellipse, 24, 10)
  fp.repeat(1, 100)

  const length = 107.179676972449085
  expect(perimeterInfiniteSeries(length, length / 2)).toEqual(259.60112551653674)
  expect(perimeterRamanujan(length, length / 2)).toEqual(259.60046090536736)
  expect(perimeter(length, length / 2)).toEqual(259.59977233492907)
  // RESULTS:
  // Spacing  Nodes perimeter()
  // 0.1       3916 259.5072508149943
  // 0.2       1954 259.47733985839835
  //   1        388 259.11984861882485
  //   2        192 258.7705648435907
  //   5         74 257.8892901431328
  //  10         44 256.86819477493714
})

test('FirePerimeter.expand() backwards!!', () => {
  const ellipse = new Ellipse(1, 0, 2)
  const fp = new FirePerimeter(0, 0, ellipse, 24, 1)
  const node = fp.first

  // Go ahead 50 time steps
  fp.repeat(1, 50)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(50, 14)
  expect(fp.distanceFromStart(node)).toBeCloseTo(50, 14)
  expect(fp.length()).toBeCloseTo(107.179676972449085 / 2, 12)
  expect(fp.width()).toBeCloseTo(107.179676972449085 / 4, 12)
  expect(fp.perimeter()).toBeCloseTo(129.35191943557712, 14)
  expect(fp.area()).toBeCloseTo(1119.6044011588003, 14)

  // Go ahead ANOTHER 50 time steps
  fp.repeat(1, 50)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(100, 14)
  expect(fp.distanceFromStart(node)).toBeCloseTo(100, 14)
  expect(fp.length()).toBeCloseTo(107.179676972449085, 12)
  expect(fp.width()).toBeCloseTo(107.179676972449085 / 2, 12)
  expect(fp.perimeter()).toBeCloseTo(259.11984861882485, 14)
  expect(fp.area()).toBeCloseTo(4494.461188352882, 14)

  // Go BACKWARDS 50 time steps
  fp.repeat(-1, 50)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(50, 14)
  expect(fp.length()).toBeCloseTo(107.179676972449085 / 2, 12)
  expect(fp.width()).toBeCloseTo(107.179676972449085 / 4, 12)
  // We gain about 0.001338 feet of perimeter because we have so many more FirePoints
  expect(fp.perimeter()).toBeCloseTo(129.3532577108494, 14)
  // And area is about 0.06846 ft2 smaller
  expect(fp.area()).toBeCloseTo(1119.5359365232462, 14)

  // Go BACKWARDS ANOTHER 50 time steps
  fp.repeat(-1, 50)
  expect(fp.time).toEqual(0)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(0, 14)
  expect(fp.length()).toBeCloseTo(0, 12)
  expect(fp.width()).toBeCloseTo(0, 12)
  // expect(fp.perimeter()).toBeCloseTo(4.215470921467128, 14)
  expect(fp.area()).toBeCloseTo(0.02487616285846806, 14)

  // Go BACKWARDS ANOTHER 50 time steps
  fp.repeat(-1, 50)
  expect(fp.time).toEqual(0)
  expect(node.data.x).toBeCloseTo(0, 14)
  expect(node.data.y).toBeCloseTo(0, 14)
  expect(fp.length()).toBeCloseTo(0, 12)
  expect(fp.width()).toBeCloseTo(0, 12)
  // expect(fp.perimeter()).toBeCloseTo(4.215470921467128, 14)
  expect(fp.area()).toBeCloseTo(0.02487616285846806, 14)
})

test('FirePerimeter.reset()', () => {
  const ellipse = new Ellipse(1, 0, 2)
  const fp = new FirePerimeter(0, 0, ellipse, 24, 1)
  const node = fp.first

  expect(node.nodes()).toEqual(24)
  expect(fp.nodes).toEqual(24)
  expect(fp.perimeter()).toEqual(0)
  expect(fp.area()).toEqual(0)

  fp.repeat(1, 100)
  expect(node.nodes()).toEqual(388)
  expect(fp.nodes).toEqual(388)
  expect(fp.perimeter()).toBeCloseTo(259.11984861882485, 14)
  expect(fp.area()).toBeCloseTo(4494.461188352882, 14)

  fp.reset()
  expect(fp.nodes).toEqual(24)
  expect(fp.perimeter()).toEqual(0)
  expect(fp.area()).toEqual(0)
})
