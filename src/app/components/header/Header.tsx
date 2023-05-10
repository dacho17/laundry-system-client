import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getResidenceAdminHeaderLinks, getTenantHeaderLinks } from '../../utils/elementHelper';
import SideDrawer from '../sideDrawer/SideDrawer';
import CONSTANTS from '../../../assets/constants';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { logOut, refreshUserLogin } from '../../../services/slices/AuthSlice';
import { UserRole } from '../../../enums/UserRole';
import './Header.css';

export default function Header() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!user || Object.keys(user).length === 0) {
            dispatch(refreshUserLogin());
        }
    }, [user, dispatch]);

    const [isSideDrawerOpenned, setIsSideDrawerOpenned] = useState(false);
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logOut()).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                navigate(CONSTANTS.loginRoute);
            }
        });
    }
    
    function getHeaderContent() {
        if (user!.role === UserRole.TENANT) {
            return <>
                <div className='header__links'>
                    {getTenantHeaderLinks().map(label => {
                        return <div
                            className='header__link'
                            key={label[1]}
                            onClick={() => navigate(label[1])}
                        >{label[0]}</div>
                    })}
                </div>
                <div 
                    className='header__link'
                    onClick={() => handleLogout()}
                >{CONSTANTS.logoutLabel}</div>
            </>
        } else if (user!.role === UserRole.RESIDENCE_ADMIN) {
            return <>
                <div className='header__links'>
                    {getResidenceAdminHeaderLinks().map(label => {
                        return <div
                            className='header__link'
                            key={label[1]}
                            onClick={() => navigate(label[1])}
                        >{label[0]}</div>
                    })}
                </div>
                <div 
                    className='header__link'
                    onClick={() => handleLogout()}
                >{CONSTANTS.logoutLabel}</div>
            </>
        }
    }

    return (
        <div id='header'>
            <div id='header__title'>
                {CONSTANTS.headerTitleLabel}
            </div>
            { user && getHeaderContent()}
            <div 
                id='header__menu'
                onClick={() => setIsSideDrawerOpenned(!isSideDrawerOpenned)}
            ><FiMenu size={45}/></div>
            <SideDrawer isOpenned={isSideDrawerOpenned} toggleFn={setIsSideDrawerOpenned}/>
        </div>
    );
}
