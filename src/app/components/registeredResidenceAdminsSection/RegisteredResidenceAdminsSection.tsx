import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchResidenceAdmins, } from '../../../services/slices/ResidenceAdminSlice';
import CONSTANTS from '../../../assets/constants';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import RegisteredResidencedminsEntry from './registeredResidenceAdminsEntry/RegisteredResidenceAdminsEntry';
import './RegisteredResidenceAdminsSection.css';

export default function RegisteredResidenceAdminsSection() {
    const dispatch = useAppDispatch();
    const { fetchResMessage, isDataLoading, residenceAdmins} = useAppSelector(state => state.residenceAdmin);

    useEffect(() => {
        dispatch(fetchResidenceAdmins());
    }, [dispatch]);

    function getResidenceAdminsTable() {
        return residenceAdmins?.map((residenceAdmin, index) => {
            return <RegisteredResidencedminsEntry
                key={index}
                residenceAdmin={residenceAdmin} />
        });
    }

    function getSectionContent() {
        if (fetchResMessage?.isError) {
            return <div className='message-container-centered'>{fetchResMessage.message}</div>
        } else if (isDataLoading || residenceAdmins == null) {
            return <LoadingComponent />
        } else {
            if (residenceAdmins?.length === 0) {
                return <div className='registered-residence-admins-section-table margin-bottom-2'>
                    <div className='message-container-centered'>{CONSTANTS.noRegisteredResidenceAdminsLabel}</div>
                </div>
            } else {
                return <div className='registered-residence-admins-section-table margin-bottom-2'>
                    {getResidenceAdminsTable()}
                </div>
            }
        }
    }

    return <div id='registered-residence-admins-section'>
        <div className='registered-residence-admins-section__section-title margin-bottom-2'>
                {CONSTANTS.registeredResidenceAdminsLabel}
            </div>
        <div className='registered-tenants-section__header margin-bottom-1'>
            <div className='registered-residence-admins-section__title'>
                {CONSTANTS.nameLabel}
            </div>
            <div className='registered-residence-admins-section__title'>
                {CONSTANTS.contactLabel}
            </div>
        </div>
        {getSectionContent()}
    </div>
}
