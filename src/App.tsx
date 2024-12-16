import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { GroupPage } from "./pages/GroupPage";
import { UserPage } from "./pages/UserPage";
import { BaseLayout } from "./layout/BaseLayout";

// axios.post("http://localhost:3000/auth/signup", {
//   id: "admin",
//   password: "yoohyungchul",
//   name: "유형철",
//   email: "your.email@example.com",
//   phone: "01012345678",
//   birth: "1994-01-10",
// });

const ProtectedRoute = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  console.log(isLoggedIn);
  return isLoggedIn ? <BaseLayout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/user" element={<UserPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
