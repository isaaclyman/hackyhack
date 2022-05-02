import { useEffect } from "react";
import ContextEventHub, { TopContextName } from "../../services/contextEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const CloseAllShapesHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    ContextEventHub.closeContext(TopContextName)
    props.done()
  }, [])

  return null
}

export default CloseAllShapesHandler
