import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CreateCarPage from './pages/CreateCarPage';
import EditCarPage from './pages/EditCarPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="about" element={<AboutPage />} />

        <Route path="login" element={<LoginPage />}/>
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />}/>
        <Route path="confirm-email" element={<ConfirmEmailPage />}/>

        <Route element={<ProtectedRoute />}>
          <Route path="cars">
            <Route index element={<CarsPage />} />
            <Route path="new" element={<CreateCarPage />} />
            <Route path=":id" element={<CarsPage />} />
            <Route path=":id/edit" element={<EditCarPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
