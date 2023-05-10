import { IoChevronBackOutline, IoChevronForwardOutline} from 'react-icons/io5';
import { formatDate, getCurrentDate, getDateWithRoundedHour, getOffsetDate } from '../../utils/elementHelper';
import './BookingTableDatepicker.css';
import CONSTANTS from '../../../assets/constants';

interface BookingTableDatePickerProps {
    selectedDate: Date;
    setSelectedDate: Function;
}

export default function BookingTableDatepicker(props: BookingTableDatePickerProps) {
    const today = getCurrentDate();
    const isTodaySelected = formatDate(getDateWithRoundedHour(props.selectedDate, CONSTANTS.firstHourOfDay)) === formatDate(getDateWithRoundedHour(today, CONSTANTS.firstHourOfDay));

    function changeDate(increment: number) {
        let newDate = getDateWithRoundedHour(getOffsetDate(props.selectedDate, increment), CONSTANTS.firstHourOfDay);
        if (formatDate(getDateWithRoundedHour(newDate, CONSTANTS.firstHourOfDay)) === formatDate(getDateWithRoundedHour(today, CONSTANTS.firstHourOfDay))) {
            newDate.setHours(today.getHours());
        }

        props.setSelectedDate(newDate);
    }

    return (
        <div id='booking-table__datepicker-container'>
            <div id='booking-table__datepicker'>
                <button 
                    className='button-container'
                    onClick={() => changeDate(-1)}
                    disabled={isTodaySelected}
                    type='button'
                >
                    <IoChevronBackOutline size={30} />
                </button>
                <div id='booking-table__datepicker-current-date'>
                    {formatDate(props.selectedDate)}
                </div>
                <button 
                    className='button-container'
                    onClick={() => changeDate(1)}
                    type='button'
                >
                    <IoChevronForwardOutline size={30} />
                </button>
            </div>
        </div>
    );
}