import { useEffect, useRef, useState } from 'react'
import VariableManager from '../data/variable.manager'
import { TextAnimation } from '../types/text.animation'

export interface RenderTextProps {
  animation: TextAnimation
  delay: number
  done: () => void
  style: React.CSSProperties
  text: string
}

export default function RenderText(props: RenderTextProps) {
  const [fullText, setFullText] = useState(VariableManager.interpolate(props.text))
  const [typingIndex, setTypingIndex] = useState(0);
  const el = useRef(null as HTMLDivElement | null)

  useEffect(() => {
    setFullText(VariableManager.interpolate(props.text))
    setTypingIndex(0);
    
    if (el.current) {
      el.current.scrollIntoView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.text])

  useEffect(() => {
    if (typingIndex > fullText.length || props.animation !== TextAnimation.TYPE) {
      props.done()
      return
    }

    const timeout = setTimeout(() => {
      setTypingIndex(typingIndex + 1)
    }, props.delay)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingIndex, fullText, props.delay, props.animation])

  return (
    <div style={{whiteSpace: 'pre', ...props.style}} ref={el}>
      {props.animation === TextAnimation.TYPE ?
        (fullText.slice(0, typingIndex) || ' ') :
        fullText
      }
    </div>
  )
}

RenderText.defaultProps = {
  animation: TextAnimation.NONE,
  delay: 15,
  done: () => {},
  style: {}
}
