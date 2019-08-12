export class Firework {
  alive: boolean = true
  radius: number
  wander: number 
  theta: number
  x: number
  y: number
  vx: number
  vy: number
  drag: number 
  color: string
  constructor(
      x: number = 0, 
      y: number = 0, 
      radius: number = 10, 
      color: string = "#ff0000", 
      vector: {x: number, y: number, t: number} = null) {
    this.color = color
    this.radius = radius
    // initial position
    this.x = x
    this.y = y
    // vectors for waving motion
    this.wander = this.random( 0.1, 0.6 )
    // particles slow down
    this.drag = this.random( 0.85, 0.99 )
    // the direction 
    this.theta = Math.random() * Math.PI * 2
    const force = this.random( 0.4, 0.8 )
    //const force = this.random( 0.1, 0.3 )
    this.vx = Math.sin( this.theta ) * force
    this.vy = Math.cos( this.theta ) * force
    // now impart the passed in vector from touch input
    if (vector) {
      const af = Math.min(15, vector.t) / 15
      const lvx = vector.x / 3 * af
      const lvy = vector.y / 3 * af
      // add rando vectors
      this.vx += lvx
      this.vy += lvy
      //this.vx = lvx
      //this.vy = lvy
    }
  }
  move() {
    this.x += this.vx
    this.y += this.vy
    this.theta += this.random( -0.5, 0.5 ) * this.wander
    this.vx += Math.sin( this.theta ) * 0.03
    this.vy += Math.cos( this.theta ) * 0.03
    this.vx *= this.drag
    this.vy *= this.drag
    this.radius *= 0.98
    this.alive = this.radius > 0.5
  }
  draw( ctx: CanvasRenderingContext2D ) {
    ctx.beginPath()
    ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2 )
    ctx.fillStyle = this.color
    ctx.fill()
  }
  random( min, max ) {
    return Math.random() * (max - min) + min
  }

}