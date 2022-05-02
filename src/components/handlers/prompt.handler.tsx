import './prompt.scss'
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import RenderText from '../renderText'
import React, { useEffect, useRef, useState } from 'react';
import VariableManager from '../../data/variable.manager';

const PromptHandler: CommandHandler = function(props: CommandHandlerProps) {
  const stringValues = props.command.values.filter(val => typeof val === 'string')
  const promptText = stringValues[0] as string
  const variableName = stringValues[1] as string | undefined
  const inputEl = useRef(null as HTMLInputElement | null)

  const [isPromptRendered, setIsPromptRendered] = useState(false)
  const [isDone, setIsDone] = useState(false)

  function receiveInput($event: React.ChangeEvent<HTMLInputElement>) {
    if (!variableName) {
      return
    }
    VariableManager.setVariable(variableName, $event.target.value)
  }

  function refocusInput() {
    if (isDone) {
      return
    }

    setTimeout(() => {
      if (!inputEl.current) {
        return
      }

      inputEl.current.focus()
    }, 50)
  }

  function watchKeyEvents($event: React.KeyboardEvent<HTMLInputElement>) {
    if ($event.key === 'Enter') {
      if (inputEl.current && variableName) {
        VariableManager.setVariable(variableName, inputEl.current.value)
      }

      setIsDone(true)
      props.done()
      window.removeEventListener('keyup', refocusInput)
      window.removeEventListener('click', refocusInput)
    }
  }

  useEffect(() => {
    if (isDone || !inputEl.current) {
      return
    }

    inputEl.current.focus()
  }, [inputEl.current, isPromptRendered])

  useEffect(() => {
    window.addEventListener('keyup', refocusInput)
    window.addEventListener('click', refocusInput)

    return () => {
      window.removeEventListener('keyup', refocusInput)
      window.removeEventListener('click', refocusInput)
    }
  }, [])
  
  return (
    <div className={`prompt-handler ${props.className}`}>
      <RenderText
        animation={props.settings.textAnimation}
        className={props.className}
        delay={props.settings.textTypeAnimationDelay}
        done={() => setIsPromptRendered(true)}
        text={promptText}
      />
      {
        isPromptRendered ?
        <input
          className="prompt-handler-input"
          disabled={isDone}
          onBlur={() => refocusInput()}
          onChange={$event => receiveInput($event)}
          onKeyUp={$event => watchKeyEvents($event)}
          ref={inputEl}
        /> :
        null
      }
    </div>
  )
}

export default PromptHandler