import './style.scss'
import { Canvas } from './canvas'

const resolveImage = (file, callback) => {
  const img = new Image()
  img.onload = () => {
    callback(img)
  }
  img.src = window.URL.createObjectURL(file)
}
class SeamCarving {
  constructor($wrapper) {
    this.$$ = {}
    this.$$.$wrapper = $wrapper
    this.canvas = new Canvas($wrapper)
  }
  render(file) {
    resolveImage(file, (image) => {
      this.$$.imageSource = {
        image,
        width: image.width,
        height: image.height,
        size: file.size
      }
      this.canvas.setImageSource(this.$$.imageSource)
      // this.seam()
    })
  }
  renderVSeam() {
    this.canvas.resolveVerticalSeam()
  }
  cutVSeam() {
    this.canvas.cutVSeam()
  }
}
const init = (el) => new SeamCarving(el)
export { init, SeamCarving }
export default { SeamCarving }
