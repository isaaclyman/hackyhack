import { Link } from "react-router-dom";
import DragDropFile from "../components/dragDropFile";
import FilePicker from "../components/filePicker";
import QueueGroup from "../components/queueGroup";
import RenderText from '../components/renderText'
import { TextAnimation } from "../types/text.animation";

export default function Start() {
  return (
    <div>
      <DragDropFile name="drop-scene-file" onChange={(ev) => {console.log(ev)}} accept="text/*" />
      <div style={{position: 'relative', zIndex: 10}}>
        <QueueGroup delays={[0, 150, 500]}>
          <RenderText text="Welcome to Hacky hack." animation={TextAnimation.TYPE} />
          <RenderText text="Drag a scene onto this window to start your hack, or choose an option below." animation={TextAnimation.TYPE} />
          <div>
            <Link to="/example">See example</Link>
            <a href="https://github.com/isaaclyman/hackyhack">Learn</a>
            <FilePicker name="pick-scene-file" label="Choose scene file" onChange={(ev) => {console.log(ev)}} accept="text/*" />
          </div>
        </QueueGroup>
      </div>
    </div>
  )
}