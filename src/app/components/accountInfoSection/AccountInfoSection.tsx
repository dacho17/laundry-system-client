import { useEffect } from 'react';
import CONSTANTS from '../../../assets/constants';
import AccountInfoForm from '../accountInfoForm/AccountInfoForm';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchAccountInformation } from '../../../services/slices/AccountSlice';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import './AccountInfoSection.css';

export default function AccountInfoSection() {
    const dispatch = useAppDispatch();
    const { userInformation, residenceInformation, isFetchLoading, fetchResMsg } = useAppSelector(state => state.account);
    
    useEffect(() => {
        dispatch(fetchAccountInformation());
    }, [dispatch]);

    function getResidenceAddress() {
        return `${residenceInformation?.streetName} ${residenceInformation?.streetNumber}, ${residenceInformation?.postalCode},
            ${residenceInformation?.city}, ${residenceInformation?.country}`;
    }

    if (fetchResMsg?.isError) return <div className='message-container-centered'>{fetchResMsg.message}</div>
    else if (isFetchLoading) {
        return <div className='message-container-centered'><LoadingComponent /></div>
    }
    else if (userInformation && residenceInformation) {
        
        return <>
            <AccountInfoForm 
                {...userInformation}    
            />
            <div id='accommodation-information'>
                <div className='section-title margin-bottom-3'>
                    {CONSTANTS.accommodationInformationLabel}
                </div>
                <div className='section-text margin-bottom-1'>
                    {`${CONSTANTS.residenceNameLabel}: ${residenceInformation.name}`}
                </div>
                <div className='section-text margin-bottom-1'>
                    {`${CONSTANTS.residenceAddressLabel}: ${getResidenceAddress()}`}
                </div>
                <div className='section-text margin-bottom-1'>
                    {`${CONSTANTS.unitNumberLabel}: 01-01-A`}
                    {/* TODO! define unit label somewhere in the BE*/}
                </div>
            </div>
        </>
    } else return <LoadingComponent />
}
