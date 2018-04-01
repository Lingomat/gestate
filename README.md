# Gestate

A raw gesture recording and playback library. It's primarily used in the Image-Gesture-Voice activity to record gestures on image slides.

### project features
 - Mirrors a given HTML element with a canvas overlay that captures mouse and touch events and ...
 - ... renders particle effects when recording and playing
 - Simple data structure of recorded gestures

## developer documentation
how to build and test:
 - clone the repository
 - in the cloned folder, run `npm install`
 - run `npm test` to build and test the code in both nodejs and browser

how to debug (browser):
 - run `npm start` to run a development server
 - open `http://localhost:8080/webtest.bundle` to run live tests that will update while you change the source code

Based on https://github.com/wix/typescript-boilerplate

## API example

```
import { Gestate, Gesture } from '@aikuma/gestate'
let gestures: Gesture[] = []
const gest = new Gestate({debug: true})
let ele = document.getElementById('image')
gest.record(ele, 'attention', 0)
gest.stopRecording()
gestures = gest.getGestures()
gest.clear()
```

## Constructor

`const gest = new Gestate(config)`

Optional config currently only has one property, debug, which if set to true will 


## methods

`init()`

Creates a canvas element with event listeners and attaches it to the body.

`destroy()`

Removes the canvas element.

`record(element: HTMLElement, type: string, time: number)`

Begin a recording session. `element` is a HTML element that will be used to obtain position information. The canvas will be resized and repositioned to fit this element. Typically the element would be an img tag, or a div with an image background.

The `type` arg is a string that describes what kind of recording this is. This is an arbitrary string that preserved in the data structure coming from `getGestures()`

The `time` arg is a number typically obtained from Date(). It's intended to represent a time offset. It can be optional and set to zero if desired.
 
`stopRecord()`

Stops recording. Any current gesture is finalised.

`clearAll()`

Clears all of the currently recorded gestures.

`loadGestures(gestures: Gesture[])`

Takes an array of `Gesture` objects. Typically this would be to play back previously recorded gestures.

`playGestures(element: HTMLElement, time: number)`

Begins playback of gestures from the given time point. 

`resize(element: HTMLElement)`

Immediately resize and reposition the canvas to `element`.

`stopPlay()`

Stops playback of gestures.

`getGestures()`

Returns an array of `Gesture` objects.

## Gesture data structure

```
interface Gesture {
  timeOffset: number
  type?: string
  timeLine: {x: number, y: number, t: number}[]
}
```

A Gesture object has a timeOffset property representing the relative time of the gesture since the beginning of gesture recording. The type property is an arbitrary string describing the type of gesture. The timeLine is an array of objects with x and y numbers representing the current coordinates of the touch interaction. 

Note that x and y coordinates range from values 0 to 1. The t number is a relative time offset in Milliseconds from the Gesture timeOffset value.

## To do

1. Add some settings for particle effects.
2. Implement tests.
