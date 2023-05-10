import { useEffect, useState } from "react";
import CONSTANTS from "../../../assets/constants";
import { RegistrationFormType } from "../../../enums/RegistrationFormType";
import { refreshUserLogin } from "../../../services/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import LaundryAssetRegistrationForm from "../../components/laundryAssetRegistrationForm/LaundryAssetRegistrationForm";
import RegisteredLaundryAssetsSection from "../../components/registeredLaundryAssetsSection/RegisteredLaundryAssetsSection";
import SectionNavigator from "../../components/sectionNavigator/SectionNavigator";
import { setFormResMessage, setUpadatedLaundryAsset } from "../../../services/slices/ResidenceAdminSlice";

export default function LaundryAssetsPage() {
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
        dispatch(setUpadatedLaundryAsset(null));
        switch(activeSection) {
            case CONSTANTS.registerLaundryAssetIndex:
                return <div className='section'>
                    <LaundryAssetRegistrationForm formType={RegistrationFormType.REGISTER} />
                </div>;
            case CONSTANTS.updateLaundryAssetIndex:
                return <div className='section'>
                    <LaundryAssetRegistrationForm formType={RegistrationFormType.UPDATE} />
                    <RegisteredLaundryAssetsSection />
                </div>;
        }
    }

    const sectionNames = [CONSTANTS.registerLaundryAssetLabel, CONSTANTS.updateLaundryAssetLabel];
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
