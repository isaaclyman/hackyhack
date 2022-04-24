import { kdljs } from 'kdljs'
import { useState } from 'react'
import RenderCommand from './renderCommand'

export interface RenderSceneProps {
  commands: kdljs.Node[]
}

export default function RenderScene(props: RenderSceneProps) {
  const [commandIndex, setCommandIndex] = useState(1)

  function processNext() {
    setCommandIndex(commandIndex + 1)
  }

  return (
    <>
      {props.commands.slice(0, commandIndex).map((command, index) =>
        <RenderCommand command={command} onNext={processNext} key={index} />
      )}
    </>
  )
}