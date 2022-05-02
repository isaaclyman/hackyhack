import { kdljs } from "kdljs";
import React, { useEffect, useRef, useState } from "react";
import { ContextSettings } from "../data/contextSettings.data";
import usePreRender from "../hooks/usePreRender";
import { CommandHandler } from "../types/commandHandler";
import { ErrorBoundary } from "./errorBoundary";
import AnimateShapeHandler from "./handlers/animateShape.handler";
import AnimateTextHandler from "./handlers/animateText.handler";
import ClearHandler from "./handlers/clear.handler";
import CloseAllHandler from "./handlers/closeAll.handler";
import CloseAllPopupsHandler from "./handlers/closeAllPopups.handler";
import CloseAllShapesHandler from "./handlers/closeAllShapes.handler";
import ClosePopupHandler from "./handlers/closePopup.handler";
import CloseShapeHandler from "./handlers/closeShape.handler";
import FakeCodeHandler from "./handlers/fakeCode.handler";
import GoToHandler from "./handlers/goTo.handler";
import HereIsHandler from "./handlers/hereIs.handler";
import IfHandler from "./handlers/if.handler";
import PopupHandler from "./handlers/popup.handler";
import ProgressHandler from "./handlers/progress.handler"
import PromptHandler from "./handlers/prompt.handler";
import ResetContextHandler from "./handlers/resetContext.handler";
import SetHandler from "./handlers/set.handler";
import SleepHandler from "./handlers/sleep.handler";
import TextHandler from "./handlers/text.handler";
import UseHandler from "./handlers/use.handler";
import UseShapeHandler from "./handlers/useShape.handler";
import DrawShapeHandler from "./handlers/_drawShape.handler";
import RenderText from "./renderText";

export interface RenderCommandProps {
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
  'CLEAR': ClearHandler,
  'CLOSE-ALL': CloseAllHandler,
  'CLOSE-ALL-POPUPS': CloseAllPopupsHandler,
  'CLOSE-ALL-SHAPES': CloseAllShapesHandler,
  'CLOSE-POPUP': ClosePopupHandler,
  'CLOSE-SHAPE': CloseShapeHandler,
  '#DRAW-SHAPE': DrawShapeHandler, // Special internal command, not available to users 
  'FAKE-CODE': FakeCodeHandler,
  'GO-TO': GoToHandler,
  'HERE-IS': HereIsHandler,
  'IF': IfHandler,
  'POPUP': PopupHandler,
  'PROMPT': PromptHandler,
  'PROGRESS': ProgressHandler,
  'RESET-CONTEXT': ResetContextHandler,
  'SET-COLOR': null,
  'SET': SetHandler,
  'SLEEP': SleepHandler,
  'USE-SHAPE': UseShapeHandler,
  'USE': UseHandler,
  'TEXT': TextHandler
})

export default function RenderCommand(props: React.PropsWithChildren<RenderCommandProps>) {
  const [rendered, setRendered] = useState(false)
  const hasSentDone = useRef(false)
  const commandName = props.command.name.toLowerCase()

  const [commandSettings] = useState(props.settings)

  function sendDone() {
    if (hasSentDone.current) {
      return
    }

    props.done()
    hasSentDone.current = true
  }

  usePreRender(() => {
    console.log(`RENDER COMMAND ${commandName}`)
  })

  useEffect(() => {
    if (!rendered && !commandHandlers[commandName]) {
      sendDone()
    }
    
    setRendered(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered, commandName, props.done])

  if (!commandHandlers[commandName]) {
    return <RenderText text={props.command.name + ' command not implemented yet.'} />
  }

  return (
    <ErrorBoundary
      errorNode={error =>
        <RenderText text={`Error in ${props.command.name} command: ${error.message}`} />
      }
    >
      {
        React.createElement(
          commandHandlers[commandName]!,
          { 
            changeContext: props.changeContext,
            clearContext: props.clearContext,
            command: props.command,
            createContext: props.createContext,
            createLocationMarker: props.createLocationMarker,
            done: sendDone,
            insertCommands: props.insertCommands,
            settings: commandSettings,
            setSettings: props.setSettings,
          },
          props.children
        )
      }
    </ErrorBoundary>
  )
}
