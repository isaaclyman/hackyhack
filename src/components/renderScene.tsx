import { kdljs } from 'kdljs'
import { useEffect, useState } from 'react'
import { ContextSettings } from '../data/contextSettings.data'
import RenderCommand from './renderCommand'
import contextEventHub from '../services/contextEventHub'

export interface RenderSceneProps {
  commands: kdljs.Node[]
  contextName?: string
  setSettings: (settings: ContextSettings) => void
  settings?: ContextSettings
}

interface ContextGrouping {
  commands: kdljs.Node[]
  name: string
  parentNode: kdljs.Node
}

const topLevelContextName = '$__top'

export default function RenderScene(props: RenderSceneProps) {
  const topContextName = props.contextName || topLevelContextName
  const [contexts, setContexts] = useState([] as ContextGrouping[])

  const [settings, setSettings] = useState(new ContextSettings(props.settings || undefined))

  const [remainingCommands, setRemainingCommands] = useState(props.commands)
  const [commandIndex, setCommandIndex] = useState(0)
  const [renderedCommands, setRenderedCommands] = useState([] as kdljs.Node[])

  function changeContext(contextName: string): void {
    contextEventHub.switchContext(contextName, remainingCommands.slice(commandIndex + 1))
  }

  function createNewContext(contextName: string, parentNode: kdljs.Node): void {
    contextEventHub.validateNewContext(contextName)

    const context: ContextGrouping = {
      commands: remainingCommands.slice(commandIndex + 1),
      name: contextName,
      parentNode
    }

    const newContexts = contexts.concat(context)
    setContexts(newContexts)
  }

  function processNext() {
    const next = remainingCommands[commandIndex]


    setRenderedCommands(renderedCommands.concat(next))
    setCommandIndex(commandIndex + 1)
  }

  function setAndPropagateSettings(settings: ContextSettings): void {
    setSettings(settings)
    props.setSettings(settings)
  }

  useEffect(() => {
    contextEventHub.registerContextEventHandler(topContextName, remainingCommands => {
      setRemainingCommands(remainingCommands)
      setCommandIndex(0)
      processNext()
    })

    processNext()
  }, [])

  return (
    <>
      {renderedCommands.map((command, index) =>
        <RenderCommand
          changeContext={changeContext}
          command={command}
          createContext={createNewContext}
          done={processNext}
          key={index}
          setSettings={setAndPropagateSettings}
          settings={settings}
        />
      )}
      {contexts.map(context => {
        <RenderCommand
          changeContext={changeContext}
          command={context.parentNode}
          createContext={createNewContext}
          done={() => {}}
          key={`${context.name}__parent`}
          setSettings={setAndPropagateSettings}
          settings={settings}
        >
          <RenderScene
            commands={context.commands}
            contextName={context.name}
            setSettings={setAndPropagateSettings}
            settings={settings}
          />
        </RenderCommand>
      })}
    </>
  )
}

RenderScene.defaultProps = {
  setSettings: () => {}
}
