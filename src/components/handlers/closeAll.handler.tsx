import { useEffect } from "react";
import ContextEventHub, { TopContextName } from "../../services/contextEventHub";
import PopupEventHub from "../../services/popupEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const CloseAllHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    PopupEventHub.triggerCloseAll()
    ContextEventHub.closeContext(TopContextName)
    props.done()
  }, [])

  return null
}

export default CloseAllHandler
