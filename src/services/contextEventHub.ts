import { kdljs } from "kdljs"

export type ContextCloseHandler = () => void
export type ContextRevertHandler = () => void
export type ContextSwitchHandler = (remainingCommands: kdljs.Node[]) => void
export const TopContextName = '$__top'

class ContextEventHub {
  private closeHandlers: {[contextName: string]: ContextCloseHandler} = {}
  private revertHandlers: {[contextName: string]: ContextRevertHandler} = {}
  private switchHandlers: {[contextName: string]: ContextSwitchHandler} = {}
  private currentContextName: string = TopContextName
  private previousContextName: string = TopContextName

  closeContext(contextName: string) {
    if (!this.closeHandlers[contextName]) {
      throw new Error(`No close handler has been registered for context '${contextName}.'`)
    }

    this.closeHandlers[contextName]()

    if (contextName === this.currentContextName) {
      this.revertToPreviousContext()
    }
  }

  registerContextCloseHandler(contextName: string, handler: ContextCloseHandler) {
    if (this.closeHandlers[contextName]) {
      console.warn(`More than one close handler registered for context '${contextName}'.`)
    }

    this.closeHandlers[contextName] = handler
  }

  registerContextRevertHandler(contextName: string, handler: ContextRevertHandler): void {
    if (this.revertHandlers[contextName]) {
      console.warn(`More than one revert handler registered for context '${contextName}'.`)
    }

    this.revertHandlers[contextName] = handler
  }

  registerContextSwitchHandler(contextName: string, handler: ContextSwitchHandler): void {
    if (this.switchHandlers[contextName]) {
      console.warn(`More than one switch handler registered for context '${contextName}'.`)
    }

    this.switchHandlers[contextName] = handler
  }

  reset() {
    this.closeHandlers = {}
    this.switchHandlers = {}
  }

  revertToPreviousContext() {
    if (!this.revertHandlers[this.previousContextName]) {
      throw new Error(`No revert handler has been registered for context '${this.previousContextName}'.`)
    }

    console.log(`Reverting from ${this.currentContextName} to ${this.previousContextName}`)
    this.revertHandlers[this.previousContextName]()
  }

  switchContext(contextName: string, remainingCommands: kdljs.Node[]) {
    if (!this.switchHandlers[contextName]) {
      throw new Error(`No switch handler has been registered for context '${contextName}'.`)
    }

    this.previousContextName = this.currentContextName
    this.currentContextName = contextName

    this.switchHandlers[contextName](remainingCommands)
  }

  validateNewContext(contextName: string) {
    if (this.switchHandlers[contextName]) {
      throw new Error(`Validation failed. Context '${contextName}' already exists.`)
    }
  }
}

export default new ContextEventHub()