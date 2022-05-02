import { useEffect } from "react";
import PopupEventHub from "../../services/popupEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const ClosePopupHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const popupName = props.command.values.filter(val => typeof val === 'string')[0] as string
    PopupEventHub.triggerClose(popupName)
    props.done()
  }, [])

  return null
}

export default ClosePopupHandler