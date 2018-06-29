# TimecapsuleJS

```shell
npm install --save timecapsule
```

## Usage

```js
const { Timecapsule } = require('timecapsule')

const group = new Timecapsule()

group.add(0, () => {
  console.log('animation start')
})

group.add(1.2, () => {
  console.log('show background')
})

group.add(3.2, () => {
  console.log('show stars')
})
```

or

```js
const { Timecapsule, Capsule } = require('timecapsule')

const group = new Timecapsule([
  new Capsule(0.0, () => console.log('animation start')),
  new Capsule(1.2, () => console.log('show background')),
  new Capsule(3.2, () => console.log('show stars')),
])
```

### Sync with time interval

```js
let time = 0
setInterval(() => {
  group.invoke(time)
  time += 0.1
}, 100)
```

### Sync with music

```js
const { AudioPlayer } = require('timecapsule/util/audioplayer')

const audioSource = {
  name: 'bgm',
  buffer: arbitoraryArrayBuffer,
  oneTimeUpdate: group.invoke,
  onEnded: () => console.log('music ended'),
}
const player = new AudioPlayer()
player.addSource(audioSource).then(() => {
  player.play('bgm')
})
```
