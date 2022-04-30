import { kdljs } from "kdljs";
import React, { useEffect, useState } from "react";
import { ContextSettings } from "../data/contextSettings.data";
import usePreRender from "../hooks/usePreRender";
import { CommandHandler } from "../types/commandHandler";
import AnimateShapeHandler from "./handlers/animateShape.handler";
import AnimateTextHandler from "./handlers/animateText.handler";
import FakeCodeHandler from "./handlers/fakeCode.handler";
import ResetContextHandler from "./handlers/resetContext.handler";
import SleepHandler from "./handlers/sleep.handler";
import UseHandler from "./handlers/use.handler";
import UseShapeHandler from "./handlers/useShape.handler";
import DrawShapeHandler from "./handlers/_drawShape.handler";
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
  'ANIMATE-SHAPE': AnimateShapeHandler,
  'ANIMATE-TEXT': AnimateTextHandler,
  'CLEAR': null,
  'CLOSE': null,
  '#DRAW-SHAPE': DrawShapeHandler, // Special internal command, not available to users 
  'FAKE-CODE': FakeCodeHandler,
  'GO-TO': null,
  'HERE-IS': null,
  'IF': null,
  'POPUP': null,
  'PROMPT': null,
  'PROGRESS': null,
  'RESET-CONTEXT': ResetContextHandler,
  'SET-COLOR': null,
  'SET': null,
  'SLEEP': SleepHandler,
  'USE-SHAPE': UseShapeHandler,
  'USE': UseHandler,
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
