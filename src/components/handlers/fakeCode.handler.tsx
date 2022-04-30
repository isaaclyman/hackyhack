import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import RenderText from "../renderText";
import fakeCodes from "../../data/fake-code.resource";
import Pseudorandom from "../../services/pseudorandom";
import QueueGroup from "../queueGroup";
import { useEffect, useState } from "react";
import { TextAnimation } from "../../types/text.animation";

const FakeCode: CommandHandler = function (props: CommandHandlerProps) {
  const rnd = new Pseudorandom(props.settings.seed)
  const fakeCode = fakeCodes[rnd.getRandomInt(fakeCodes.length)].split('\n')
  const numberOfLines = props.command.values.filter(val => typeof val === 'number')[0] as number
  const lines = fakeCode.slice(0, numberOfLines)

  const [hasCalledDone, setHasCalledDone] = useState(false)

  function lineDone(index: number) {
    if (hasCalledDone) {
      return
    }

    if (index >= numberOfLines - 1) {
      props.done()
      setHasCalledDone(true)
    }
  }

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

export default FakeCode
