import { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const HereIsHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const name = props.command.values.filter(val => typeof val === 'string')[0] as string
    props.createLocationMarker(name)
    props.done()
  }, [])

  return null
}

export default HereIsHandler