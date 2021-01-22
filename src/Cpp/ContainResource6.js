/**
 *  A single fire containment resource unit that can be dispatched to a fire.
 *  Examples include an engine crew, line crew, bulldozer, helicopter, airtanker, etc.
 */

// Identifies the fire flank to which ContainResource objects are assigned.
export const ContainFlank6 = {
  neither: 0, // Attack neither flank (inactive)
  left: 1, // Attack left (upper) flank only (full production)
  right: 2, // Attack right (lower) flank only (full production)
  both: 3 // Attack both flanks (half of production per flank)
}

export class ContainResource6 {
  /**
  *
  * @param {*} arrival Fireline production begins at this elapsed time since the fire was *reported* (min).
  * @param {*} production Sustained rate of holdable fireline production (ch/h).
  *   THIS IS THE TOTAL RATE FOR BOTH FLANKS. THE PRODUCTION RATE WILL BE SPLIT IN HALF AND APPLIED
  *   TO ONE FLANK FOR SIMULATION.
  * @param {*} duration Amount of time during which the fireline production rate is maintained (min).
  * @param {*} flank One of the ContainFlank6 values
  * @param {*} desc Resource description or identification (informational only)
  * @param {*} baseCost Base cost of deploying the resource to the fire.
  * @param {*} hourCost Hourly cost of the resource while at the fire.
  */
  constructor (arrival, production, duration, flank, desc = '', baseCost = 0, hourCost = 0) {
    this.arrival = arrival
    this.duration = duration
    this.production = production
    this.baseCost = baseCost
    this.hourCost = hourCost
    this.flank = flank
    this.desc = desc
  }
}
