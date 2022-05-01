import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import Modal from 'react-modal'
import React, { useState } from "react";
import PopupEventHub from "../../services/popupEventHub";
import usePreRender from "../../hooks/usePreRender";
import { kdljs } from "kdljs";

let counter = 0

const PopupHandler: CommandHandler = function(props: CommandHandlerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [overlayStyles, setOverlayStyles] = useState({} as React.CSSProperties)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttons, setButtons] = useState([] as kdljs.Node[])

  usePreRender(() => {
    const newOverlayStyles: React.CSSProperties = {}
    let name = ''

    for (const child of props.command.children) {
      const childValue = child.values[0]

      switch (child.name) {
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
        case 'button':
          setButtons(buttons.concat(child))
          continue
        case 'prompt':
        case 'wait':
        case 'nowait':
      }
    }

    setOverlayStyles(newOverlayStyles)

    name = name || `$__unnamed_popup_${counter++}`
  
    PopupEventHub.registerCloseEventHandler(name, () => {
      setIsOpen(false)
    })
  })

  
  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: overlayStyles
      }}
    >

    </Modal>
  )
}

export default PopupHandler