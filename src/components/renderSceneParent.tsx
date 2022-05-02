import { kdljs } from "kdljs";
import React, { useState } from "react";
import { ContextSettings } from "../data/contextSettings.data";
import RenderCommand from "./renderCommand";

export interface ContextGrouping {
  commands: kdljs.Node[]
  name: string
  parentNode: kdljs.Node
}

export interface RenderSceneParentProps {
  changeContext: (contextName: string) => void
  clearContext: () => void
  context: ContextGrouping
  createLocationMarker: (name: string) => void
  createNewContext: (contextName: string, parentNode: kdljs.Node) => void
  insertCommands: (commands: kdljs.Node[]) => void
  setSettings: (settings: ContextSettings) => void
  settings: ContextSettings
}

export default function RenderSceneParent(props: React.PropsWithChildren<RenderSceneParentProps>) {
  const [isDone, setIsDone] = useState(false)

  return <RenderCommand
    changeContext={props.changeContext}
    clearContext={props.clearContext}
    command={props.context.parentNode}
    createContext={props.createNewContext}
    createLocationMarker={props.createLocationMarker}
    done={() => setIsDone(true)}
    insertCommands={props.insertCommands}
    key={`${props.context.name}__parent`}
    setSettings={props.setSettings}
    settings={props.settings}
    uniqueKey={props.context.name}
  >
    {isDone ? props.children : null}
  </RenderCommand>
}
