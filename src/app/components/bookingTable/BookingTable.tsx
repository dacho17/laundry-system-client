import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import BookingTableDatepicker from '../bookingTableDatepicker/BookingTableDatepicker';
import './BookingTable.css';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchLaundryAssetDailyBookings } from '../../../services/slices/BookingSlice';
import BookingRequestDto from '../../../dtos/BookingRequestDto';
import { getCurrentDate, getDateWithRoundedHour } from '../../utils/elementHelper';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import BookingTableEntry from './bookingTableEntry/BookingTableEntry';
import LaundryAssetDto from '../../../dtos/LaundryAssetDto';

interface BookingTableProps {
    asset: LaundryAssetDto | null;
}

export default function BookingTable(props: BookingTableProps) {
    const dispatch = useAppDispatch();
    const { laundryAssestDailyBookings, isTableLoading, tableErrorMsg } = useAppSelector(state => state.booking);

    const curDate = getCurrentDate();
    const [selectedDate, setSelectedDate] = useState(getDateWithRoundedHour(curDate, curDate.getHours()));

    useEffect(() => {
        if (props.asset !== null) {
            const reqParams = {
                assetId: props.asset.id,
                timeslot: +selectedDate
            } as BookingRequestDto;
            console.log(`Date being dispatched ${reqParams.timeslot}`);
            dispatch(fetchLaundryAssetDailyBookings(reqParams));
        }
    }, [selectedDate, props.asset, dispatch]);

    function getAssetDailyBookingsList() {
        const bookedTimeslots = laundryAssestDailyBookings!.map(booking => (new Date(booking.chosenTimeslot)).toString());
        const res = [];
        const curHour = selectedDate.getHours();
        for (let i = curHour; i < CONSTANTS.hoursInDay; i++) {
            const bookingTimeslot = getDateWithRoundedHour(selectedDate, i);
            res.push({
                asset: props.asset,
                timeslot: bookingTimeslot,
                isAvailable: !bookedTimeslots.includes(bookingTimeslot.toString())
            });
        }

        return res;
    }

    function getBookingTable() {
        return getAssetDailyBookingsList().map((bookingTimeslot, index) => {
            return <div
                className='booking-table__entry'
                key={`booking-table__entry-${index}`}
            ><BookingTableEntry
                asset={bookingTimeslot.asset!}
                isAvailable={bookingTimeslot.isAvailable}
                timeslot={bookingTimeslot.timeslot} />
            </div>
        });
    }

    const adjustedStyle = props.asset === null ? {justifyContent: 'flex-start', paddingTop: '20px'} : {};
    function getBookingTableContent() {
        if (props.asset === null) {
            return <div className='message-container-centered' style={adjustedStyle}>{CONSTANTS.selectAssetLabel}</div>;
        } else if (props.asset !== null && isTableLoading) {
            return <LoadingComponent />;
        } else if (props.asset !== null && tableErrorMsg) {
            return <div className='message-container-centered'>{tableErrorMsg}</div>;
        } else if (props.asset !== null && laundryAssestDailyBookings) {
            return getBookingTable();
        } else {
            return <div className='message-container-centered'>{CONSTANTS.theDataCannotBeFetchedMomentarily}</div>;
        }
    }

    return (
        <div id='booking-table-container'>
            <BookingTableDatepicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            <div id='booking-table__header'>
                <div className='booking-table__header-item'>
                    {CONSTANTS.timeslotLabel}
                </div>
                <div className='booking-table__header-item'>
                    {CONSTANTS.availabilityLabel}
                </div>
            </div>
            <div id='booking-table'>
                {getBookingTableContent()}
            </div>
        </div>
    );
}
