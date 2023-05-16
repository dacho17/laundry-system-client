import { useEffect, useState } from 'react';
import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CONSTANTS from '../../../assets/constants';
import ActivityTable from '../../components/activityTable/ActivityTable';
import AccountInfoSection from '../../components/accountInfoSection/AccountInfoSection';
import AccountPaymentSection from '../../components/accountPaymentSection/AccountPaymentSection';
import { useAppDispatch } from '../../../services/store';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import { setFormResMessage } from '../../../services/slices/AccountSlice';
import LoyaltyProgramSection from '../../components/loyaltyProgramSection/LoyaltyProgramSection';

export default function AccountPage() {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(refreshUserLogin());
    }, [dispatch]);

    const [activeSection, setActiveSection] = useState(0);

    function getActiveSection() {
        dispatch(setFormResMessage(null));
        switch(activeSection) {
            case 0:
                return <div className='section'>
                    <AccountInfoSection />
                </div>;
            case 1:
                return <div className='section'>
                    <AccountPaymentSection />
                </div>
            case 2:
                return <ActivityTable />;
            case 3:
                return <LoyaltyProgramSection />;
        }
    }

    return (
        <div className='page-content'>
            <SectionNavigator
                sectionLabels={[CONSTANTS.infoLabel, CONSTANTS.paymentLabel, CONSTANTS.activityHistoryLabel, CONSTANTS.loyaltyProgramLabel]}
                currentlyActiveSection={activeSection}
                setActiveSectionFn={setActiveSection}
            />
            <div className='section-container' style={{height: 'auto'}}>
                {getActiveSection()}
            </div>
        </div>
    );
}
