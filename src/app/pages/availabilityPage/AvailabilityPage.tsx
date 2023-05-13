import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import AvailabilityEntry from '../../components/availabilityEntry/AvailabilityEntry';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchEarliestAvailabilities } from '../../../services/slices/AvailabilitySlice';
import LoadingComponent from '../../components/loadingComponent/LoadingComponent';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import './AvailabilityPage.css';
import UsageRulesSection from '../../components/usageRulesSection/UsageRulesSection';
import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CtaButton from '../../components/ctaButton/CtaButton';

export default function AvailabilityPage() {
    const dispatch = useAppDispatch();
    const { isLoading, earliestAvailabilities, errorMsg} = useAppSelector(state => state.availability);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        dispatch(refreshUserLogin())

        dispatch(fetchEarliestAvailabilities());
    }, [dispatch]);

    function getPageContent() {
        if (isLoading) {
            return <LoadingComponent />
        } else if (errorMsg) {
            return <div className='message-container-centered'>{errorMsg}</div>;
        } else if (earliestAvailabilities == null) {
            return <div className='message-container-centered'>{CONSTANTS.theDataCannotBeFetchedMomentarily}</div>;
        } else {
            if (earliestAvailabilities.length === 0) {
                return <div className='message-container-centered'>{CONSTANTS.noRegisteredLaundryAssetsLabel}</div>;
            }
            return <>
                {earliestAvailabilities.map((availability, index) => {
                    return <AvailabilityEntry
                        key={index}
                        availability={availability}
                    />
                })}
            </>
        }
    }

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
                    <div id='availability-section__table' style={tableStyleAdaptation}>
                        {getPageContent()}
                    </div>
                </div>
        }
    }

    const tableStyleAdaptation = earliestAvailabilities === null || earliestAvailabilities.length === 0 ? {paddingTop: 0} : {};
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
