import { useEffect, useState } from "react";
import usePreRender from "../../hooks/usePreRender";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import { TextAnimation } from "../../types/text.animation";
import RenderText from "../renderText";

const SpecialChars = {
  Complete: '█',
  Partial: '▒',
  Empty: '░'
}

const ProgressHandler: CommandHandler = function(props: CommandHandlerProps) {
  const [max, setMax] = useState(100)
  const [timeToMax, setTimeToMax] = useState(5000)
  const [endCondition, setEndCondition] = useState('success') //TODO
  const [currentProgress, setCurrentProgress] = useState(0)

  usePreRender(() => {
    for (const child of props.command.children) {
      const childValue = child.values[0]

      switch (child.name.toLowerCase()) {
        case 'max':
          setMax(Math.min(Number(childValue), 100))
          continue
        case 'time':
          setTimeToMax(Number(childValue))
          continue
        case 'error':
        case 'warning':
        case 'success':
          setEndCondition(child.name.toLowerCase())
          continue
        case 'text':
          setEndCondition(childValue as string)
          continue
      }
    }
  })

  const numberOfSquares = 20
  const updateFrequency = 173
  const updateIncrement = (updateFrequency / timeToMax) * max
  const progressBar = []

  for (let square = 1; square <= numberOfSquares; square++) {
    const multiplier = 100 / numberOfSquares
    const topOfRange = (square * multiplier) - 1
    if (currentProgress >= topOfRange) {
      progressBar.push(SpecialChars.Complete)
      continue
    }
    
    const bottomOfRange = ((square - 1) * multiplier) + 1
    if (currentProgress >= bottomOfRange) {
      progressBar.push(SpecialChars.Partial)
      continue
    }

    progressBar.push(SpecialChars.Empty)
  }

  useEffect(() => {
    if (currentProgress >= max) {
      props.done()
      return
    }

    setTimeout(() => {
      setCurrentProgress(currentProgress + updateIncrement)
    }, updateFrequency)
  }, [currentProgress])

  return (
    <RenderText
      animation={TextAnimation.NONE}
      className={props.className}
      delay={0}
      text={
        `${progressBar.join('')} ${currentProgress >= max ? '' : `${currentProgress.toFixed(2)}%`}`
      }
    />
  )
}

export default ProgressHandler
