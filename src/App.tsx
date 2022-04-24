import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Example from './pages/example';
import Start from './pages/start';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/example" element={<Example />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
