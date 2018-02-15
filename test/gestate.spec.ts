import { Gestate } from "../src/gestate";
import {expect} from 'chai';
import * as sinon from 'sinon';


describe('gestate', () => {
    // simple unit test
    it('can clear', function() {
      let gest = new Gestate({debug: true})
      gest.clearAll()
      expect(gest.getGestures().length).to.equal(0)
      gest.destroy()
    })

})

function delayms(ms: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve()
    }, ms)
  })
}
