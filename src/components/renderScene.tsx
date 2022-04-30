import { kdljs } from 'kdljs'
import { useEffect, useState } from 'react'
import { ContextSettings } from '../data/contextSettings.data'
import RenderCommand from './renderCommand'
import contextEventHub, { TopContextName } from '../services/contextEventHub'

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

const topLevelContextName = TopContextName

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
    console.log('Create context', context, newContexts)
  }

  function processNext() {
    setCommandIndex(commandIndex + 1)
  }

  function setAndPropagateSettings(settings: ContextSettings): void {
    setSettings(settings)
    props.setSettings(settings)
  }

  useEffect(() => {
    console.log(topContextName, 'has commands', remainingCommands)

    contextEventHub.registerContextEventHandler(topContextName, remainingCommands => {
      console.log(topContextName, 'received context')
      setRemainingCommands(remainingCommands)
      setCommandIndex(0)
    })

    contextEventHub.switchContext(topContextName, remainingCommands)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const next = remainingCommands[commandIndex]
    if (!next || renderedCommands.includes(next)) {
      return
    }

    setRenderedCommands(renderedCommands.concat(next))
  }, [commandIndex, remainingCommands])

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
      {contexts.map(context =>
        <RenderCommand
          changeContext={changeContext}
          command={context.parentNode}
          createContext={createNewContext}
          done={() => { }}
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
      )}
    </>
  )
}

RenderScene.defaultProps = {
  setSettings: () => { }
}
