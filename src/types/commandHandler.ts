export interface CommandHandlerProps {
  done: () => any
}

export type CommandHandler = (props: CommandHandlerProps) => any