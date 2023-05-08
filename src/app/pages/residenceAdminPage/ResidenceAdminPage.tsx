import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CONSTANTS from '../../../assets/constants';
import TenantRegistrationForm from '../../components/tenantRegistrationForm/TenantRegistrationForm';
import RegisteredTenantsSection from '../../components/registeredTenantsSection/RegisteredTenantsSection';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { setActiveSection } from '../../../services/slices/ResidenceAdminSlice';
import { RegistrationFormType } from '../../../enums/RegistrationFormType';
import ResidenceAdminRegistrationForm from '../../components/residenceAdminRegistrationForm/ResidenceAdminRegistrationForm';
import RegisteredResidenceAdminsSection from '../../components/registeredResidenceAdminsSection/RegisteredResidenceAdminsSection';
import RegisteredLaundryAssetsSection from '../../components/registeredLaundryAssetsSection/RegisteredLaundryAssetsSection';
import LaundryAssetRegistrationForm from '../../components/laundryAssetRegistrationForm/LaundryAssetRegistrationForm';
import { useEffect } from 'react';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import { UserRole } from '../../../enums/UserRole';
import { useNavigate } from 'react-router-dom';

export default function ResidenceAdminPage() {
    const dispatch = useAppDispatch();
    const { activeSection } = useAppSelector(state => state.residenceAdmin);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(refreshUserLogin());
        }
    }, [dispatch, user]);

    function getActiveSection() {
        switch(activeSection) {
            case CONSTANTS.registerResidenceAdminSectionIndex:
                return <div className='section'>
                    <ResidenceAdminRegistrationForm formType={RegistrationFormType.REGISTER} />
                </div>
            case CONSTANTS.updateResidenceAdminSectionIndex:
                return <div className='section'>
                    <ResidenceAdminRegistrationForm formType={RegistrationFormType.UPDATE} />
                    <RegisteredResidenceAdminsSection />
                </div>
            case CONSTANTS.registerTenantSectionIndex:
                return <div className='section'>
                    <TenantRegistrationForm formType={RegistrationFormType.REGISTER} />
                </div>
            case CONSTANTS.updateTenantSectionIndex:
                return <div className='section'>
                    <TenantRegistrationForm formType={RegistrationFormType.UPDATE} />
                    <RegisteredTenantsSection />
                </div>
            case CONSTANTS.registerLaundryAssetIndex:
                return <div className='section'>
                    <LaundryAssetRegistrationForm formType={RegistrationFormType.REGISTER} />
                </div>                
            case CONSTANTS.updateLaundryAssetIndex:
                return <div className='section'>
                    <LaundryAssetRegistrationForm formType={RegistrationFormType.UPDATE} />
                    <RegisteredLaundryAssetsSection />
                </div>;            
        }
    }

    const sectionNames = [CONSTANTS.registerResidenceAdminLabel, CONSTANTS.updateResidenceAdminLabel,
        CONSTANTS.registerTenantLabel, CONSTANTS.updateTenantLabel,
        CONSTANTS.registerLaundryAssetLabel, CONSTANTS.updateLaundryAssetLabel];
    return (
        <div className='page-content'>
            <SectionNavigator
                sectionLabels={sectionNames}
                currentlyActiveSection={activeSection}
                setActiveSectionFn={(activeSec: number) => dispatch(setActiveSection(activeSec))}
            />
            <div className='section-container'>
                {getActiveSection()}
            </div>
        </div>
    );
}
