import * as FireEllipse from './FireEllipseLibrary.js'
import * as Compass from './CompassLibrary.js'

export class Ellipse {
  constructor (rosHead, headingFromNorth, lwRatio) {
    this.rosHead = rosHead
    this.headingFromNorth = headingFromNorth
    this.lwRatio = lwRatio
    this.eccent = FireEllipse.eccentricity(this.lwRatio)
    this.rosBack = FireEllipse.backingSpreadRate(this.rosHead, this.eccent)
    this.rosMajor = FireEllipse.majorSpreadRate(this.rosHead, this.rosBack)
    this.rosMinor = FireEllipse.minorSpreadRate(this.rosMajor, this.lwRatio)
    this.rosF = FireEllipse.fSpreadRate(this.rosMajor)
    this.rosG = FireEllipse.gSpreadRate(this.rosMajor, this.rosBack)
    this.rosH = FireEllipse.hSpreadRate(this.rosMinor)
  }

  rosAtBeta (degrees) {
    return FireEllipse.betaSpreadRate(degrees, this.rosHead, this.eccent)
  }

  rosAtPsi (degrees) {
    return FireEllipse.psiSpreadRate(degrees, this.rosF, this.rosG, this.rosH)
  }

  vectorDegreesFromHead (degreesFromNorth) {
    return Compass.diff(degreesFromNorth, this.headingFromNorth)
  }

  // Returns fire position starting at (x0,y0) traveling at degreesFromHead for time
  vectorMapPosition (x0, y0, degreesFromNorth, time) {
    const degreesFromHead = this.vectorDegreesFromHead(degreesFromNorth)
    const dist = this.vectorSpreadDistance(degreesFromHead, time)
    const radians = Compass.radians(degreesFromNorth)
    const dx = dist * Math.sin(radians)
    const dy = dist * Math.cos(radians)
    const x1 = x0 + dx
    const y1 = y0 + dy
    return { x: x1, y: y1 }
  }

  vectorSpreadDistance (degreesFromHead, time) {
    return time * this.rosAtBeta(degreesFromHead)
  }

  vectorSpreadRate (degreesFromHead) {
    return this.rosAtBeta(degreesFromHead)
  }
}
