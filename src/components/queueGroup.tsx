import React, { useEffect, useState } from "react";

export interface QueueGroupProps {
  defaultDelay: number
  delays: number[]
}

export default function QueueGroup(props: React.PropsWithChildren<QueueGroupProps>) {
  const [queueIndex, setQueueIndex] = useState(0)
  const children = React.Children.toArray(props.children)

  useEffect(() => {
    if (queueIndex >= children.length) {
      return
    }

    const nextDelay = typeof props.delays[queueIndex] === 'number' ? props.delays[queueIndex] : props.defaultDelay

    setTimeout(() => {
      setQueueIndex(queueIndex + 1)
    }, nextDelay)
  }, [queueIndex])

  return (
    <>
      {props.children && children.slice(0, queueIndex)}
    </>
  )
}

QueueGroup.defaultProps = {
  defaultDelay: 150,
  delays: []
}
