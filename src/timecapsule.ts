export class Capsule {
  targetTime: number
  emitted: boolean
  callback: () => void

  constructor(targetTime: number, callback: () => void) {
    this.targetTime = targetTime
    this.emitted = false
    this.callback = callback
  }

  check(time: number) {
    if (this.emitted == true) {
      return
    }
    if (time >= this.targetTime) {
      this.emitted = true
      this.run()
    }
  }

  run() {
    this.callback()
  }
}

export class Timecapsule {
  capsuleGroup: Capsule[]

  constructor(capsuleGroup: Capsule[]) {
    this.capsuleGroup = capsuleGroup
  }

  add(targetTime: number, callback: () => void) {
    this.capsuleGroup.push(new Capsule(targetTime, callback))
  }

  invoke(deltaTime: number) {
    for (const capsule of this.capsuleGroup) {
      capsule.check(deltaTime)
    }
  }
}
