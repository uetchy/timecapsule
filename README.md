# TimecapsuleJS

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

then

```js
let time = 0
setInterval(() => {
  group.invoke(time)
  time += 0.1
}, 100)
```
