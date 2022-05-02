import { useEffect } from "react";
import ContextEventHub from "../../services/contextEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const CloseShapeHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const contextName = props.command.values.filter(val => typeof val === 'string')[0] as string
    ContextEventHub.closeContext(contextName)
    props.done()
  }, [])

  return null
}

export default CloseShapeHandler