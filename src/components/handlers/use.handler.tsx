import './useShape.scss'
import { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const Use: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const contextName = props.command.values[0] as string
    props.changeContext(contextName)
  }, [])

  return null
}

export default Use
