import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import RenderText from "../renderText";
import QueueGroup from "../queueGroup";
import { useState } from "react";
import usePreRender from "../../hooks/usePreRender";
import FakeCodeManager from "../../data/fake-code.manager";

const FakeCodeHandler: CommandHandler = function (props: CommandHandlerProps) {
  const [lines, setLines] = useState([] as string[])

  usePreRender(() => {
    FakeCodeManager.initialize(props.settings.seed)
    const fakeCode = FakeCodeManager.getFakeCode().split('\n')
    const numberOfLines = props.command.values.filter(val => typeof val === 'number')[0] as number
    const newLines = fakeCode.slice(0, numberOfLines)
    setLines(newLines)
  })

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

  return <QueueGroup defaultDelay={props.settings.textLineAnimationDelay || undefined}>
    {lines.map((line, index) =>
      <RenderText
        animation={props.settings.textAnimation}
        className={props.className}
        delay={props.settings.textTypeAnimationDelay}
        done={() => lineDone(index)}
        key={index}
        text={line}
      />
    )}

  </QueueGroup>

}

export default FakeCodeHandler
