import "./App.css";
import Predictor from "./components/Predictor";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

function ElectionPage({ election }: { election: "presidential" | "senate" }) {
  // const senate = election === "senate";
  return (
    <div className="bg-white py-6 flex flex-col min-h-screen items-center justify-center gap-5">
      {/* <nav className="flex gap-3" aria-label="Election navigation">
        <Link className={`rounded px-4 py-2 ${!senate ? "bg-purple-700 text-white" : "bg-white text-gray-700"}`} to="/2024-presidential">2024 Presidential</Link>
        <Link className={`rounded px-4 py-2 ${senate ? "bg-purple-700 text-white" : "bg-white text-gray-700"}`} to="/2026-senate">2026 Senate</Link>
      </nav> */}
      <Predictor election={election} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/2026-senate" replace />} />
        <Route path="/2024-presidential" element={<ElectionPage election="presidential" />} />
        <Route path="/2026-senate" element={<ElectionPage election="senate" />} />
        <Route path="*" element={<Navigate to="/2026-senate" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
