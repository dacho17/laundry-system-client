import { useEffect, useState } from 'react';
import SectionNavigator from '../../components/sectionNavigator/SectionNavigator';
import CONSTANTS from '../../../assets/constants';
import MyActiveTimeslots from '../../components/myActiveTimeslots/MyActiveTimeslots';
import BookingSection from '../../components/bookingSection/BookingSection';
import MyBookingsSection from '../../components/myBookingsSection/MyBookingsSection';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { refreshUserLogin } from '../../../services/slices/AuthSlice';

export default function BookingPage() {
    const dispatch = useAppDispatch();

    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        dispatch(refreshUserLogin());
    }, [dispatch]);

    function getActiveSection() {
        switch(activeSection) {
            case 0:
                return <BookingSection />
            case 1:
                return <MyBookingsSection />
            case 2:
                return <MyActiveTimeslots />
        }
    }

    return (
        <div className='page-content'>
            <SectionNavigator
                sectionLabels={[CONSTANTS.bookNowLabel, CONSTANTS.myBookingsLabel, CONSTANTS.myActiveTimeslots]}
                currentlyActiveSection={activeSection}
                setActiveSectionFn={setActiveSection}
            />
            {getActiveSection()}
        </div>
    );
}
