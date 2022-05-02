import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Example from './pages/example';
import RenderHack from './pages/renderHack';
import Start from './pages/start';

function App() {
  return (
    <BrowserRouter basename='/hackyhack'>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/example" element={<Example />} />
        <Route path="/hack" element={<RenderHack />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
