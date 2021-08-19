import './style.scss'
import { Canvas } from './canvas'
import dom from './dom'
const EVENTS = {
  progress: 'progress',
  done: 'done'
}
const resolveImage = (file, callback) => {
  const img = new Image()
  img.onload = () => {
    callback(img)
  }
  img.src = window.URL.createObjectURL(file)
}
const resolveEventName = (eventName) => {
  const name = EVENTS[eventName]
  if (!name) {
    throw new Error(
      `invalid event [${eventName}]. 'progress' and 'done' are supported.`
    )
  }
  return name
}
class ScheduledOp {
  constructor(seamCarving, cutSize) {
    this.$$ = {
      listener: null,
      seamCarving,
      limit: cutSize,
      current: 0,
      stats: [],
      dim: {
        imageWidth: seamCarving.imageWidth,
        imageHeight: seamCarving.imageHeight
      }
    }
    const progress = seamCarving.eventBus.hasListeners(EVENTS.progress)
    const done = seamCarving.eventBus.hasListeners(EVENTS.done)
    if (progress || done) {
      this.$$.listener = { progress, done }
    }
  }
  start() {
    const { listener, limit, current, seamCarving, stats, dim } = this.$$
    if (current === limit) {
      if (listener && listener.done) {
        const totalTime = stats.reduce((sum, stat) => sum + stat.elapsed, 0)
        const avgTime = totalTime / stats.length
        seamCarving.eventBus.emit(EVENTS.done, {
          index: current,
          limit,
          totalTime,
          avgTime,
          stats,
          dim
        })
      }
    } else {
      setTimeout(() => {
        // capture elapted time
        const s = performance.now()
        seamCarving.canvas.cutVSeam()
        const delta = performance.now() - s
        let stat = null
        if (listener) {
          stat = {
            index: current,
            limit,
            elapsed: delta,
            dim: Object.assign(
              {
                viewportWidth: seamCarving.viewportWidth,
                viewportHeight: seamCarving.viewportHeight
              },
              dim
            )
          }
        }
        if (listener && listener.done) {
          stats.push(stat)
        }
        if (listener && listener.progress) {
          seamCarving.eventBus.emit(EVENTS.progress, stat)
        }
        this.$$.current++
        this.start()
      })
    }
  }
}
class SeamCarving {
  constructor($wrapper) {
    this.$$ = {}
    this.$$.$wrapper = $wrapper
    this.canvas = new Canvas($wrapper)
    this.$$.ebus = dom.event.createEventBus()
  }
  render(file) {
    resolveImage(file, (image) => {
      this.$$.imageSource = {
        image,
        width: image.width,
        height: image.height,
        size: file.size,
        originName: file.name
      }
      this.canvas.setImageSource(this.$$.imageSource)
      // this.seam()
    })
  }
  renderVSeam() {
    this.canvas.resolveVerticalSeam(true)
  }
  cutVSeam(cutSize) {
    const size = cutSize || 1
    // this.canvas.cutVSeam()
    new ScheduledOp(this, size).start()
    return this
  }
  on(eventName, callback) {
    const name = resolveEventName(eventName)
    this.eventBus.on(name, callback)
    return this
  }
  capture() {
    const meta = this.canvas.capture()
    meta.fileName = this.$$.imageSource.originName
    return meta
  }
  get eventBus() {
    return this.$$.ebus
  }
  get imageWidth() {
    return this.$$.imageSource.width
  }
  get imageHeight() {
    return this.$$.imageSource.height
  }
  get viewportWidth() {
    return this.canvas.viewportWidth
  }
  get viewportHeight() {
    return this.canvas.viewportHeight
  }
}
const init = (el) => new SeamCarving(el)
export { init, SeamCarving }
export default { SeamCarving }
