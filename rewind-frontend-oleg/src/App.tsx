import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import MainPage from "./MainPage/MainPage";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";

import Search from "./pages/Search";
//import Profile from "./pages/Profile";
import UserLists from "./pages/UserLists";

import AboutUs from "./pages/AboutUs/AboutUs";
import Help from "./pages/Help/Help";
import Terms from "./pages/Terms/Terms";
import Contacts from "./pages/Contacts/Contacts";

import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/search" element={<Search />} />

          <Route path="/lists" element={<UserLists />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contacts" element={<Contacts />} />

          <Route path="/profile" element={<Profile />} />

          {/* якщо зайшли на неіснуючий шлях — повертаємо на головну */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
