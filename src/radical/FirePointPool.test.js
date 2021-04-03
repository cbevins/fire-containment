// FirePointPool is a Singleton object of class FirePointReserve
import { FirePointPool, FirePointReserve } from './FirePointPool.js'

test('new FirePointReserve()', () => {
  let pool = new FirePointReserve()
  expect(pool.reserve).toHaveLength(100)

  pool = new FirePointReserve(10)
  expect(pool.reserve).toHaveLength(10)
})

test('FirePointReserve._addReserveNodes()', () => {
  const pool = new FirePointReserve()
  expect(pool.reserve).toHaveLength(100)
  pool._addReserveNodes(2)
  expect(pool.reserve).toHaveLength(102)
})

test('FirePointReserve.getFirst()', () => {
  const pool = new FirePointReserve(10)
  expect(pool.reserve).toHaveLength(10)
  const node = pool.getFirst(1, 2, 3)
  expect(node.prev).toEqual(node)
  expect(node.next).toEqual(node)
  expect(node.data.x).toEqual(1)
  expect(node.data.y).toEqual(2)
  expect(node.data.d).toEqual(3)
  expect(pool.reserve).toHaveLength(9)
  // expect(node.nodes()).toEqual(1)
})

test('FirePointReserve.insertAfter()', () => {
  const pool = new FirePointReserve(10)
  expect(pool.reserve).toHaveLength(10)

  const n1 = pool.getFirst(1, 1, 1)
  expect(n1.next).toEqual(n1)
  expect(n1.prev).toEqual(n1)
  expect(n1.nodes()).toEqual(1)
  expect(pool.reserve).toHaveLength(9)

  const n2 = pool.insertAfter(n1, 2, 4, 6)
  expect(n2.data.x).toEqual(2)
  expect(n2.data.y).toEqual(4)
  expect(n2.data.d).toEqual(6)
  expect(n1.next).toEqual(n2)
  expect(n1.prev).toEqual(n2)
  expect(n2.next).toEqual(n1)
  expect(n2.prev).toEqual(n1)
  expect(n1.nodes()).toEqual(2)
  expect(n2.nodes()).toEqual(2)
  expect(pool.reserve).toHaveLength(8)

  const n3 = pool.insertAfter(n1, 3, 6, 9)
  expect(n3.data.x).toEqual(3)
  expect(n3.data.y).toEqual(6)
  expect(n3.data.d).toEqual(9)
  expect(n1.next).toEqual(n3)
  expect(n1.prev).toEqual(n2)
  expect(n2.next).toEqual(n1)
  expect(n2.prev).toEqual(n3)
  expect(n3.prev).toEqual(n1)
  expect(n3.next).toEqual(n2)
  expect(n1.nodes()).toEqual(3)
  expect(n2.nodes()).toEqual(3)
  expect(n2.nodes()).toEqual(3)
  expect(pool.reserve).toHaveLength(7)
})

test('FirePointReserve._addReserveNodes() with _getNode()', () => {
  const pool = new FirePointReserve(4)
  expect(pool.reserve).toHaveLength(4)

  const first = pool.getFirst(1, 1, 1)
  expect(pool.reserve).toHaveLength(3)

  pool.insertAfter(first, 2, 2, 2)
  expect(pool.reserve).toHaveLength(2)

  pool.insertAfter(first, 3, 3, 3)
  expect(pool.reserve).toHaveLength(1)

  pool.insertAfter(first, 4, 4, 4)
  expect(pool.reserve).toHaveLength(0)

  // Should add 4 more, and use 1 of them
  pool.insertAfter(first, 5, 5, 5)
  expect(pool.reserve).toHaveLength(3)
})

test('FirePointReserve.remove()', () => {
  const pool = new FirePointReserve(10)
  expect(pool.reserve).toHaveLength(10)
  const n1 = pool.getFirst(1, 1, 1)
  const n2 = pool.insertAfter(n1, 2, 2, 2)
  const n3 = pool.insertAfter(n2, 3, 3, 3)
  const n4 = pool.insertAfter(n3, 4, 4, 4)
  expect(pool.reserve).toHaveLength(6)
  expect(n1.nodes()).toEqual(4)

  expect(n1.prev).toEqual(n4)
  expect(n1.next).toEqual(n2)
  expect(n2.prev).toEqual(n1)
  expect(n2.next).toEqual(n3)
  expect(n3.prev).toEqual(n2)
  expect(n3.next).toEqual(n4)
  expect(n4.prev).toEqual(n3)
  expect(n4.next).toEqual(n1)

  pool.remove(n3)
  expect(n1.prev).toEqual(n4)
  expect(n1.next).toEqual(n2)
  expect(n2.prev).toEqual(n1)
  expect(n2.next).toEqual(n4)
  expect(n3.prev).toBeNull()
  expect(n3.next).toBeNull()
  expect(n4.prev).toEqual(n2)
  expect(n4.next).toEqual(n1)
  expect(pool.reserve).toHaveLength(7)
  expect(n1.nodes()).toEqual(3)

  const n5 = pool.insertAfter(n4, 5, 5, 5)
  expect(n1.prev).toEqual(n5)
  expect(n4.next).toEqual(n5)
  expect(n5.prev).toEqual(n4)
  expect(n5.next).toEqual(n1)
  expect(pool.reserve).toHaveLength(6)
  expect(n1.nodes()).toEqual(4)
  // Should have reused the old n3
  expect(n5).toEqual(n3)

  pool.release(2)
  expect(pool.reserve).toHaveLength(2)

  pool.release()
  expect(pool.reserve).toHaveLength(0)
})
