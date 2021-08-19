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
const calcuateEnerge = (energies, imageData, viewport, W, H) => {
  const { data } = imageData
  const sz = 4 // RGBA
  let top, right, bottom, left
  let offset
  energies[0].fill(ENERGY_AT_BORDER)
  energies[viewport.height - 1].fill(ENERGY_AT_BORDER)
  for (let y = 1; y < viewport.height - 1; y++) {
    // const rows = energies[y]
    energies[y][0] = ENERGY_AT_BORDER
    energies[y][viewport.width - 1] = ENERGY_AT_BORDER
    for (let x = 1; x < viewport.width - 1; x++) {
      offset = x + y * W
      top = offset - W
      right = offset + 1
      bottom = offset + W
      left = offset - 1
      const diffLR = diff(left, right, data)
      const diffTB = diff(top, bottom, data)
      // energies[y][x] = Math.sqrt(diffLR + diffTB)
      energies[y][x] = diffLR + diffTB // skip square root for performance
    }
  }
}
const minIndexAt = (arr, width, l, m, r) => {
  let index = l < 0 ? m : arr[l] < arr[m] ? l : m
  index = r === width ? index : arr[index] <= arr[r] ? index : r
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
      const minIdx = minIndexAt(prevs, width, x - 1, x, x + 1)
      path[x] = minIdx
      rows[x] += prevs[minIdx]
    }
    pathes.push(path)
    prevs = rows
  }
  // find min
  let minIndex = 0
  rows.forEach((val, index) => {
    if (index < width && val < rows[minIndex]) {
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
    this.$$.dirty = true

    this.$$.viewport = {
      width,
      height
    }
    this.energies = new Array(height)
    for (let y = 0; y < height; y++) {
      this.energies[y] = new Array(width)
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
      let offset = SIZE * (this.width * y + vseam[y])
      const start = offset + SIZE
      const end = SIZE * (this.width * y + viewport.width - 1)
      data.copyWithin(offset, start, end + SIZE)
      // data[end + 0] = 0
      // data[end + 1] = 0
      // data[end + 2] = 0
      // data[end + 3] = 255
    }
    viewport.width -= 1
    // this.energies = null
    this.$$.vseam = null
    this.$$.dirty = true
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
    ctx.putImageData(
      this.$$.imageData,
      0,
      0,
      0,
      0,
      this.viewportWidth,
      this.viewportHeight
    )
  }
  resolveVerticalSeam(renderSeam) {
    if (this.$$.dirty) {
      calcuateEnerge(
        this.energies,
        this.$$.imageData,
        this.$$.viewport,
        this.width,
        this.height
      )
      this.dirty = false
    }
    const { width, height } = this.$$.viewport
    const seam = vSeam(this.energies, width, height)
    this.$$.vseam = seam
    if (renderSeam) {
      this.renderVerticalSeam(seam)
    }
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
