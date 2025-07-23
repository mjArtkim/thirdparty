<template>
  <canvas ref="canvas" class="trail-canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const canvas = ref(null)

onMounted(() => {
  let c = canvas.value
  let ctx = c.getContext('2d')
  let trails = []

  const ns = {}
  ns.point = function (x, y) {
    this.x = x
    this.y = y
  }
  ns.point.prototype = {
    add(p) {
      return new ns.point(this.x + p.x, this.y + p.y)
    },
    sub(p) {
      return new ns.point(this.x - p.x, this.y - p.y)
    },
    negate() {
      this.x *= -1
      this.y *= -1
      return this
    },
    clone() {
      return new ns.point(this.x, this.y)
    },
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    normalize(scale = 1) {
      const l = this.length()
      this.x = (this.x / l) * scale
      this.y = (this.y / l) * scale
      return this
    }
  }

  ns.stroke = function (anchors, width, strokeCount, color) {
    this.anchors = anchors
    this.width = width
    this.strokeCount = strokeCount
    this.color = color
  }

  ns.stroke.prototype = {
    normal(p0, p1) {
      return new ns.point(1, 0)
    },
    draw(ctx) {
      if (!this.anchors) return
      let p, c, n, pnorm, pln, prn, cnorm, cln, crn
      for (let j = 0; j < this.strokeCount; j++) {
        let half = this.width * 50 * Math.random()
        let col = ns.variation(this.color, 5)
        ctx.lineWidth = 80 + Math.random() * 0.5

        for (let i = 0; i < this.anchors.length - 2; i++) {
          p = this.anchors[i]
          c = this.anchors[i + 1]
          n = this.anchors[i + 2]

          pnorm = this.normal(p, c)
          cnorm = this.normal(c, n)

          half += Math.random() - 0.5
          pnorm.normalize(half)
          pln = p.add(pnorm)
          pnorm.normalize(-half)
          prn = p.add(pnorm)

          half += Math.random() - 0.5
          cnorm.normalize(half)
          cln = c.add(cnorm)
          cnorm.normalize(-half)
          crn = c.add(cnorm)

          ctx.beginPath()
          ctx.strokeStyle = col
          ctx.moveTo(prn.x, prn.y)
          ctx.lineTo(crn.x, crn.y)
          ctx.stroke()
          ctx.closePath()
          ctx.shadowBlur = 500

          ctx.beginPath()
          ctx.strokeStyle = col
          ctx.moveTo(pln.x, pln.y)
          ctx.lineTo(cln.x, cln.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
  }

  ns.variation = function (color, amount = 25) {
    let r = (color >> 16) & 0xff
    let g = (color >> 8) & 0xff
    let b = color & 0xff

    r += Math.floor((Math.random() - 0.5) * amount)
    g += Math.floor((Math.random() - 0.5) * amount)
    b += Math.floor((Math.random() - 0.5) * amount)

    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))

    return `rgba(${r},${g},${b},${Math.random()})`
  }

  ns.trailer = function (colors, yOffset) {
    this.points = []
    this.stroke = new ns.stroke(null, 100, 10, colors[0])
    this.colorIterator = 0
    this.colors = colors
    this.yOffset = yOffset || 0
  }

  ns.trailer.prototype = {
    reset() {
      this.points = []
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.radius = Math.max(this.width, this.height)
      this.center = new ns.point(this.width / 2, this.height / 2 + this.yOffset)

      // this.a0 = Math.random() * Math.PI;
      // this.a1 = Math.random() * Math.PI;
      // this.a2 = Math.random() * Math.PI;
      this.a0 = 0;  
      this.a1 = 0;
      this.a2 = 0;

      let mul = 1 + Math.random() * 2
      mul = Math.random() > 0.5 ? mul * 5 : mul / 2

      this.s0 = (Math.random() - 0.5) * (mul / 200) * Math.PI
      this.s1 = (Math.random() - 0.5) * (mul / 200) * Math.PI
      this.s2 = (Math.random() - 0.5) * (mul / 200) * Math.PI
    },
    compute(ctx) {
      this.a0 += this.s0
      this.a1 += this.s1
      this.a2 += this.s2

      const x = this.center.x + this.a0 * 3 + Math.sin(Date.now() * 0.5 + this.yOffset) * 10
      const y = this.center.y + Math.sin(Date.now() * 0.0 + this.yOffset) * 60

      this.points.push(new ns.point(x, y))

      if (this.points.length > 20) this.points.shift()

      this.stroke.anchors = this.points
      this.stroke.draw(ctx)

      const t = 0.5 + Math.sin(Date.now() * 0.001) * 0.5
      this.stroke.color = this.colors[Math.floor(t * this.colors.length)]
      this.stroke.width = 25 + (1 - t) * 50
      this.stroke.strokeCount = 5
        }
      }

  function reset() {
    ctx.fillStyle = '#0f0f0f'
    ctx.fillRect(0, 0, c.width, c.height)
    trails.forEach(trail => trail.reset())
  }

  function compute() {
    trails.forEach(trail => trail.compute(ctx))
  }

  function initCanvas() {
    c.width = window.innerWidth
    c.height = window.innerHeight

// 화면 너비에 비례한 트레일 간격 계산
const trailOffset = window.innerHeight / 4.65
    trails.push(new ns.trailer([0xffffff, 0xf0f0f0, 0xeeeeee, 0xf0f0f0, 0xffffff], -trailOffset))  // 첫 번째 선 (위쪽)
    trails.push(new ns.trailer([0xffffff, 0xf0f0f0, 0xeeeeee, 0xf0f0f0, 0xffffff], 0))      // 두 번째 선 (중앙)
    trails.push(new ns.trailer([0xffffff, 0xf0f0f0, 0xeeeeee, 0xf0f0f0, 0xffffff], trailOffset))   // 세 번째 선 (아래쪽)

    reset()
    const animationInterval = setInterval(compute, 70)
    setTimeout(() => {
      clearInterval(animationInterval)
    }, 60000) // 
  }

  initCanvas()
  window.addEventListener('resize', reset)
  c.addEventListener('mousedown', reset)
})
</script>

<style scoped>
.trail-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>