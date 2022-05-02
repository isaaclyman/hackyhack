import { Link, useNavigate } from "react-router-dom";
import DragDropFile from "../components/dragDropFile";
import FilePicker from "../components/filePicker";
import QueueGroup from "../components/queueGroup";
import RenderText from '../components/renderText'
import { TextAnimation } from "../types/text.animation";

export default function Start() {
  const textClass = 'start'
  const navigate = useNavigate()

  function useFileForHack(name: string, contents: string): void {
    navigate('/hack', {
      state: {
        scriptName: name,
        script: contents
      }
    })
  }

  return (
    <div>
      <DragDropFile name="drop-scene-file" onFile={useFileForHack} accept="text/*" />
      <div style={{position: 'relative', zIndex: 10}}>
        <QueueGroup delays={[0, 150, 500]}>
          <RenderText className={textClass} text="Welcome to Hacky hack." animation={TextAnimation.TYPE} />
          <RenderText className={textClass} text="Drag a scene onto this window to start your hack, or choose an option below." animation={TextAnimation.TYPE} />
          <div>
            <Link to="/example">See examples</Link>
            <a href="https://github.com/isaaclyman/hackyhack">Learn</a>
            <FilePicker name="pick-scene-file" label="Choose scene file" onFile={useFileForHack} accept="text/*" />
          </div>
        </QueueGroup>
      </div>
    </div>
  )
}