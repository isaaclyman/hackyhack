import { useEffect } from "react";
import PopupEventHub from "../../services/popupEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const CloseAllPopupsHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    PopupEventHub.triggerCloseAll()
    props.done()
  }, [])

  return null
}

export default CloseAllPopupsHandler
