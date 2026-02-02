import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

function TestHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🧠 Test Funcional
        </h1>
        <p className="text-gray-700">
          Si ves esto, React Router y Tailwind funcionan correctamente.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
