import { useEffect } from "react";
import LocationEventHub from "../../services/locationEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const GoToHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const name = props.command.values.filter(val => typeof val === 'string')[0] as string
    LocationEventHub.seekLocation(name)
  }, [])

  return null
}

export default GoToHandler
