# Gestate

A raw gesture recording and playback library. It's primarily used in the IGV activity to record gestures on image slides.

### project features
 - Mirrors a given element with an overlay that captures mouse and touch events
 - Renders particle effects when recording and playing
 - Simple data structure of recorded gestures.

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
import { Gestate } from 'gestate'
const gest = new Gestate()
gest.record(MyElement, 'gesture type', offsetTime)
gest.stopRecording()
gest.getGestures()
gest.clear()
```

