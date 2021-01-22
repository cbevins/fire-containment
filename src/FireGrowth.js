import { FirePointPool } from './FirePointPool.js'

// Magic function that returns fire {ros:, heading:, ratio:} at point (x,y) time t
export function fireBehaviorAt (x, y, t) {
  return { ros: 1, heading: 0, ratio: 2 }
}

export class FirePerimeter {
  constructor (ignitionX, ignitionY, ellipse, nodes = 24, maxSpacing = 1) {
    this.start = { x: ignitionX, y: ignitionY }
    this.ellipse = ellipse
    this.nodes = nodes
    this.spacing = { max: maxSpacing, max2: maxSpacing * maxSpacing }
    this.time = 0
    // Circular doublely linked list of DllNodes containing FirePoint instances
    this.first = FirePointPool.getFirst(this.start.x, this.start.y, 0)
    let node = this.first
    const step = 360 / nodes
    for (let degrees = step; degrees < 360; degrees += step) {
      node = FirePointPool.insertAfter(node, this.start.x, this.start.y, degrees)
    }
  }

  area () {
    let a, b, c, s
    let ar = 0
    let node = this.first
    do {
      a = this.distanceToNext(node)
      b = this.distanceFromStart(node)
      c = this.distanceFromStart(node.next)
      s = (a + b + c) / 2
      ar += Math.sqrt(s * (s - a) * (s - b) * (s - c))
      node = node.next
    } while (node.next !== this.first.next)
    return ar
  }

  distanceFromStart (node) {
    const dx = node.data.x - this.start.x
    const dy = node.data.y - this.start.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  distanceToNext (node) {
    const dx = node.data.x - node.next.data.x
    const dy = node.data.y - node.next.data.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  expand (time, maxSpacing = null) {
    if (this.time + time < 0) {
      time = this.time
    }
    this.time += time
    let node = this.first
    do {
      const pos = this.ellipse.vectorMapPosition(node.data.x, node.data.y, node.data.d, time)
      node.data.x = pos.x
      node.data.y = pos.y
      node = node.next
    } while (node.next !== this.first.next)
    this.populate(maxSpacing)
  }

  // Only works when headingFromNorth is 0!!!
  length () {
    return this.first.data.y + Math.abs(this.nodeAtAngle(180).data.y)
  }

  nodeAtAngle (degrees) {
    let node = this.first
    do {
      if (Math.abs(node.data.d - degrees) < 1.0e-14) return node
      node = node.next
    } while (node.next !== this.first.next)
  }

  perimeter () {
    let dist = 0
    let node = this.first
    do {
      dist += this.distanceToNext(node)
      node = node.next
    } while (node.next !== this.first.next)
    return dist
  }

  populate (maxSpacing = null) {
    const limit = maxSpacing === null ? this.spacing.max2 : maxSpacing * maxSpacing
    let node = this.first
    let atFirst = true
    do {
      const dx = node.data.x - node.next.data.x
      const dy = node.data.y - node.next.data.y
      const d2 = dx * dx + dy * dy
      if (d2 < limit) {
        node = node.next
        atFirst = false
      } else {
        const nextDegrees = node.next.data.d ? node.next.data.d : 360
        FirePointPool.insertAfter(node,
          (node.data.x + node.next.data.x) / 2,
          (node.data.y + node.next.data.y) / 2,
          (node.data.d + nextDegrees) / 2)
        this.nodes++
        // check this node's distance-to-neighbor again
      }
    } while (node.next !== this.first.next || atFirst)
  }

  repeat (time, steps, maxSpacing = null) {
    for (let i = 0; i < steps; i += 1) {
      this.expand(time, maxSpacing)
    }
  }

  width () {
    return this.length() / this.ellipse.lwRatio
  }
}
