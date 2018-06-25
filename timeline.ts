export class Timeline {
  timelineEventGroup: TimelineEvent[]

  constructor(timelineEventGroup: TimelineEvent[]) {
    this.timelineEventGroup = timelineEventGroup
  }

  add(timelineEvent: TimelineEvent) {
    this.timelineEventGroup.push(timelineEvent)
  }

  invoke(deltaTime: number) {
    for (const timeEvent of this.timelineEventGroup) {
      timeEvent.check(deltaTime)
    }
  }
}

export class TimelineEvent {
  targetTime: number
  emitted: boolean
  callback: Function

  constructor(targetTime: number, callback: Function) {
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
