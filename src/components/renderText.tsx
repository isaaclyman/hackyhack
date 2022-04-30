import { useEffect, useState } from 'react'
import { TextAnimation } from '../types/text.animation'

export interface RenderTextProps {
  animation: TextAnimation
  delay: number
  done: () => void
  text: string
}

export default function RenderText(props: RenderTextProps) {
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    setTypingIndex(0);
  }, [props.text])

  useEffect(() => {
    if (typingIndex >= props.text.length || props.animation !== TextAnimation.TYPE) {
      props.done()
      return
    }

    const timeout = setTimeout(() => {
      setTypingIndex(typingIndex + 1)
    }, props.delay)

    return () => clearTimeout(timeout)
  }, [typingIndex, props.text, props.delay, props.animation])

  return (
    <div style={{whiteSpace: 'pre-wrap'}}>
      {props.animation === TextAnimation.TYPE ?
        props.text.slice(0, typingIndex) :
        props.text
      }
    </div>
  )
}

RenderText.defaultProps = {
  animation: TextAnimation.NONE,
  delay: 15,
  done: () => {}
}
