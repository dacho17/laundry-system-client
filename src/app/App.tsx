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
import { UserRole } from '../enums/UserRole';

export default function App() {
    const { user } = useAppSelector(state => state.auth); 

    function navigateUser(targetPage: JSX.Element) {
      if (user == null)
        return <Navigate to={CONSTANTS.loginRoute} />;
      else return targetPage;
    }

    return <>
        <Header />
        <Routes>
          <Route path={CONSTANTS.homeRoute} element={<Navigate to={CONSTANTS.loginRoute} />} />
          <Route path={CONSTANTS.availabilityRoute} element={navigateUser(<AvailabilityPage />)} />
          <Route path={CONSTANTS.bookingRoute} element={navigateUser(<BookingPage />)} />
          <Route path={CONSTANTS.accountRoute} element={navigateUser(<AccountPage />)} />
          <Route path={CONSTANTS.loginRoute} element={<LoginPage />} />
          
          <Route path={CONSTANTS.residenceAdminRoute} element={navigateUser(<ResidenceAdminPage />)} />
        </Routes>
        <Footer />    
    </>;
}
