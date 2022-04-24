import { kdljs } from "kdljs";
import React, { useEffect, useState } from "react";
import { CommandHandler } from "../types/commandHandler";
import RenderText from "./renderText";

export interface RenderCommandProps {
  command: kdljs.Node
  onNext: () => any
}

const commandHandlers: {[commandName: string]: CommandHandler | null} = {
  'ANIMATE-SHAPE': null,
  'ANIMATE-TEXT': null,
  'CLEAR': null,
  'CLOSE': null,
  'FAKE-CODE': null,
  'GO-TO': null,
  'HERE-IS': null,
  'IF': null,
  'POPUP': null,
  'PROMPT': null,
  'PROGRESS': null,
  'SET-COLOR': null,
  'SET': null,
  'SLEEP': null,
  'USE-SHAPE': null,
  'USE': null,
  'USE-NOTHING': null,
  'TEXT': null
}

export default function RenderCommand(props: RenderCommandProps) {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!rendered && !commandHandlers[props.command.name]) {
      props.onNext()
    }
    
    setRendered(true)
  }, [])

  if (!commandHandlers[props.command.name]) {
    return <RenderText text={props.command.name + ' command not implemented yet.'} />
  }

  return React.createElement(commandHandlers[props.command.name]!, { done: props.onNext });
}