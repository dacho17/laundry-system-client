import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import { useAppDispatch } from '../../../services/store';
import { fetchEarliestAvailabilities } from '../../../services/slices/AvailabilitySlice';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import './AvailabilityPage.css';
import UsageRulesSection from '../../components/usageRulesSection/UsageRulesSection';
import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CtaButton from '../../components/ctaButton/CtaButton';
import AvailabilitySectionTable from '../../components/availabilitySectionTable/AvailabilitySectionTable';

export default function AvailabilityPage() {
    const dispatch = useAppDispatch();
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        dispatch(refreshUserLogin());
        dispatch(fetchEarliestAvailabilities());
    }, [dispatch]);

    console.log(`Availability page reloaded!\n\n`);

    function getActiveSection() {
        switch(activeSection) {
            case 0:
                return <>
                    <div className='section-container' style={{height: 'auto'}}>
                        <div className='section margin-bottom-1'>
                            <UsageRulesSection />
                        </div>
                        <div className='button-row margin-bottom-1'>
                            <CtaButton
                                label={CONSTANTS.useMachinesLabel}
                                actionFn={() => setActiveSection(1)}
                                isDisabled={false}
                            />
                        </div>
                    </div>
                    
                </>;
            case 1:
                return <div id='availability-section'>
                    <div id='availability-section__header' className='margin-bottom-1'>
                        <div className='availability-section__title'>
                            {CONSTANTS.availabilityLabel}
                        </div>
                        <div className='availability-section__title'>
                            {CONSTANTS.assetLabel}
                        </div>
                        <div className='availability-section__title'>
                            {CONSTANTS.noteLabel}
                        </div>
                        <div className='availability-section__title'>
                            {CONSTANTS.actionLabel}
                        </div>
                    </div>
                    <AvailabilitySectionTable />
                </div>
        }
    }

    return (
        <div className='page-content'>
            <SectionNavigator
                sectionLabels={[CONSTANTS.rulesOnUseLabel, CONSTANTS.availabilityLabel]}
                currentlyActiveSection={activeSection}
                setActiveSectionFn={setActiveSection}
            />
            {getActiveSection()}
        </div>
    );
}
