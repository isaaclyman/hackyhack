import { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const ClearHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    props.clearContext()
    props.done()
  }, [])

  return null
}

export default ClearHandler