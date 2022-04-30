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
  context: ContextGrouping
  createNewContext: (contextName: string, parentNode: kdljs.Node) => void
  setSettings: (settings: ContextSettings) => void
  settings: ContextSettings
}

export default function RenderSceneParent(props: React.PropsWithChildren<RenderSceneParentProps>) {
  const [isDone, setIsDone] = useState(false)

  return <RenderCommand
    changeContext={props.changeContext}
    command={props.context.parentNode}
    createContext={props.createNewContext}
    done={() => setIsDone(true)}
    key={`${props.context.name}__parent`}
    setSettings={props.setSettings}
    settings={props.settings}
  >
    {isDone ? props.children : null}
  </RenderCommand>
}
