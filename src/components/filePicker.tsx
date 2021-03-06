import { ChangeEvent } from 'react'
import './filePicker.scss'

export interface FilePickerProps {
  accept: string
  name: string
  label: string
  onFile: (name: string, content: string) => any
}

export default function FilePicker(props: FilePickerProps) {
  function onChange(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files
    
    if (!files || !files[0] || files.length > 1) {
      return
    }
    
    const filereader = new FileReader()
    const file = files[0]
    filereader.onload = function() {
      props.onFile(file.name, filereader.result as string)
    }
    filereader.readAsText(file)
  }

  return (
    <>
      <label className="file-picker-label" htmlFor={props.name}>{ props.label }</label>
      <input 
        className="file-picker-input"
        type="file"
        id={props.name}
        onChange={$event => onChange($event)}
        accept={props.accept}
        multiple={false}
      />
    </>
  )
}
