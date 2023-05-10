import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import './ActivityTable.css';
import { getActivity } from '../../utils/enumHelper';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchActivityHistory } from '../../../services/slices/AccountSlice';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import ActivityDto from '../../../dtos/ActivityDto';
import { formatDate, formatTimeslot } from '../../utils/elementHelper';

const headerLabels = [
    CONSTANTS.timeOfActivityLabel, CONSTANTS.activityLabel, CONSTANTS.chosenTimeslotLabel,
    CONSTANTS.assetLabel, CONSTANTS.paidAmountLabel
];

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
        if (activityHistory == null) {
            dispatch(fetchActivityHistory());
        }

        function handleWindowResize() {
        setWindowSize(getWindowDimensions());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
        window.removeEventListener('resize', handleWindowResize);
        };
    }, [activityHistory, dispatch]);

    function getTableEntry(activity: ActivityDto) {
        const timeslotDate = new Date(activity.chosenTimeslot);
        const formattedTimeslot = `${formatDate(timeslotDate)} ${formatTimeslot(timeslotDate)}`;
        if (windowSize.width > 800) {
            return <>
                <div className='activity-table__item'>{activity.timeOfActivity}</div>
                <div className='activity-table__item'>{getActivity(activity.activityType)}</div>
                <div className='activity-table__item'>{formattedTimeslot}</div>
                <div className='activity-table__item'>{activity.assetName}</div>
                <div className='activity-table__item'>{activity.servicePrice?.toFixed(2) ?? ''}</div>
            </>
        } else {
            return <>
                <div className='activity-table__item'>{headerLabels[0]}: {activity.timeOfActivity}</div>
                <div className='activity-table__item'>{headerLabels[1]}: {getActivity(activity.activityType)}</div>
                <div className='activity-table__item'>{headerLabels[2]}: {formattedTimeslot}</div>
                <div className='activity-table__item'>{headerLabels[3]}: {activity.assetName}</div>
                <div className='activity-table__item'>{headerLabels[4]}: {activity.servicePrice?.toFixed(2) ?? ''}</div>
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
