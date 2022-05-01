import { kdljs } from 'kdljs'
import { useEffect, useState } from 'react'
import { ContextSettings } from '../data/contextSettings.data'
import RenderCommand from './renderCommand'
import ContextEventHub, { TopContextName } from '../services/contextEventHub'
import RenderSceneParent, { ContextGrouping } from './renderSceneParent'

export interface RenderSceneProps {
  commands: kdljs.Node[]
  contextName?: string
  setSettings: (settings: ContextSettings) => void
  settings?: ContextSettings
}

const topLevelContextName = TopContextName

export default function RenderScene(props: RenderSceneProps) {
  const selfContextName = props.contextName || topLevelContextName
  const [contexts, setContexts] = useState([] as ContextGrouping[])

  const [settings, setSettings] = useState(new ContextSettings(props.settings ? {
    ...props.settings,
    isTextContainer: true
  } : undefined))

  const [remainingCommands, setRemainingCommands] = useState(props.commands)
  const [commandIndex, setCommandIndex] = useState(0)
  const [renderedCommands, setRenderedCommands] = useState([] as kdljs.Node[])

  function changeContext(contextName: string): void {
    ContextEventHub.switchContext(contextName, remainingCommands.slice(commandIndex + 1))
  }

  function createNewContext(contextName: string, parentNode: kdljs.Node): void {
    ContextEventHub.validateNewContext(contextName)

    setContexts(contexts => {
      const context: ContextGrouping = {
        commands: remainingCommands.slice(commandIndex + 1),
        name: contextName,
        parentNode
      }
  
      const newContexts = contexts.concat(context)
      return newContexts
    })

    ContextEventHub.registerContextCloseHandler(contextName, () => {
      setContexts(contexts => {
        const newContexts = contexts.slice()
        const indexToRemove = newContexts.findIndex(cx => cx.name === contextName)
        if (indexToRemove < 0) {
          return contexts
        }
        console.log('Removing context', contextName)
        newContexts.splice(indexToRemove, 1)
        return newContexts
      })
    })

    console.log('Create context', contextName)
  }

  function insertCommands(commands: kdljs.Node[]) {
    setRemainingCommands(remainingCommands => {
      const newRemainingCommands = remainingCommands.slice()
      newRemainingCommands.splice(commandIndex + 1, 0, ...commands)
      return newRemainingCommands
    })
  }

  function processNext() {
    setCommandIndex(commandIndex + 1)
  }

  function setAndPropagateSettings(settings: ContextSettings): void {
    setSettings(settings)
    props.setSettings(settings)
  }

  useEffect(() => {
    console.log(selfContextName, 'has commands', remainingCommands)

    ContextEventHub.registerContextSwitchHandler(selfContextName, remainingCommands => {
      console.log(selfContextName, 'received context')
      setRemainingCommands(remainingCommands)
      setCommandIndex(0)
    })

    ContextEventHub.registerContextRevertHandler(selfContextName, () => {
      console.log(selfContextName, 'received context automatically because current context was closed')
      processNext()
    })

    if (selfContextName === topLevelContextName) {
      ContextEventHub.registerContextCloseHandler(topLevelContextName, () => {
        setRenderedCommands([])
        setContexts([])
      })
    }

    ContextEventHub.switchContext(selfContextName, remainingCommands)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const next = remainingCommands[commandIndex]
    if (!next || renderedCommands.includes(next)) {
      return
    }

    setRenderedCommands(renderedCommands.concat(next))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandIndex, remainingCommands])

  return (
    <>
      {renderedCommands.map((command, index) =>
        <RenderCommand
          changeContext={changeContext}
          command={command}
          createContext={createNewContext}
          done={processNext}
          insertCommands={insertCommands}
          key={index}
          setSettings={setAndPropagateSettings}
          settings={settings}
        />
      )}
      {contexts.map(context =>
        <RenderSceneParent
          changeContext={changeContext}
          context={context}
          createNewContext={createNewContext}
          insertCommands={insertCommands}
          key={context.name}
          setSettings={setAndPropagateSettings}
          settings={settings}
        >
          <RenderScene
            commands={context.commands}
            contextName={context.name}
            setSettings={setAndPropagateSettings}
            settings={settings}
          />
        </RenderSceneParent>
      )}
    </>
  )
}

RenderScene.defaultProps = {
  setSettings: () => { }
}
