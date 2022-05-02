import { parse } from 'kdljs'
import { useLocation } from 'react-router-dom'
import RenderScene from '../components/renderScene'
import RenderText from '../components/renderText'
import { ContextSettings } from '../data/contextSettings.data'
import usePreRender from '../hooks/usePreRender'
import contextEventHub from '../services/contextEventHub'
import locationEventHub from '../services/locationEventHub'
import popupEventHub from '../services/popupEventHub'
import { TextAnimation } from '../types/text.animation'

export interface RenderHackLocationState {
  scriptName: string
  script: string
}

export default function RenderHack() {
  const {state} = useLocation() as {state: RenderHackLocationState}

  usePreRender(() => {
    contextEventHub.reset()
    popupEventHub.reset()
    locationEventHub.reset()
  })

  const settings = new ContextSettings()
  settings.seed = state.scriptName || 'scriptname'

  const parsed = parse(state.script)
  return parsed.errors && parsed.errors.length ?
    <>
      <RenderText text="Found formatting errors in your scene file:" />
      {JSON.stringify(parsed.errors)}
    </>
  : !parsed.output || !parsed.output.length ? <RenderText text="Scene file is empty." />
  : <RenderScene
      commands={parsed.output}
      settings={settings}
    />
}
