import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchResidenceTenants } from '../../../services/slices/ResidenceAdminSlice';
import CONSTANTS from '../../../assets/constants';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import RegisteredTenantsEntry from './registeredTenantsEntry/RegisteredTenantsEntry';
import './RegisteredTenantsSection.css';

export default function RegisteredTenantsSection() {
    const dispatch = useAppDispatch();
    const { fetchResMessage, isDataLoading, residenceTenants} = useAppSelector(state => state.residenceAdmin);

    useEffect(() => {
        dispatch(fetchResidenceTenants());
    }, [dispatch]);

    function getResidenceTenantsTable() {
        return residenceTenants?.map((tenant, index) => {
            return <RegisteredTenantsEntry
                key={index}
                tenant={tenant} />
        });
    }

    function getSectionContent() {
        if (fetchResMessage?.isError) {
            return <div className='message-container-centered'>{fetchResMessage.message}</div>
        } else if (isDataLoading || residenceTenants == null) {
            return <LoadingComponent />
        } else {
            if (residenceTenants?.length === 0) {
                return <div className='registered-tenants-section-table margin-bottom-2'>
                    <div className='message-container-centered'>{CONSTANTS.noRegisteredTenantsLabel}</div>
                </div>
            } else {
                return <div className='registered-tenants-section-table margin-bottom-2'>
                    {getResidenceTenantsTable()}
                </div>

            }
        }
    }

    return <div id='registered-tenants-section'>
        <div className='registered-tenants-section__section-title margin-bottom-2'>
                {CONSTANTS.registeredTenantsLabel}
            </div>
        <div className='registered-tenants-section__header margin-bottom-1'>
            <div className='registered-tenants-section__title'>
                {CONSTANTS.nameLabel}
            </div>
            <div className='registered-tenants-section__title'>
                {CONSTANTS.tenancyPeriodLabel}
            </div>
            <div className='registered-tenants-section__title'>
                {CONSTANTS.contactLabel}
            </div>
            {/* <div className='registered-tenants-section__title' /> */}
        </div>
        {getSectionContent()}
    </div>
}