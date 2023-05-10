import { useEffect } from 'react';
import LoginForm from '../../components/loginForm/LoginForm';
import './LoginPage.css';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../../assets/constants';
import { UserRole } from '../../../enums/UserRole';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    if (user) {
        if (user.role === UserRole.TENANT) {
            navigate(CONSTANTS.availabilityRoute);
        } else if (user.role === UserRole.RESIDENCE_ADMIN) {
            navigate(CONSTANTS.residenceAdminRoute)
        }
    }

    useEffect(() => {
        dispatch(refreshUserLogin());
    }, [dispatch]);

    return (
        <div className='page-content'>
            <LoginForm />
        </div>
    );
}
