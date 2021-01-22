/**
 * DllNode is a single node in a doubly linked list.
 * It has references to its previous and next DllNode instances, and to its data payload
 */
export class DllNode {
  /**
   * @param {DllNode} prev Reference to the previous DllNode in the doublely linked list
   * @param {DllNode} next Reference to the next DllNode in the doublely linked list
   * @param {any} data Data payload object or primitive
   */
  constructor (prev, next, data) {
    this.prev = prev
    this.next = next
    this.data = data
  }

  /**
   * Inserts *another* DllNode into the doublely linked list AFTER *this* DllNode.
   * @param {DllNode} another  Reference to the DllNode to be inserted after *this* DllNode.
   */
  insertAfter (another) {
    another.prev = this
    another.next = this.next
    this.next.prev = another
    this.next = another
  }

  /**
   * Demonstrates iteration over the doublely linked list
   * @returns {number} Number of DllNodes in this node's doublely linked list.
   */
  nodes () {
    let node = this
    let n = 0
    do {
      n++
      node = node.next
    } while (node.next !== this.next)
    return n
  }

  /**
   * Removes *this* DllNode from its doublely linked list.
   */
  remove () {
    this.prev.next = this.next
    this.next.prev = this.prev
    this.prev = null
    this.next = null
  }
}

/**
 * FirePoint is a geographic marker of a fire perimeter location along a compass azimuth.
 * It serves as the data payload to a doublely linked list of fire perimeter locations.
 */
export class FirePoint {
  /**
   * @param {number} x FirePoint's x-position in its FireGrid
   * @param {number} y FirePoint's y-position in its FireGrid
   * @param {number} d FirePoint's direction of travel, degrees clockwise from North
   */
  constructor (x, y, d) {
    this.x = x
    this.y = y
    this.d = d
  }
}

/**
 * FirePointReserve maintains a reserve (pool) of DllNodes containing FirePoint instances
 */
export class FirePointReserve {
  constructor (blockSize = 100) {
    this.reserve = []
    this.blockSize = blockSize
    this._addReserveNodes(this.blockSize)
  }

  // ----------------------------------------------------------------------------
  // Private and protected API
  // ----------------------------------------------------------------------------

  _addReserveNodes (n = this.blockSize) {
    for (let i = 0; i < n; i += 1) {
      this.reserve.push(new DllNode(null, null, new FirePoint(0, 0, 0)))
    }
  }

  /**
   * Returns an initialized FirePoint object from the reserve pool.
   * Note that the returned FirePoint IS NOT YET inserted into a doublely linked list;
   * this is accomplished by calling insertAfter()
   * @param {number} x FirePoint's initial x-position in its FireGrid
   * @param {number} y FirePoint's initial y-position in its FireGrid
   * @param {number} d FirePoint's direction of travel, degrees clockwise from North
   * @returns {DllNode} Reference to a DllNode containing the initialized FirePoint object
   */
  _getNode (x, y, d) {
    if (!this.reserve.length) {
      this._addReserveNodes()
    }
    const another = this.reserve.pop()
    another.data.x = x
    another.data.y = y
    another.data.d = d
    return another
  }

  // ----------------------------------------------------------------------------
  // Public API
  // ----------------------------------------------------------------------------

  /**
   * Returns an initialized FirePoint DllNode object from the reserve pool
   * that is set as the head of a doublely linked list (i.e., this === next === prev)
   * @param {number} x FirePoint's initial x-position in its FireGrid
   * @param {number} y FirePoint's initial y-position in its FireGrid
   * @param {number} d FirePoint's direction of travel, degrees clockwise from North
   * @retiurns {DllNode} Reference to a DllNode containing an initialized FirePojnt object
   */
  getFirst (x, y, d) {
    const first = this._getNode(x, y, d)
    first.prev = first
    first.next = first
    return first
  }

  /**
   * Inserts an initialized FirePoint object from the reserve pool
   * into, and immediately after, the doublely linked list containing *node*.
   * @param {DllNode} node DllNode AFTER which the new FirePoint is to be inserted.
   * @param {number} x FirePoint's initial x-position in its FireGrid
   * @param {number} y FirePoint's initial y-position in its FireGrid
   * @param {number} d FirePoint's direction of travel, degrees clockwise from North
   * @returns {DllNode} Reference to the newly inserted and initialized FirePojnt object
   */
  insertAfter (node, x, y, d) {
    const another = this._getNode(x, y, d)
    node.insertAfter(another)
    return another
  }

  /**
   * Releases all references to all DllNodes in the reserve pool EXCEPT the first *save* nodes.
   * @param {number} save The number of FirePoint DllNodes to save
   */
  release (save = 0) {
    this.reserve.length = save
  }

  /**
   * Removes the FirePoint DllNode from its doublely linked list and returns it to the reserve
   * @param {FirePoint} node The FirePoint DllNode to be removed from its doublely linked list
   */
  remove (node) {
    node.data.x = 0
    node.data.y = 0
    node.data.d = 0
    node.remove()
    this.reserve.push(node)
  }
}

/**
 * FirePointPool is a Singleton FirePointReserve
 */
export const FirePointPool = new FirePointReserve()
