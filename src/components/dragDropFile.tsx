import './dragDropFile.scss'
import { DragEvent, useState } from "react"

export interface DragDropFileProps {
  accept: string
  name: string
  onFile: (name: string, content: string) => any
}

export default function DragDropFile(props: DragDropFileProps) {
  const [isActive, setIsActive] = useState(false)
  let dragDepth = 0

  function dragEventWrapper(fn: (ev: DragEvent<HTMLDivElement>) => any): (ev: DragEvent<HTMLDivElement>) => any {
    return (ev: DragEvent<HTMLDivElement>) => {
      ev.preventDefault()
      ev.stopPropagation()
      return fn(ev)
    }
  }

  const onDragIn = dragEventWrapper((ev: DragEvent<HTMLDivElement>) => {
    dragDepth++
    if (ev.dataTransfer && ev.dataTransfer.items && ev.dataTransfer.items.length === 1) {
      setIsActive(true)
    }
  })

  const onDragOut = dragEventWrapper((ev: DragEvent<HTMLDivElement>) => {
    dragDepth--

    if (dragDepth > 0) {
      return
    }
    setIsActive(false)
  })

  const onDragOver = dragEventWrapper((ev: DragEvent<HTMLDivElement>) => null)

  const onDrop = dragEventWrapper((ev: DragEvent<HTMLDivElement>) => {
    setIsActive(false)
    if (!ev.dataTransfer || !ev.dataTransfer.items || ev.dataTransfer.items.length !== 1) {
      return
    }

    const filereader = new FileReader()
    const file = ev.dataTransfer.files[0]
    filereader.onload = function() {
      props.onFile(file.name, filereader.result as string)
    }
    filereader.readAsText(file)
  })

  return <div
    className={`drop-zone ${isActive ? 'dragging' : ''}`}
    onDragEnter={ev => onDragIn(ev)}
    onDragLeave={ev => onDragOut(ev)}
    onDragOver={ev => onDragOver(ev)}
    onDrop={ev => onDrop(ev)}
  ></div>
}