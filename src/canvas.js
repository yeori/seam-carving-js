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
  const { width: vw, height: vh } = viewport
  const sz = 4 // RGBA
  let start = 0
  let end

  end = W
  energies.fill(ENERGY_AT_BORDER, start, end)

  start = (vh - 1) * W
  end = start + W
  energies.fill(ENERGY_AT_BORDER, start, end)

  let offset, top, right, bottom, left
  for (let y = 1; y < vh - 1; y++) {
    start = y * W
    energies[start] = ENERGY_AT_BORDER
    energies[start + vw - 1] = ENERGY_AT_BORDER
    for (let x = 1; x < vw - 1; x++) {
      offset = start + x
      top = offset - W
      right = offset + 1
      bottom = offset + W
      left = offset - 1
      const diffLR = diff(left, right, data)
      const diffTB = diff(top, bottom, data)
      energies[offset] = diffLR + diffTB
    }
  }
}
const minIndexAt = (arr, width, l, m, r) => {
  let index = l < 0 ? m : arr[l] < arr[m] ? l : m
  index = r === width ? index : arr[index] <= arr[r] ? index : r
  return index
}
function vSeam(energies, viewport, imgWidth, imgHeight) {
  const pathes = []
  const { width, height } = viewport
  let prevs = energies.slice(0, imgWidth)
  let rows = []
  // let L, M, R // left, mid, right index
  for (let y = 1; y < height; y++) {
    rows = energies.slice(y * imgWidth, y * imgWidth + imgWidth)
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
const updateEnergieAt = (data, energies, offset, x, y, W, H) => {
  let top = offset - W
  let right = offset + 1
  let bottom = offset + W
  let left = offset - 1
  const diffLR = diff(left, right, data)
  const diffTB = diff(top, bottom, data)
  energies[offset] = diffLR + diffTB
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
    const flatLength = width * height
    this.energies = new Uint32Array(flatLength)

    this.repaint()

    calcuateEnerge(
      this.energies,
      this.$$.imageData,
      this.$$.viewport,
      this.width,
      this.height
    )
  }
  cutVSeam() {
    if (!this.$$.vseam) {
      this.resolveVerticalSeam()
    }
    const SIZE = 4
    const { energies } = this
    const { vseam, viewport, imageData } = this.$$
    const { data } = imageData
    const imageWidth = this.width
    const imageHeight = this.height
    let offset
    // skip first row - all 1000
    for (let y = 0; y < viewport.height; y++) {
      offset = imageWidth * y + vseam[y]
      const start = offset + 1
      const end = imageWidth * y + viewport.width
      data.copyWithin(SIZE * offset, SIZE * start, SIZE * end)
      // data[end + 0] = 0
      // data[end + 1] = 0
      // data[end + 2] = 0
      // data[end + 3] = 255
      energies.copyWithin(offset, start, end)
    }
    viewport.width -= 1
    this.$$.vseam = null

    for (let y = 1; y < viewport.height - 1; y++) {
      let x = vseam[y]
      offset = imageWidth * y + x
      if (x > 0) {
        updateEnergieAt(data, energies, offset, x, y, imageWidth, imageHeight)
        if (x - 1 > 0) {
          updateEnergieAt(
            data,
            energies,
            offset - SIZE,
            x - 1,
            y,
            imageWidth,
            imageHeight
          )
        }
      }
    }
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
    const seam = vSeam(this.energies, this.$$.viewport, this.width, this.height)
    this.$$.vseam = seam
    if (renderSeam) {
      this.renderVerticalSeam(seam)
    }
  }
  capture() {
    const { ctx } = this.$$
    const { width, height } = this.$$.viewport
    const imageData = ctx.getImageData(0, 0, width, height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    return { width, height, type: 'data-url', image: canvas.toDataURL() }
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
