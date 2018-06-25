interface AudioNode {
  source: AudioBufferSourceNode
  name: string
  start: number
  offset?: number
  isPlaying: boolean
  onTimeUpdate: Function
}

interface SourceArgs {
  name: string
  buffer: ArrayBuffer
  onTimeUpdate: Function
  onEnded: Function
}

export default class AudioMixer {
  AudioContext: AudioContext
  nodes: AudioNode[]
  reqFrame?: number

  constructor() {
    this.AudioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.nodes = []

    this.reqFrame = null
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
          offset: null,
          isPlaying: false,
          onTimeUpdate: args.onTimeUpdate,
        }

        bufSource.onended = () => {
          node.source.stop()
          node.offset = null
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
    let node
    for (const t of this.nodes) {
      if (t.name === name) {
        return t
      }
    }
  }

  play(name: string, startPosition: number) {
    console.log('Mixer:play', name, startPosition)
    const node = this._getNode(name)
    node.offset = this.AudioContext.currentTime
    node.start = startPosition
    node.source.start(0, startPosition)
    node.isPlaying = true
  }

  stop(name: string) {
    console.log('Mixer:stop', name)
    const node = this._getNode(name)
    node.source.stop()
    node.offset = null
    node.isPlaying = false
  }

  stopAll() {
    console.log('Mixer:stopAll')
    for (const node of this.nodes) {
      if (node.isPlaying) {
        node.source.stop()
        node.offset = null
        node.isPlaying = false
      }
    }
  }

  onTimeUpdate() {
    for (const node of this.nodes) {
      if (node.isPlaying) {
        const currentTime = this.AudioContext.currentTime - node.offset + node.start
        node.onTimeUpdate(currentTime)
      }
    }
    this.reqFrame = requestAnimationFrame(this.onTimeUpdate.bind(this))
  }
}
