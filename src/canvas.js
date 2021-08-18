import dom from './dom'

const ENERGY_AT_BORDER = 1000.0

const diff = (posA, posB, data) => {
  const offsetA = 4 * posA
  const offsetB = 4 * posB
  const r = data[offsetA + 0] - data[offsetB + 0]
  const g = data[offsetA + 1] - data[offsetB + 1]
  const b = data[offsetA + 2] - data[offsetB + 2]
  return r * r + g * g + b * b
}
const calcuateEnerge = (imageData, viewport, W, H) => {
  const { data } = imageData
  // const { width, height } = viewport
  const energes = []
  // console.log(data)
  // data[0] = data[1]
  const sz = 4 // RGBA
  let top, right, bottom, left
  let offset
  for (let y = 0; y < viewport.height; y++) {
    const rows = new Array(viewport.width)
    energes.push(rows)
    if (y === 0 || y + 1 === viewport.height) {
      rows.fill(ENERGY_AT_BORDER)
      continue
    }
    for (let x = 0; x < viewport.width; x++) {
      if (x === 0 || x + 1 === viewport.width) {
        rows[x] = ENERGY_AT_BORDER
      } else {
        offset = x + y * W
        top = offset - W
        right = offset + 1
        bottom = offset + W
        left = offset - 1
        const diffLR = diff(left, right, data)
        const diffTB = diff(top, bottom, data)
        energes[y][x] = parseInt(Math.sqrt(diffLR + diffTB) * 1000) / 1000
      }
    }
  }
  return energes
}
const minIndexAt = (arr, l, m, r) => {
  let index = l < 0 ? m : arr[l] < arr[m] ? l : m
  index = r === arr.length ? index : arr[index] <= arr[r] ? index : r
  return index
}
const vSeam = (energies, width, height) => {
  const pathes = []
  let prevs = [...energies[0]]
  let rows = []
  // let L, M, R // left, mid, right index
  for (let y = 1; y < height; y++) {
    rows = [...energies[y]]
    const path = new Array(width)
    for (let x = 0; x < width; x++) {
      const minIdx = minIndexAt(prevs, x - 1, x, x + 1)
      path[x] = minIdx
      rows[x] += prevs[minIdx]
    }
    pathes.push(path)
    prevs = rows
  }
  // find min
  let minIndex = 0
  rows.forEach((val, index) => {
    if (val < rows[minIndex]) {
      minIndex = index
    }
  })
  // console.log(minIndex)
  const p = [minIndex]
  for (let y = pathes.length - 1; y >= 0; y--) {
    minIndex = pathes[y][minIndex]
    p.push(minIndex)
  }
  // console.log(p)
  return p.reverse()
}
class Canvas {
  constructor($parentEl) {
    const canvas = dom.tag.canvas(null, $parentEl)
    canvas.width = 0
    canvas.height = 0
    this.$canvas = canvas
    this.$$ = {}
  }
  setImageSource(imgSource) {
    this.$$.imgSource = imgSource

    const { $canvas } = this
    const { width, height } = imgSource
    $canvas.width = width
    $canvas.height = height
    $canvas.style.width = `${width}px`
    $canvas.style.height = `${height}px`
    const ctx = $canvas.getContext('2d')
    this.$$.ctx = ctx

    this.$$.viewport = {
      width,
      height
    }
    this.repaint()
  }
  cutVSeam() {
    if (!this.$$.vseam) {
      this.resolveVerticalSeam()
    }
    const SIZE = 4
    const { vseam, viewport, imageData } = this.$$
    const { data } = imageData
    for (let y = 0; y < viewport.height; y++) {
      const offset = SIZE * (this.width * y + vseam[y])
      const start = offset + SIZE
      const end = SIZE * (this.width * y + viewport.width - 1)
      data.copyWithin(offset, start, end)
      data[end + 0] = 255
      data[end + 1] = 0
      data[end + 2] = 0
      data[end + 3] = 255
    }
    viewport.width -= 1
    this.$$.vseam = null
    this.energies = null
    this.repaint()
  }
  renderVerticalSeam(seam) {
    const { ctx, viewport } = this.$$
    ctx.strokeStyle = '#ff0000'
    ctx.beginPath()
    ctx.moveTo(seam[0], 0)
    for (let y = 1; y < viewport.height; y++) {
      ctx.lineTo(seam[y], y)
    }
    // ctx.closePath()
    ctx.stroke()
  }
  repaint() {
    const { ctx, imgSource, imageData } = this.$$
    ctx.clearRect(0, 0, this.width, this.height)
    if (!imageData) {
      ctx.drawImage(imgSource.image, 0, 0)
      this.$$.imageData = ctx.getImageData(0, 0, this.width, this.height)
    }
    ctx.putImageData(this.$$.imageData, 0, 0)
  }
  resolveVerticalSeam() {
    if (!this.energies) {
      this.energies = calcuateEnerge(
        this.$$.imageData,
        this.$$.viewport,
        this.width,
        this.height
      )
    }
    const { width, height } = this.$$.viewport
    const seam = vSeam(this.energies, width, height)
    this.$$.vseam = seam
    this.renderVerticalSeam(seam)
  }
  get width() {
    return this.$$.imgSource.width
  }
  get height() {
    return this.$$.imgSource.height
  }
  get viewportWidth() {
    return this.$$.viewport.width
  }
  get viewportHeight() {
    return this.$$.viewport.height
  }
}
export { Canvas }
export default Canvas
