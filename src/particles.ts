import { Firework } from './firework'

export class Particles {
  MAX_PARTICLES: number = 500
  FAST_PARTICLES: number = 500
  SPAWN_MIN: number = 3
  SPAWN_MAX: number = 5
  particles = []
  times: number[] = []
  lastParp: {time: number, particles: number, x: number, y: number} = null
  colors: string[] 
  width: number
  height: number
  recordMode: boolean = false
  lastSpawn: {x: number, y: number, d: Date} = null
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  running: boolean = false
  constructor(canvas: HTMLCanvasElement, colors: string[] = null) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.ctx.globalCompositeOperation  = 'color'
    this.colors = colors ? colors : this.getRandomColors(20)
  }
  
  begin(recordMode: boolean = false) {
    this.recordMode = recordMode
    this.lastParp = null
    this.running = true
    this.renderTick()
  }

  renderTick() {
    this.drawParticles()
    this.moveParticles()
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.renderTick()
      })
    } 
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let p of this.particles) {
      p.draw(this.ctx)
    }
  }

  moveParticles() {
    let lp = []
    for ( let p of this.particles ) {
      p.move()
      if (p.alive) {
        lp.push(p)
      }
    }
    this.particles = lp
  }

  spawnParticles(x: number, y: number, vec: {x: number, y: number, t: number} = null ) {
    if (!vec) {
      return
    }
    let mp = this.recordMode ? this.FAST_PARTICLES : this.MAX_PARTICLES
    if ( this.particles.length >= mp ) {
      this.particles.shift()
    }
    const firework = new Firework(
      x,
      y,
      this.random( 3, 5 ),
      this.randomPick(this.colors),
      vec
    )
    this.particles.push(firework)
  }

  resize(rect: DOMRect) {
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.setProperty('width', this.width.toString()+'px')
    this.canvas.style.setProperty('height', this.height.toString()+'px')
    this.canvas.style.setProperty('left', rect.left.toString()+'px')
    this.canvas.style.setProperty('right', rect.right.toString()+'px')
  }
 
  stop() {
    this.lastParp = null
    this.running = false
    this.particles = []
  }
  random( min, max ) {
    return Math.random() * (max - min) + min
  }
  randomPick(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)]
  }
  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // pttoooooey paaaaaaarp ptweeeeee!!!!
  parp(x: number, y: number): void {
    let fx = ~~(this.width*x), fy = ~~(this.height*y)
    const interpolate = (x1, y1, x2, y2, steps) => {
      let dx = ((x2 - x1) / steps), dy =((y2 - y1) / steps)
      let res = []
      for (let i = 1; i <= steps; ++i) {
        res.push({
          x: x1 + dx * i,
          y: y1 + dy * i
        })
      }
      return res
    }
    const spawn = (x: number, y: number, min: number = null, max: number = null) => {
      let vec = this.lastSpawn ?
        {
          x: fx - this.lastSpawn.x,
          y: fy - this.lastSpawn.y,
          t: new Date().valueOf() - this.lastSpawn.d.valueOf()
        } : null
      if (!min) {
        this.spawnParticles(fx, fy, vec)
      } else {
        let mv = this.lastSpawn 
          ? Math.min(Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2)), 10)
          : 0
        let af = ((mv + 2) / 6)
        let smin = ~~(min*af)
        let smax = ~~(max*af)
        for (let x = 0; x < this.getRandomIntInclusive(smin, smax); ++x) {
          this.spawnParticles(fx, fy, vec)
        }
      }
    }
    // spawn(fx, fy, this.SPAWN_MIN, this.SPAWN_MAX)
    //  interpolate between last update (removed record distinction)
    let fc: number

    if (this.lastParp) {
      let elT = new Date().valueOf() - this.lastParp.time
      fc = 1 + ~~(60 / (1000/elT)) // scale steps to current frmme rate
      let steps = interpolate(this.lastParp.x, this.lastParp.y, x, y, fc)
      if (steps.length > 1) {
        steps = steps.slice(1)
      }
      const minspawn = ~~(this.SPAWN_MIN/steps.length)
      const maxspawn = ~~(this.SPAWN_MAX/steps.length)
      console.log('steps', elT,steps.length, minspawn, maxspawn)
      for (let s of steps) {
        let px = ~~(this.width*s.x), py = ~~(this.height*s.y)
        spawn(px, py, minspawn, maxspawn)
      }
    } else {
      fc = 1
      // no last move
      spawn(fx, fy, this.SPAWN_MIN, this.SPAWN_MAX)
    }
    this.lastParp = {time: new Date().valueOf(), particles: fc, x: x, y: y}
    
    this.lastSpawn = {
      x: fx,
      y: fy,
      d: new Date()
    }
  }
  // called by finishCurrentGesture() following touch end
  endParp() {
    this.lastSpawn = null
    this.lastParp = null
  }
  // called by play routine when getCurrentGestureByTime(elapsed) returns null
  clearLastParp() {
    this.lastParp = null
  }

  getRandomColors(num: number): string[] {
    let colors: string[] = []
    for (let i = 0; i < num; ++i) {
      colors.push(this.rainbow(num, i))
    }
    return colors
  }

  rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }

}