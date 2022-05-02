class LocationEventHub {
  private locationSeekHandlers: {[name: string]: () => void} = {}

  registerLocationSeekHandler(name: string, handler: () => void) {
    if (this.locationSeekHandlers[name]) {
      console.warn(`More than one seek handler for location '${name}'.`)
    }

    this.locationSeekHandlers[name] = handler
  }

  reset() {
    this.locationSeekHandlers = {}
  }

  seekLocation(name: string) {
    if (!this.locationSeekHandlers.hasOwnProperty(name)) {
      throw new Error(`No seek handler for location '${name}'.`)
    }

    this.locationSeekHandlers[name]()
  }
}

export default new LocationEventHub()
