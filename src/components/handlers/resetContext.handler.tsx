import { useEffect } from "react";
import { TopContextName } from "../../services/contextEventHub";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const ResetContextHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    props.changeContext(TopContextName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default ResetContextHandler
