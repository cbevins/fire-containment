function one () {
// line construction at head of fire
  const line = {
    x: 0, // head of line x-pos
    y: 10, // head of line y-pos
    r: 2, // line construction rate (ft/min)
    t: -1, // line construction time (min)
    d: 0 // distance from current line head to fire vector at time fire.t
  }
  // fire vector
  const fire = {
    x: -1, // fire vector x-pos
    y: 9, // fire vector y-pos
    dx: -1, // fire vector slope x component
    dy: 10, // fire vector slope y component
    r: 10, // fire spread rate along this vector (ft/min)
    t: 0 // spread time (min)
  }

  let n = 0
  while (fire.t < line.t) {
    fire.t += 0.001
    // Fire vector position at time fire.t
    fire.xt = fire.x + fire.t * fire.r * fire.dx // WRONG...cos()
    fire.yt = fire.y + fire.t * fire.r * fire.dy

    // Distance from current line head to fire vector at time t
    line.d = Math.sqrt((line.x - fire.xt) * (line.x - fire.xt) + (line.y - fire.yt) * (line.y - fire.yt))
    // Time required for line production to reach this fire vector point
    line.t = line.d / line.r
    console.log(n, ':',
      't=', fire.t.toFixed(4),
      'x=', fire.xt.toFixed(2),
      'y=', fire.yt.toFixed(2),
      'd=', line.d.toFixed(2),
      't=', line.t.toFixed(6))
    n += 1
  }
}
one()
