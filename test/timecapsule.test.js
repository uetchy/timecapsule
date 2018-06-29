const { expect } = require('chai')

const { Timecapsule, Capsule } = require('../dist')

describe('Timecapsule', function() {
  this.timeout(5000)

  let deltaTime = 0

  it('invoke event at a spcified time', done => {
    const tc = new Timecapsule([
      new Capsule(0, () => {
        console.log('start')
        expect(deltaTime).to.within(0, 0.1)
      }),
      new Capsule(3, () => {
        console.log('last')
        expect(deltaTime).to.within(2.9, 3.1)
      }),
    ])

    tc.add(1, () => {
      console.log('1s')
      expect(deltaTime).to.within(0.9, 1.1)
    })

    const timer = setInterval(() => {
      // console.log(deltaTime)
      tc.invoke(deltaTime)
      deltaTime += 0.1
      if (deltaTime > 3.1) {
        clearInterval(timer)
        done()
      }
    }, 100)
  })
})
