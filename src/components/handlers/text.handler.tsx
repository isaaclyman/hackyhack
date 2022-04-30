import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import RenderText from "../renderText";
import QueueGroup from "../queueGroup";
import { useState } from "react";
import usePreRender from "../../hooks/usePreRender";

const TextHandler: CommandHandler = function (props: CommandHandlerProps) {
  const [lines, setLines] = useState([] as string[])
  const [hasCalledDone, setHasCalledDone] = useState(false)

  function lineDone(index: number) {
    if (hasCalledDone) {
      return
    }

    if (index >= lines.length - 1) {
      props.done()
      setHasCalledDone(true)
    }
  }

  usePreRender(() => {
    const textValue = props.command.values.filter(val => typeof val === 'string')[0] as string
    setLines(textValue.split('\n'))
  })

  return <QueueGroup defaultDelay={props.settings.textLineAnimationDelay || undefined}>
    {lines.map((line, index) =>
      <RenderText
        animation={props.settings.textAnimation}
        delay={props.settings.textTypeAnimationDelay}
        done={() => lineDone(index)}
        key={index}
        text={line}
      />
    )}
  </QueueGroup>
}

export default TextHandler
