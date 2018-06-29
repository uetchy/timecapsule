interface AudioPlayerNode {
  source: AudioBufferSourceNode
  name: string
  start: number
  offset: number | null
  isPlaying: boolean
  onTimeUpdate: Function
}

interface SourceArgs {
  name: string
  buffer: ArrayBuffer
  onTimeUpdate: Function
  onEnded: Function
}
