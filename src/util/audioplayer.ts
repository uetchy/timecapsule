export default class AudioPlayer {
  AudioContext: AudioContext
  nodes: AudioNode[]
  reqFrame?: number

  constructor() {
    this.nodes = []
    this.AudioContext = new AudioContext()
    this.reqFrame = requestAnimationFrame(this.onTimeUpdate.bind(this))
  }

  addSource(args: SourceArgs) {
    return new Promise<AudioNode>((resolve, reject) => {
      console.log('Mixer:addSource', args.name)
      const ctx = this.AudioContext
      ctx.decodeAudioData(args.buffer, audioBuffer => {
        const bufSource = ctx.createBufferSource()

        const node = <AudioNode>{
          source: bufSource,
          name: args.name,
          start: 0,
          isPlaying: false,
          onTimeUpdate: args.onTimeUpdate,
        }

        bufSource.onended = () => {
          node.source.stop()
          node.isPlaying = false
          args.onEnded()
        }
        bufSource.buffer = audioBuffer
        bufSource.connect(ctx.destination)

        this.nodes.push(node)
        resolve(node)
      })
    })
  }

  _getNode(name: string) {
    for (const t of this.nodes) {
      if (t.name === name) {
        return t
      }
    }
    return undefined
  }

  play(name: string, startPosition: number) {
    console.log('Mixer:play', name, startPosition)
    const node = this._getNode(name)
    if (!node) {
      return
    }
    node.offset = this.AudioContext.currentTime
    node.start = startPosition
    node.source.start(0, startPosition)
    node.isPlaying = true
  }

  _stop(node: AudioNode) {
    node.source.stop()
    node.offset = null
    node.isPlaying = false
  }

  stop(name: string) {
    console.log('Mixer:stop', name)
    const node = this._getNode(name)
    if (!node) {
      return
    }
    this._stop(node)
  }

  stopAll() {
    console.log('Mixer:stopAll')
    for (const node of this.nodes) {
      if (node.isPlaying) {
        this._stop(node)
      }
    }
  }

  onTimeUpdate() {
    for (const node of this.nodes) {
      if (node.isPlaying) {
        const currentTime =
          this.AudioContext.currentTime - (node.offset || 0) + node.start
        node.onTimeUpdate(currentTime)
      }
    }
    this.reqFrame = requestAnimationFrame(this.onTimeUpdate.bind(this))
  }
}
