/*! \file ContainForce6.js
    \brief Collection of all ContainResources dispatched to the fire.
 */
import { ContainFlank6 } from './ContainResource6.js'

export class ContainForce6 {
  constructor () {
    this.cr = [] // Array of ContainResource6 instances
  }

  /**
   * Adds a containment resource to the Force
   * @param {ContainResource6} resource ContainResource6 instance
   * @returns {this} Pointer to *this* instance
   */
  addResource (resource) {
    this.cr.push(resource)
    return this
  }

  /**
   * Determines when all the containment resources on the specified flank will be exhausted.
   * @param {number} onFlank One of the ContainFlank6 properties 'left' or 'right'.
   * @returns Time when all scheduled resources will be exhausted (minutes since fire report).
   */
  exhausted (onFlank) {
    let minutesSinceReport = 0
    this.cr.forEach(cr => {
      if (cr.flank === onFlank || cr.flank === ContainFlank6.both) {
        minutesSinceReport = Math.max(minutesSinceReport, cr.arrival + cr.duration)
      }
    })
    return minutesSinceReport
  }

  /**
   * Determines first resource arrival time for the specified flank.
   * @param {number} onFlank One of the ContainFlank6 properties 'left' or 'right'.
   * @returns {number} Time of first resource arrival on the specified flank (minutes since fire report).
   */
  firstArrival (onFlank) {
    let minutesSinceReport = 99999999
    this.cr.forEach(cr => {
      if (cr.flank === onFlank || cr.flank === ContainFlank6.both) {
        minutesSinceReport = Math.min(minutesSinceReport, cr.arrival)
      }
    })
    return minutesSinceReport
  }

  /**
 * Determines time of next productivity increase (usually the next resource arrival time)
 * for the specified flank.  The search is restricted to the *after* and *until* time range.
 * @param {number} after Find next resource arrival AFTER this time (minutes since fire report).
 * @param {number} until Find next resource arrival BEFORE this time (minutes since fire report).
 * @param {number} onFlank One of the ContainFlank6 properties 'left' or 'right'.
 * @returns {number} Time of next resource arrival on the specified flank (minutes since fire report).
 */
  nextArrival (after, until, onFlank) {
    // Get the production rate at the requested time
    const currentRate = this.productionRate(after, onFlank)
    // Look for next production boost starting at the next minute
    let next = Math.floor(after + 1)
    while (next < until) {
      // Check production rate at the next minute
      if (this.productionRate(next, onFlank) !== currentRate) {
        return next
      }
      next += 1
    }
    // No more productivity boosts after this time
    return 0
  }

  /**
 * Determines the aggregate fireline production rate along one fire flank
 * at the specified time by the entire available containment force.
 * THIS IS HALF THE TOTAL PRODUCTION RATE FOR BOTH FLANKS, CALCULATED FROM
 * HALF THE TOTAL PRODUCTION RATE FOR EACH AVAILABLE RESOURCE.
 *
 * @param {number} minSinceReport The fireline aggregate containment force production rate
 * is determined for this many minutes since the fire was reported.
 * @param {number} onFlank One of the ContainFlank6 properties 'left' or 'right'.
 * @return {number} Aggregate containment force fireline production rate (ch/h).
 */
  productionRate (minSinceReport, onFlank) {
    let pr = 0
    this.cr.forEach(cr => {
      if (cr.flank === onFlank || cr.flank === ContainFlank6.both) {
        if (cr.arrival <= minSinceReport && (cr.arrival + cr.duration) >= minSinceReport) {
          pr += (0.50 * cr.production)
        }
      }
    })
    return pr
  }

  /**
   * Returns cost of the containment resource
   * @param {number} idx Index of the containment resource
   * @param {number} finalTime Final fire activity time (minutes since report)
   * @returns {number} Resource's base cost (if deployed) plus hourly cost
   */
  resourceCost (idx, finalTime) {
    const cr = this.cr[idx]
    const minutes = Math.min(Math.max(0, finalTime - cr.arrival), cr.duration)
    return cr.baseCost + (cr.hourCost * minutes / 60)
  }
}
