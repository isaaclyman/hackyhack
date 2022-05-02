import './examples.scss'
import raw from 'raw.macro'
import { Link, Navigate } from 'react-router-dom'

interface ExampleLink {
  display: string
  name: string
  script: string
}

const ReadmeExample = raw('../examples/readme-example.kdl')
const RainbowText = raw('../examples/rainbow-text.kdl')

const examples: ExampleLink[] = [{
  display: 'README example',
  name: 'ReadmeExample',
  script: ReadmeExample
}, {
  display: 'Rainbow text',
  name: 'RainbowText',
  script: RainbowText
}]

export default function Example() {
  return (
    <div className="examples">
      {examples.map(example => 
        <Link to="/hack" key={example.display} state={{script: example.script, scriptName: example.name}}>
          {example.display}
        </Link>  
      )}
    </div>
  )
}