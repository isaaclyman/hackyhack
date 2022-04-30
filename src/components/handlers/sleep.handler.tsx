import { useEffect, useState } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import RenderText from "../renderText";
import { TextAnimation } from "../../types/text.animation";

const SleepHandler: CommandHandler = function (props: CommandHandlerProps) {
  const timeout = props.command.values.filter(val => typeof val === 'number')[0] as number
  const [isBlinkOn, setIsBlinkOn] = useState(true)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsDone(true)
      props.done()
    }, timeout)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isDone) {
      return
    }

    setTimeout(() => {
      setIsBlinkOn(!isBlinkOn)
    }, 400)
  }, [isBlinkOn, isDone])

  if (!props.settings.isTextContainer) {
    return null
  }

  return <RenderText
    animation={TextAnimation.NONE}
    delay={0}
    style={{fontWeight: 'bold'}}
    text={!isDone && isBlinkOn ? '_' : ' '}
  />
}

export default SleepHandler
