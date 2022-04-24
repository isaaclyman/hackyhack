import { parse } from 'kdljs'
import RenderScene from '../components/renderScene'
import RenderText from '../components/renderText'

export interface RenderHackProps {
  scene: string
}

export default function RenderHack(props: RenderHackProps) {
  const parsed = parse(props.scene)

  return parsed.errors && parsed.errors.length ?
    <>
      <RenderText text="Found formatting errors in your scene file:" />
      {JSON.stringify(parsed.errors)}
    </>
  : !parsed.output || !parsed.output.length ? <RenderText text="Scene file is empty." />
  : <RenderScene commands={parsed.output}></RenderScene>
}
