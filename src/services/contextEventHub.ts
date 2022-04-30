import { kdljs } from "kdljs"

export type ContextSwitchHandler = (remainingCommands: kdljs.Node[]) => void

class ContextEventHub {
  private switchHandlers: {[contextName: string]: ContextSwitchHandler} = {}

  registerContextEventHandler(contextName: string, handler: ContextSwitchHandler): void {
    if (this.switchHandlers[contextName]) {
      console.warn(`More than one event handler registered for context '${contextName}'.`)
    }

    this.switchHandlers[contextName] = handler
  }

  reset() {
    this.switchHandlers = {}
  }

  switchContext(contextName: string, remainingCommands: kdljs.Node[]) {
    if (!this.switchHandlers[contextName]) {
      throw new Error(`No handler has been registered for context '${contextName}'.`)
    }

    this.switchHandlers[contextName](remainingCommands)
  }

  validateNewContext(contextName: string) {
    if (this.switchHandlers[contextName]) {
      throw new Error(`Validation failed. Context '${contextName}' already exists.`)
    }
  }
}

export default new ContextEventHub()