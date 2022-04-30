import { kdljs } from "kdljs";
import React, { useEffect, useState } from "react";
import { ContextSettings } from "../data/contextSettings.data";
import usePreRender from "../hooks/usePreRender";
import { CommandHandler } from "../types/commandHandler";
import AnimateShape from "./handlers/animateShape.handler";
import AnimateText from "./handlers/animateText.handler";
import FakeCode from "./handlers/fakeCode.handler";
import ResetContext from "./handlers/resetContext.handler";
import Use from "./handlers/use.handler";
import UseShape from "./handlers/useShape.handler";
import DrawShape from "./handlers/_drawShape.handler";
import RenderText from "./renderText";

export interface RenderCommandProps {
  changeContext: (contextName: string) => void
  command: kdljs.Node
  createContext: (contextName: string, parentNode: kdljs.Node) => void
  done: () => any
  setSettings: (settings: ContextSettings) => void
  settings: ContextSettings
}

type GenericObject<T> = {[key: string]: T}
const lowercaseKeys = function<T>(obj: GenericObject<T>): GenericObject<T> {
  const newObj = {} as GenericObject<T>
  for (const key in obj) {
    newObj[key.toLowerCase()] = obj[key]
  }
  return newObj
}

const commandHandlers: {[commandName: string]: CommandHandler | null} = lowercaseKeys({
  'ANIMATE-SHAPE': AnimateShape,
  'ANIMATE-TEXT': AnimateText,
  'CLEAR': null,
  'CLOSE': null,
  '#DRAW-SHAPE': DrawShape, // Special internal command, not available to users 
  'FAKE-CODE': FakeCode,
  'GO-TO': null,
  'HERE-IS': null,
  'IF': null,
  'POPUP': null,
  'PROMPT': null,
  'PROGRESS': null,
  'RESET-CONTEXT': ResetContext,
  'SET-COLOR': null,
  'SET': null,
  'SLEEP': null,
  'USE-SHAPE': UseShape,
  'USE': Use,
  'TEXT': null
})

export default function RenderCommand(props: React.PropsWithChildren<RenderCommandProps>) {
  const [rendered, setRendered] = useState(false)
  const commandName = props.command.name.toLowerCase()

  const [commandSettings] = useState(props.settings)

  usePreRender(() => {
    console.log(`RENDER COMMAND ${commandName}`)
  })

  useEffect(() => {
    if (!rendered && !commandHandlers[commandName]) {
      props.done()
    }
    
    setRendered(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered, commandName, props.done])

  if (!commandHandlers[commandName]) {
    return <RenderText text={props.command.name + ' command not implemented yet.'} />
  }

  return React.createElement(
    commandHandlers[commandName]!,
    { 
      changeContext: props.changeContext,
      command: props.command,
      createContext: props.createContext,
      done: props.done,
      settings: commandSettings,
      setSettings: props.setSettings,
    },
    props.children
  );
}
