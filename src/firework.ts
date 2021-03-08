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
    bounce: boolean = false
    born: Date = new Date()
    constructor(
            x: number = 0,
            y: number = 0,
            radius: number = 10,
            color: string = "#ff0000",
            vector: { x: number, y: number, t: number } = null, 
            bounce = false) {
        this.bounce = bounce
        this.color = color
        this.radius = radius
        // initial position
        this.x = x
        this.y = y
        // vectors for waving motion
        this.wander = this.random(0.1, 0.6)
        // particles slow down
        this.drag = this.random(this.bounce ? 0.90 : 0.85, 0.99)
        // the direction 
        this.theta = Math.random() * Math.PI * 2
        const force = this.random(0.4, 0.8)
        this.vx = Math.sin(this.theta) * force
        this.vy = Math.cos(this.theta) * force
        // now impart the passed in vector from touch input
        if (vector) {
            //const af = Math.min(15, vector.t) / 15
            const af = Math.min(10, vector.t) / 10
            //const lvx = (vector.x / 3) * af
            //const lvy = (vector.y / 3) * af
            const lvx = vector.x / 4
            const lvy = vector.y / 4
            // add rando vectors
            this.vx += lvx
            this.vy += lvy
        }
    }
    move() {
        if (!this.bounce) {
            
            this.x += this.vx
            this.y += this.vy
        } else {
            if ( this.getAge() < 250) {
                this.x += this.vx * 4
                this.y += this.vy * 4
            } else {
                this.x -= this.vx * 2
                this.y -= this.vy * 2
            }
        }
        // wander
        this.theta += this.random(-0.5, 0.5) * this.wander
        this.vx += Math.sin(this.theta) * 0.02
        this.vy += Math.cos(this.theta) * 0.02
        // drag vel
        this.vx *= this.drag
        this.vy *= this.drag
        // drag shrink
        this.radius *= this.bounce ? 0.96 : 0.97
        // expire
        this.alive = this.radius > 0.5
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    random(min, max) {
        return Math.random() * (max - min) + min
    }
    getAge() {
        let thisTime = new Date()
        return (thisTime.valueOf() - this.born.valueOf())
    }

}