import { useMoralis } from "react-moralis";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/private";
import Authentication from "./pages/public";

const App = () => {
  const { isAuthenticated } = useMoralis();
  return (
    <HashRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<Dashboard />} />
        ) : (
          <Route path="/*" element={<Authentication />} />
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
