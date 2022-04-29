import raw from 'raw.macro'
import { Navigate } from 'react-router-dom'

const ReadmeExample = raw('../examples/readme-example.kdl')

export default function Example() {
  return (
    <Navigate to="/hack" state={{script: ReadmeExample}} />
  )
}