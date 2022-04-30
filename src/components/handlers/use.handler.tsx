import { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const Use: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const contextName = props.command.values[0] as string
    props.changeContext(contextName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default Use
