import { kdljs } from "kdljs"
import { ContextSettings } from "../data/contextSettings.data"

export interface CommandHandlerProps {
  changeContext: (contextName: string) => void
  clearContext: () => void
  command: kdljs.Node
  createContext: (contextName: string, parentNode: kdljs.Node) => void
  createLocationMarker: (name: string) => void
  done: () => any
  insertCommands: (commands: kdljs.Node[]) => void
  setSettings: (settings: ContextSettings) => void
  settings: ContextSettings
}

export type CommandHandler = (props: CommandHandlerProps) => any
