import { useEffect } from 'react';
import CONSTANTS from '../../../assets/constants';
import AvailabilityEntry from '../../components/availabilityEntry/AvailabilityEntry';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchEarliestAvailabilities } from '../../../services/slices/AvailabilitySlice';
import LoadingComponent from '../../components/loadingComponent/LoadingComponent';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';
import './AvailabilityPage.css';

export default function AvailabilityPage() {
    const dispatch = useAppDispatch();
    const { isLoading, earliestAvailabilities, errorMsg} = useAppSelector(state => state.availability);

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

    const tableStyleAdaptation = earliestAvailabilities === null || earliestAvailabilities.length === 0 ? {paddingTop: 0} : {};
    return (
        <div className='page-content'>
            <div id='availability-section'>
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
        </div>
    );
}
