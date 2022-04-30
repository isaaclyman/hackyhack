import Pseudorandom from "../services/pseudorandom"
import fakeCodes from "./fake-code.resource"

class FakeCodeManager {
  private isInitialized = false
  private fakeCodeIndex: number = -1

  initialize(seed: string) {
    if (this.isInitialized) {
      return
    }

    this.isInitialized = true
    Pseudorandom.initialize(seed)
    this.fakeCodeIndex = Pseudorandom.getRandomInt(fakeCodes.length)
  }

  getFakeCode(): string {
    if (!this.isInitialized) {
      throw new Error('FakeCodeManager is not initialized. Cannot getFakeCode.')
    }

    this.fakeCodeIndex++
    return fakeCodes[this.fakeCodeIndex % fakeCodes.length]
  }
}

export default new FakeCodeManager()