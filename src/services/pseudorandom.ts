// https://stackoverflow.com/a/47593316/4347245
/* eslint-disable */

// MurmurHash3's mixing function
// @ts-ignore
function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  } return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

// Simple Fast Counter from http://pracrand.sourceforge.net/
// @ts-ignore
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

class Pseudorandom {
  private isInitialized = false
  private seedGenerator: () => number = () => 0
  private rnd: () => number = () => 0

  initialize(seedString: string) {
    if (!this.isInitialized) {
      this.isInitialized = true
      this.seedGenerator = xmur3(seedString)
      this.rnd = sfc32(this.seedGenerator(), this.seedGenerator(), this.seedGenerator(), this.seedGenerator())
    }
  }

  getRandom() {
    if (!this.isInitialized) {
      throw new Error(`Pseudorandom is not initialized. Can't getRandom.`)
    }

    return this.rnd()
  }

  getRandomInt(max: number, min: number = 0) {
    const range = max - min
    return Math.floor(this.getRandom() * range) + min
  }
}

export default new Pseudorandom()

/* eslint-enable */