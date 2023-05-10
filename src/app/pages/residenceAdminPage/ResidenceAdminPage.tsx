import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CONSTANTS from '../../../assets/constants';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { RegistrationFormType } from '../../../enums/RegistrationFormType';
import ResidenceAdminRegistrationForm from '../../components/residenceAdminRegistrationForm/ResidenceAdminRegistrationForm';
import RegisteredResidenceAdminsSection from '../../components/registeredResidenceAdminsSection/RegisteredResidenceAdminsSection';
import { useEffect, useState } from 'react';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import { setFormResMessage, setUpdatedResidenceAdmin } from '../../../services/slices/ResidenceAdminSlice';

export default function ResidenceAdminPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(refreshUserLogin());
        }
    }, [dispatch, user]);
    const [activeSection, setActiveSection] = useState(0);

    function getActiveSection() {
        dispatch(setFormResMessage(null));
        dispatch(setUpdatedResidenceAdmin(null));
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
        }
    }

    const sectionNames = [CONSTANTS.registerResidenceAdminLabel, CONSTANTS.updateResidenceAdminLabel];
    return (
        <div className='page-content'>
            <SectionNavigator
                sectionLabels={sectionNames}
                currentlyActiveSection={activeSection}
                setActiveSectionFn={(activeSec: number) => setActiveSection(activeSec)}
            />
            <div className='section-container'>
                {getActiveSection()}
            </div>
        </div>
    );
}
