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
const cutEnergyByVSeam = (canvas) => {
  const { vseam, viewport, imageData } = canvas.$$
  const { data } = imageData
  const W = canvas.width
  let x, offset, top, right, bottom, left
  for (let y = 1; y < viewport.height - 1; y++) {
    x = vseam[y]
    if (x === 0 || x + 1 === viewport.width) {
      canvas.energies[y][x] = ENERGY_AT_BORDER
    } else {
      offset = vseam[y] + y * W
      top = offset - W
      right = offset + 1
      bottom = offset + W
      left = offset - 1
      const diffLR = diff(left, right, data)
      const diffTB = diff(top, bottom, data)
      canvas.energies[y][x] = parseInt(Math.sqrt(diffLR + diffTB) * 1000) / 1000
    }
  }
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
      let offset = SIZE * (this.width * y + vseam[y])
      const start = offset + SIZE
      const end = SIZE * (this.width * y + viewport.width - 1)
      data.copyWithin(offset, start, end)
      data[end + 0] = 255
      data[end + 1] = 0
      data[end + 2] = 0
      data[end + 3] = 255

      // mark edge of energies
      // this.energies[y].copyWithin(vseam[y], vseam[y] + 1, viewport.width)
      if (y > 0 || y + 1 < viewport.height) {
        let x = vseam[y]

        if (x === 0 || x + 1 === viewport.width - 1) {
          this.energies[y][x] = ENERGY_AT_BORDER
        } else {
          offset = x + y * this.width
          const top = offset - this.width
          const right = offset + 1
          const bottom = offset + this.width
          const left = offset - 1
          const diffLR = diff(left, right, data)
          const diffTB = diff(top, bottom, data)
          this.energies[y][x] =
            parseInt(Math.sqrt(diffLR + diffTB) * 1000) / 1000
        }

        x = vseam[y] - 1
        if (x < 0) {
          // skip
        } else if (x === 0) {
          this.energies[y][x] = ENERGY_AT_BORDER
        } else {
          offset = x + y * this.width
          const top = offset - this.width
          const right = offset + 1
          const bottom = offset + this.width
          const left = offset - 1
          const diffLR = diff(left, right, data)
          const diffTB = diff(top, bottom, data)
          this.energies[y][x] =
            parseInt(Math.sqrt(diffLR + diffTB) * 1000) / 1000
        }
      }
    }
    // this.energies = null
    // for (let y = 0; y < viewport.height; y++) {
    //   this.energies[y].copyWithin(vseam[y], vseam[y] + 1, viewport.width - 1)
    //   this.energies[y][viewport.width - 1] = ENERGY_AT_BORDER
    // }
    viewport.width -= 1
    // cutEnergyByVSeam(this)
    // const W = this.width
    // let x // , offset, top, right, bottom, left
    // for (let y = 1; y < viewport.height - 1; y++) {
    //   x = vseam[y]
    //   if (x === 0 || x + 1 === viewport.width) {
    //     this.energies[y][x] = ENERGY_AT_BORDER
    //   } else {
    //     const offset = vseam[y] + y * W
    //     const top = offset - W
    //     const right = offset + 1
    //     const bottom = offset + W
    //     const left = offset - 1
    //     const diffLR = diff(left, right, data)
    //     const diffTB = diff(top, bottom, data)
    //     this.energes[y][x] = parseInt(Math.sqrt(diffLR + diffTB) * 1000) / 1000
    //   }
    // }
    this.$$.vseam = null
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
  resolveVerticalSeam(renderSeam) {
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
