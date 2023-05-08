import { useEffect } from 'react';
import CONSTANTS from '../../../assets/constants';
import './MyBookingsSection.css';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchMyFutureBookings } from '../../../services/slices/BookingSlice';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import { formatDate } from '../../utils/elementHelper';
import { formatTimeslot } from '../../utils/elementHelper';

export default function MyBookingsSection() {
    const dispatch = useAppDispatch();
    const { myFutureBookings, tableErrorMsg } = useAppSelector(state => state.booking);

    useEffect(() => {
        dispatch(fetchMyFutureBookings());
    }, [dispatch]);

    function getTableContent() {
        if (tableErrorMsg) return <div className='message-container-centered'>{tableErrorMsg}</div>;
        else if (myFutureBookings) 
            return myFutureBookings.map((booking, index) => {
                const timeslotDate = new Date(booking.chosenTimeslot);
                const formattedTimeslot = `${formatDate(timeslotDate)} ${formatTimeslot(timeslotDate)}`;
                return <div
                    className='section-text margin-bottom-1'
                    key={index}
                >{`${booking.assetName} is booked for ${formattedTimeslot}`}</div>
            });
        else return <LoadingComponent />;
    }

    return <div id='my-bookings-section'>
        <div className='section-title margin-bottom-3'>{CONSTANTS.myBookingsLabel}</div>
        <div id='my-bookings-table'>
            {getTableContent()}
        </div>
    </div>
}
