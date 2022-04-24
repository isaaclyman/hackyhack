import raw from 'raw.macro'
import RenderHack from './renderHack'

const ReadmeExample = raw('../examples/readme-example.kdl')

export default function Example() {
  return (
    <RenderHack scene={ReadmeExample} />
  )
}