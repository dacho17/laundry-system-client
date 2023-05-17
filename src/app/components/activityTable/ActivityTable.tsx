import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchActivityHistory } from '../../../services/slices/AccountSlice';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import { formatDate, formatTimeslot } from '../../utils/elementHelper';
import ActivityHistoryEntryDto from '../../../dtos/ActivityHistoryEntryDto';
import { ActivityHistoryEntryType, getActivityHistoryEntryType } from '../../../enums/ActivityHistoryEntryType';
import './ActivityTable.css';

const headerLabels = [
    CONSTANTS.timeOfActivityLabel, CONSTANTS.activityLabel, CONSTANTS.descriptionLabel, CONSTANTS.paidAmountLabel
];

interface ActivityHistoryFormattedEntry {
    timeOfActivity: string;
    activityType: string;
    description: string;
    price?: string;
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default function ActivityTable() {
    const dispatch = useAppDispatch();
    const {activityHistory, isFetchLoading, fetchResMsg} = useAppSelector(state => state.account);

    const [windowSize, setWindowSize] = useState(getWindowDimensions());

    useEffect(() => {
        dispatch(fetchActivityHistory());

        function handleWindowResize() {
            setWindowSize(getWindowDimensions());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
        window.removeEventListener('resize', handleWindowResize);
        };
    }, [dispatch]);

    function getActivityType(activityType: ActivityHistoryEntryType) {
        switch(getActivityHistoryEntryType(activityType)) {
            case ActivityHistoryEntryType.ASSET_BOOKING:
                return CONSTANTS.bookingLabel;
            case ActivityHistoryEntryType.ASSET_PURCHASE:
            case ActivityHistoryEntryType.OFFER_PURCHASE:
                return CONSTANTS.paymentLabel;
        }
    }

    function getActivityDescription(activity: ActivityHistoryEntryDto) {
        if (activity.assetType) {
            const timeslotDate = new Date(activity.chosenTimeslot!);
            const timeslotStr = `${formatDate(timeslotDate)} ${formatTimeslot(timeslotDate)}`

            return `${activity.assetName} on ${timeslotStr}`;
        } else {    // it is an offer purchase
            return `Loyalty Offer: ${activity.offerName} (${activity.loyaltyPointsPurchased} points)`;
        }
    }

    function getPrice(activity: ActivityHistoryEntryDto) {
        switch(getActivityHistoryEntryType(activity.activityType)) {
            case ActivityHistoryEntryType.ASSET_BOOKING:
                return CONSTANTS.freeOfChargeLabel;
            case ActivityHistoryEntryType.ASSET_PURCHASE:
            case ActivityHistoryEntryType.OFFER_PURCHASE:
                if (activity.loyaltyPointsUsed) {
                    return `${activity.loyaltyPointsUsed} points`;
                }
                return `${activity.paidAmount!.toFixed(2)} ${activity.currency}`;
        }
    }

    function getTableEntry(activity: ActivityHistoryEntryDto) {
        const formattedEntry = {
            timeOfActivity: activity.timeOfActivity,
            activityType: getActivityType(activity.activityType),
            description: getActivityDescription(activity),
            price: getPrice(activity)
        } as ActivityHistoryFormattedEntry;

        if (windowSize.width > 800) {
            return <>
                <div className='activity-table__item'>{formattedEntry.timeOfActivity}</div>
                <div className='activity-table__item'>{formattedEntry.activityType}</div>
                <div className='activity-table__item'>{formattedEntry.description}</div>
                <div className='activity-table__item'>{formattedEntry.price}</div>
            </>
        } else {
            return <>
                <div className='activity-table__item'>{headerLabels[0]}: {formattedEntry.timeOfActivity}</div>
                <div className='activity-table__item'>{headerLabels[1]}: {formattedEntry.activityType}</div>
                <div className='activity-table__item'>{headerLabels[2]}: {formattedEntry.description}</div>
                <div className='activity-table__item'>{headerLabels[3]}: {formattedEntry.price}</div>
                <hr className='activity-table__delimiter' />
            </>
        }
    }

    function getTableContent() {
        if (fetchResMsg?.isError) {
            return <div className='message-container-centered'>{fetchResMsg.message}</div>
        } else if (isFetchLoading) {
            return <div className='message-container-centered'><LoadingComponent /></div>
        } else if (activityHistory) {
            if (activityHistory.length === 0) {
                return <div className='message-container-centered'>{CONSTANTS.noRegisteredActivities}</div>
            } else {
                return activityHistory.map((entry, index) => {
                    return <div
                        className='activity-table__entry'
                        key={`activity-table__entry-${index}`}
                    >{getTableEntry(entry)}</div>
                })
            }
        } else {
            return <div className='message-container-centered'>{CONSTANTS.unanticipatedEvent}</div>
        }
    }

    return (
        <div id='activity-table-container'>
            <div id='activity-table-header'>
                {headerLabels.map((label, index) => {
                    return <div
                        className='activity-table__header-item'
                        key={`activity-table__header-item-${index}`}
                    >{label}</div>
                })}
            </div>
            <div id='activity-table'>
                {getTableContent()}
            </div>      
        </div>
    );
}
