import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Access from "./pages/Access";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route element={<ProtectedRoute profiles={["ALUNO", "PROFESSOR", "ADMINISTRADOR"]} />}>
            <Route path="/biblioteca" element={<Access />} />
          </Route>
          <Route element={<ProtectedRoute profiles={["ADMINISTRADOR"]} />}>
            <Route path="/admin" element={<Access admin />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
