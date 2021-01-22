import * as FireEllipse from '../FireEllipseLibrary.js'
import * as Compass from '../CompassLibrary.js'

export class Ellipse {
  constructor (length, width, rosHead, headingFromNorth) {
    this.length = length
    this.width = width
    this.rosHead = rosHead
    this.headingFromNorth = headingFromNorth
    this.lwRatio = length / width
    this.eccent = FireEllipse.eccentricity(this.lwRatio)
    this.rosBack = FireEllipse.backingSpreadRate(this.rosHead, this.eccent)
    this.rosMajor = FireEllipse.majorSpreadRate(this.rosHead, this.rosBack)
    this.rosMinor = FireEllipse.minorSpreadRate(this.rosMajor, this.lwRatio)
    this.rosF = FireEllipse.fSpreadRate(this.rosMajor)
    this.rosG = FireEllipse.gSpreadRate(this.rosMajor, this.rosBack)
    this.rosH = FireEllipse.hSpreadRate(this.rosMinor)
  }

  position (x0, y0, degreesFromHead, time) {
    const pos = { x0: x0, y0: y0, degrees: degreesFromHead, time: time }
    pos.ros = this.rosAtBeta(degreesFromHead)
    pos.dist = time * pos.ros
    pos.radians = Compass.radians(degreesFromHead)
    pos.dx = pos.dist * Math.sin(pos.radians)
    pos.dy = pos.dist * Math.cos(pos.radians)
    pos.x1 = pos.x0 + pos.dx
    pos.y1 = pos.y0 + pos.dy
    return pos
  }

  positionFromNorth (x0, y0, degreesFromNorth, time) {
    const pos = { x0: x0, y0: y0, degrees: degreesFromNorth, time: time }
    pos.ros = this.rosAtBeta(degreesFromNorth)
    pos.dist = time * pos.ros
    pos.radians = Compass.radians(degreesFromNorth)
    pos.dx = pos.dist * Math.cos(pos.radians)
    pos.dy = pos.dist * Math.sin(pos.radians)
    pos.x1 = pos.x0 + pos.dx
    pos.y1 = pos.y0 + pos.dy
    return pos
  }

  rosAtBeta (degrees) {
    return FireEllipse.betaSpreadRate(degrees, this.rosHead, this.eccent)
  }

  rosAtPsi (degrees) {
    return FireEllipse.psiSpreadRate(degrees, this.rosF, this.rosG, this.rosH)
  }
}

export class FireTag {
  constructor (x0, y0, degreesFromNorth) {
    this.degrees = degreesFromNorth
    this.radians = Compass.radians(degreesFromNorth)
    this.x0 = x0
    this.y0 = y0
    this.x1 = x0
    this.y1 = y0
    this.x2 = x0
    this.y2 = x0
  }
}

export function distance (ellipse, fireTag, time) {
  // Get the cumulative spread distance from all cells
  // the vector traverses during the time step
  // Right now, assume uniform conditions fuels, moisture, wind, slope
  return time * ellipse.rosAtBeta(fireTag.degrees)
}

function vector (length, width, rosHead, headingFromNorth) {
  const ellipse = new Ellipse(length, width, rosHead, headingFromNorth)
  console.log('Position at time 100:')
  for (let degrees = 0; degrees <= 360; degrees += 5) {
    const pos = ellipse.position(0, 0, degrees, 100)
    console.log(
      pos.degrees,
      // pos.radians.toFixed(4),
      'ros=', pos.ros.toFixed(4),
      'dist=', pos.dist.toFixed(4),
      'x1=', pos.x1.toFixed(4),
      'y1=', pos.y1.toFixed(4))
  }
}

vector(2, 1, 1, 0)
