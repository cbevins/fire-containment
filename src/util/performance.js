import { Ellipse, FirePerimeter } from '../index.js'
import { area, perimeterInfiniteSeries } from '../FireEllipseLibrary.js'

/**
 * NOTES
 * ms ~= 500 * ros * dt / spacing
 * nodes ~= 5200 * dt * ros / spacing
  */
function format (val, dec, len, pad = ' ') {
  return val.toFixed(dec).padStart(len, pad)
}
/**
 *
 * @param {number} duration Fire duration (minutes)
 * @param {number} timeStep Growth iteration time step (minutes)
 * @param {number} maxSpacing Maximum spacing between nodes (feet)
 */
function run (ros, duration, dt, maxSpacing) {
  const t0 = new Date()
  const ellipse = new Ellipse(ros, 0, 2)
  const fp = new FirePerimeter(0, 0, ellipse, 24, maxSpacing)
  while (fp.time <= duration) {
    fp.expand(dt)
  }
  const rate = format(ros, 0, 3)
  const dur = format(duration, 0, 8)
  const timestep = format(dt, 0, 8)
  const len = format(fp.length(), 2, 8)
  const perimTarget = format(perimeterInfiniteSeries(fp.length(), fp.width()), 2, 8)
  const perimSimulated = format(fp.perimeter(), 2, 8)
  const areaTarget = format((area(fp.length(), fp.ellipse.lwRatio) / (66 * 660)), 2, 6)
  const areaSimulated = format((fp.area() / (66 * 660)), 2, 6)
  const ms = format((new Date() - t0), 0, 8)
  const nodes = format(fp.nodes, 0, 8)
  const spacing = format(maxSpacing, 0, 8)
  console.log(`${rate} ${dur} ${timestep} ${spacing} : ${nodes} ${ms} ${len} ` +
    `${perimTarget} ${perimSimulated} ${areaTarget} ${areaSimulated}`)
}

const header = 'ros duration timestep  spacing :    nodes millisec   length   perimT  perimS  areaT areaS'
console.log(header)
const day = 60 * 24
run(1, day, 1, 1)
run(10, day, 1, 10)
run(10, day, 2, 5)
run(10, day, 5, 2)
run(100, day, 1, 100)
run(100, day, 10, 10)
run(100, day, 5, 20)
run(100, day, 20, 5)

// const rates = [1, 10, 100]
// const durations = [24 * 60]
// const timeSteps = [1]
// const spacings = [10, 8, 6, 4, 2, 1]
// rates.forEach(ros => {
//   durations.forEach(dur => {
//     timeSteps.forEach(dt => {
//       console.log(header)
//       spacings.forEach(ft => {
//         run(ros, dur, dt, ft)
//       })
//     })
//   })
// })
