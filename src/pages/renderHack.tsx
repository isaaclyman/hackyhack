import { parse } from 'kdljs'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import RenderScene from '../components/renderScene'
import RenderText from '../components/renderText'

export interface RenderHackLocationState {
  script: string
}

export default function RenderHack() {
  const {state} = useLocation() as {state: RenderHackLocationState}

  const parsed = parse(state.script)

  return parsed.errors && parsed.errors.length ?
    <>
      <RenderText text="Found formatting errors in your scene file:" />
      {JSON.stringify(parsed.errors)}
    </>
  : !parsed.output || !parsed.output.length ? <RenderText text="Scene file is empty." />
  : <RenderScene
      commands={parsed.output}
    />
}
