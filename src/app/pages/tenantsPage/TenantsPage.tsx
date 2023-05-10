import { useEffect, useState } from "react";
import CONSTANTS from "../../../assets/constants";
import { RegistrationFormType } from "../../../enums/RegistrationFormType";
import { refreshUserLogin } from "../../../services/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import RegisteredTenantsSection from "../../components/registeredTenantsSection/RegisteredTenantsSection";
import SectionNavigator from "../../components/sectionNavigator/SectionNavigator";
import TenantRegistrationForm from "../../components/tenantRegistrationForm/TenantRegistrationForm";
import { setFormResMessage, setUpdatedTenant } from "../../../services/slices/ResidenceAdminSlice";

export default function TenantsPage() {
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
        dispatch(setUpdatedTenant(null));
        switch(activeSection) {
            case CONSTANTS.registerTenantSectionIndex:
                return <div className='section'>
                    <TenantRegistrationForm formType={RegistrationFormType.REGISTER} />
                </div>
            case CONSTANTS.updateTenantSectionIndex:
                return <div className='section'>
                    <TenantRegistrationForm formType={RegistrationFormType.UPDATE} />
                    <RegisteredTenantsSection />
                </div>
        }
    }

    const sectionNames = [CONSTANTS.registerTenantLabel, CONSTANTS.updateTenantLabel];
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
