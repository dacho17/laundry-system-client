import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AvailabilityPage from './pages/availabilityPage/AvailabilityPage';
import BookingPage from './pages/bookingPage/BookingPage';
import AccountPage from './pages/accountPage/AccountPage';
import LoginPage from './pages/loginPage/LoginPage';
import CONSTANTS from '../assets/constants';
import './App.css';
import ResidenceAdminPage from './pages/residenceAdminPage/ResidenceAdminPage';
import { useAppSelector } from '../services/store';
import TenantsPage from './pages/tenantsPage/TenantsPage';
import LaundryAssetsPage from './pages/laundryAssetsPage/LaundryAssetsPage';
import ForgotPasswordPage from './pages/forgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/resetPasswordPage/ResetPasswordPage';
import { getUserRole } from '../enums/UserRole';
import { UserRole } from '../enums/UserRole';

export default function App() {
    const { user } = useAppSelector(state => state.auth); 

    function navigateUserToLogin(targetPage: JSX.Element) {
      if (user == null)
        return <Navigate to={CONSTANTS.loginRoute} />;
      else return targetPage;
    }

    function navigateUserToContent(targetPage: JSX.Element) {
      if (user && Object.keys(user).length !== 0) {
        if (getUserRole(user.role) === UserRole.TENANT) {
          return <Navigate to={CONSTANTS.availabilityRoute} />;
        } else if (getUserRole(user.role) === UserRole.RESIDENCE_ADMIN) {
          return <Navigate to={CONSTANTS.residenceAdminRoute} />;
        }
      }

      return targetPage;
    }

    return <>
        <Header />
        <Routes>
          <Route path={CONSTANTS.homeRoute} element={<Navigate to={CONSTANTS.loginRoute} />} />
          <Route path={CONSTANTS.availabilityRoute} element={navigateUserToLogin(<AvailabilityPage />)} />
          <Route path={CONSTANTS.bookingRoute} element={navigateUserToLogin(<BookingPage />)} />
          <Route path={CONSTANTS.accountRoute} element={navigateUserToLogin(<AccountPage />)} />

          <Route path={CONSTANTS.loginRoute} element={navigateUserToContent(<LoginPage />)} />
          <Route path={CONSTANTS.forgotPasswordRoute} element={navigateUserToContent(<ForgotPasswordPage />)} />
          <Route path={CONSTANTS.resetPasswordRoute} element={navigateUserToContent(<ResetPasswordPage />)} />

          <Route path={CONSTANTS.residenceAdminRoute} element={navigateUserToLogin(<ResidenceAdminPage />)} />
          <Route path={CONSTANTS.tenantsRoute} element={navigateUserToLogin(<TenantsPage />)} />
          <Route path={CONSTANTS.laundryAssetsRoute} element={navigateUserToLogin(<LaundryAssetsPage />)} />
        </Routes>
        <Footer />
    </>;
}
