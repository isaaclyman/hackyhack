import { ChangeEvent } from 'react'
import './filePicker.scss'

export interface FilePickerProps {
  accept: string
  name: string
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => any
}

export default function FilePicker(props: FilePickerProps) {
  return (
    <>
      <label className="file-picker-label" htmlFor={props.name}>{ props.label }</label>
      <input className="file-picker-input" type="file" id={props.name} onChange={$event => props.onChange($event)} accept={props.accept} />
    </>
  )
}
