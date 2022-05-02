class PopupEventHub {
  private closeEventHandlers: {[name: string]: () => void} = {}

  registerCloseEventHandler(popupName: string, handler: () => void) {
    if (this.closeEventHandlers[popupName]) {
      console.warn(`More than one close handler for popup '${popupName}'.`)
    }

    this.closeEventHandlers[popupName] = handler
  }

  reset() {
    this.closeEventHandlers = {}
  }

  triggerClose(popupName: string) {
    if (!this.closeEventHandlers.hasOwnProperty(popupName)) {
      throw new Error(`No close handler for popup '${popupName}'.`)
    }

    this.closeEventHandlers[popupName]()
  }

  triggerCloseAll() {
    for (const key in this.closeEventHandlers) {
      if (!this.closeEventHandlers.hasOwnProperty(key)) {
        continue
      }

      this.closeEventHandlers[key]()
    }
  }
}

export default new PopupEventHub()