import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../../assets/constants';
import { getResidenceAdminHeaderLinks, getTenantHeaderLinks } from '../../utils/elementHelper';
import './SideDrawer.css';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { logOut, refreshUserLogin } from '../../../services/slices/AuthSlice';
import { UserRole } from '../../../enums/UserRole';
import { useEffect } from 'react';

interface SideDrawerProps {
    isOpenned: boolean;
    toggleFn: Function;
}

export default function SideDrawer(props: SideDrawerProps) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || Object.keys(user).length === 0) {
            dispatch(refreshUserLogin());
        }
    }, [user, dispatch]);

    function handleLogout() {
        dispatch(logOut()).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                props.toggleFn(false);
                navigate(CONSTANTS.loginRoute);
            }
        });
    }

    function getSideDrawerContent() {
        if (user!.role === UserRole.TENANT) {
            return <>
                {getTenantHeaderLinks().map(link => {
                    return <>
                        <div
                            className='side-drawer__link side-drawer__item'
                            key={link[1]}
                            onClick={() => {
                                navigate(link[1]);
                                props.toggleFn(false);
                            }}
                        >{link[0]}</div>
                        <hr className='side-drawer__delimiter'/>
                    </>
                })}
                <div
                    className='side-drawer__link side-drawer__item'
                    onClick={() => handleLogout()}
                >{CONSTANTS.logoutLabel}</div>
                <hr className='side-drawer__delimiter'/>
            </>
        } else if (user!.role === UserRole.RESIDENCE_ADMIN) {
            return <>
                {getResidenceAdminHeaderLinks().map(link => {
                    return <>
                        <div
                            className='side-drawer__link side-drawer__item'
                            key={link[1]}
                            onClick={() => {
                                navigate(link[1]);
                                props.toggleFn(false);
                            }}
                        >{link[0]}</div>
                        <hr className='side-drawer__delimiter'/>
                    </>
                })}
                <div
                    className='side-drawer__link side-drawer__item'
                    onClick={() => handleLogout()}
                >{CONSTANTS.logoutLabel}</div>
                <hr className='side-drawer__delimiter'/>
            </>
        }
    }

    return (
        <>
            {props.isOpenned && <div className='overlay' onClick={() => props.toggleFn(false)} />}
            <div className={`side-drawer ${props.isOpenned ? 'open' : ''}`}>
                <div className='side-drawer__content'>                    
                    {user && getSideDrawerContent()}
                </div>
            </div>
        </>  
    );
}
