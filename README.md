# Gestate

Gestate is a library for visualising, capturing and playing back touch gestures primarily in support of knowledge performance, i.e. audiovisual presentations.
The 'firework' visualisation is intended to be a more useful form of 'pointer' by integrating persistence and emphasizing motion by utilising particle effects that respond to the kinetics of touch input.
Gestate is used in the more general [Image-Gesture-Voice](http://www.icsi.berkeley.edu/icsi/node/6052) documentary method based on capturing talk and gesture about a series of images.

### project features
 - JavaScript module suitable for integrating with any web app
 - Implements the firework pointer touch visualisation
 - Captures touch (and mouse) events
 - Plays captured events with the firework visualisation
 - Visualisation is computationally inexpensive and suitable for mobile devices.

### How it works?

Gestate inserts a new HTML canvas element onto the page. 
The size and position of the normatively transparent canvas is altered to overlay another HTML element such as an image.
Mouse and touch events are registered on the canvas elements.
Particle effects are displayed on mouse/touch input in visualisation mode or when recording and playing back gestures.
The visualisation is decoupled from (high frequency) input events, using requestAnimationFrame.
Where the framerate is less than 60Hz, interpolation is used to avoid large gaps.

## API example

Simple visualisation:

```
import { Gestate } from '@aikuma/gestate'
const gest = new Gestate({debug: true})
const ele = document.getElementById('image')
gest.visualise(ele)
```

To record gestures:

```
import { Gestate, Gesture } from '@aikuma/gestate'
let gestures: Gesture[] = []
const gest = new Gestate({debug: true})
const ele = document.getElementById('image')
gest.record(ele, 'attention', 0)
gest.stopRecording()
gestures = gest.getGestures()
gest.clear()
```

## Constructor

`const gest = new Gestate(config)`

Optional config has three properties:

* debug: boolean --- print debug information
* colors: string[] --- array of RGB colours to use for visualisation in format \#rrggbb.
* element: HTMLElement to append canvas to. Defaults to document body.
* tapthresh: number --- time (ms) threadhold for tap duration detection, default 110.

On constructing Gestate will create a new canvas and attach mouse and touch pointer events.

## methods

`visualise()`

Begin touch visualisation without recording gestures.

`stopVisualise()`

Stop visualisation.

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

`destroy()`

Removes the canvas element.

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

## Compiling source

This is a Typescript project so just `npm i` to install the dependencies and then `tsc -d` to compile. Plain JavaScript is now in the `dist` folder, i.e. import { Gestate } from 'path/gestate/dist'.

## To do

1. Expose particle movement settings to allow tweaking the effect.

## Changes

0.4.0 removed testing framework since I wasn't using it anyway.
0.4.2 add config option of .element for the html element the canvas will be appended to.
0.6.0 many bugs fixed, visualisation mode (without recording) added
0.7.0 tap visualisation
