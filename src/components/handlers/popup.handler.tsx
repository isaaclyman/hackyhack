import './popup.scss'
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import Modal from 'react-modal'
import React, { useEffect, useState } from "react";
import PopupEventHub from "../../services/popupEventHub";
import usePreRender from "../../hooks/usePreRender";
import { kdljs } from "kdljs";

let counter = 0

const PopupHandler: CommandHandler = function(props: CommandHandlerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [overlayStyles, setOverlayStyles] = useState({
    zIndex: 9000
  } as React.CSSProperties)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttons, setButtons] = useState([] as kdljs.Node[])
  const [position, setPosition] = useState('center')
  const [promptVariable, setPromptVariable] = useState('')
  const [noWait, setNoWait] = useState(false)

  usePreRender(() => {
    const newOverlayStyles: React.CSSProperties = {}
    let name = ''
    const newButtons = [] as kdljs.Node[]

    for (const child of props.command.children) {
      const childValue = child.values[0]

      switch (child.name.toLowerCase()) {
        case 'name':
          name = childValue as string
          continue
        case 'layer':
          newOverlayStyles.zIndex = Number(childValue)
          continue
        case 'title':
          setTitle(childValue as string)
          continue
        case 'message':
          setMessage(childValue as string)
          continue
        case 'position':
          setPosition((childValue as string).toLowerCase())
          continue
        case 'button':
          newButtons.push(child)
          continue
        case 'prompt':
          setPromptVariable(childValue as string)
          continue
        case 'wait':
          setNoWait(false)
          continue
        case 'nowait':
          setNoWait(true)
          continue
      }
    }

    name = name || `$__unnamed_popup_${counter++}`
    setOverlayStyles({...overlayStyles, ...newOverlayStyles})
    setButtons(buttons.concat(newButtons))
  
    PopupEventHub.registerCloseEventHandler(name, () => {
      setIsOpen(false)
    })
  })

  function getButtonText(button: kdljs.Node): string {
    return button.values[0] as string
  }

  function handleButtonClick(button: kdljs.Node): void {
    setIsOpen(false)
    props.insertCommands(button.children)
    props.done()
  }

  function interpretPosition(position: string): string {
    const positions = position.split(' ').filter(it => !!it)
    if (!positions.length || positions.length === 1 && positions[0] === 'center') {
      return 'h-center v-center'
    }

    return `h-${positions[0]} v-${positions[1]}`
  }

  useEffect(() => {
    if (noWait) {
      props.done()
    }
  }, [])
  
  return (
    <Modal
      className={{
        base: `popup ${interpretPosition(position)}`,
        afterOpen: 'popup-afteropen',
        beforeClose: 'popup-beforeclose'
      }}
      closeTimeoutMS={500}
      isOpen={isOpen}
      overlayClassName={{
        base: `popup-overlay ${interpretPosition(position)} ${props.className}`,
        afterOpen: 'popup-overlay-afteropen',
        beforeClose: 'popup-overlay-beforeclose'
      }}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      shouldFocusAfterRender={true}
      style={{
        overlay: overlayStyles,
        content: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: `1px solid ${props.settings.color}`,
          color: props.settings.color
        } as React.CSSProperties
      }}
    >
      {title ?
        <div className="popup-title" style={{
          borderBottom: `1px solid ${props.settings.color}`
        }}>
          {title}
        </div> :
      null}
      <div className="popup-body">
        {message ?
          <div className="popup-message">
            {message}
          </div> :
        null}
        {promptVariable ? null : null}
        {buttons.length ? 
          <div className="popup-actions">
            {buttons.map((button, index) => (
              <button className="popup-button" key={index} onClick={() => handleButtonClick(button)}>
                {getButtonText(button)}
              </button>
            ))}
          </div> :
          null
        }
      </div>
    </Modal>
  )
}

export default PopupHandler