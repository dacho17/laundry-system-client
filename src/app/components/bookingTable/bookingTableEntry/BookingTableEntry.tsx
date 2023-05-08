import { useState } from 'react';
import CONSTANTS from '../../../../assets/constants';
import AvailabilityEntryIcon from '../../availabilityEntryIcon/AvailabilityEntryIcon';
import CtaButton from '../../ctaButton/CtaButton';
import Popup from '../../popup/Popup';
import { formatTimeslot } from '../../../utils/elementHelper';
import { useAppDispatch, useAppSelector } from '../../../../services/store';
import { bookAsset, fetchMyActiveBookings } from '../../../../services/slices/BookingSlice';
import BookingRequestDto from '../../../../dtos/BookingRequestDto';
import LaundryAssetDto from '../../../../dtos/LaundryAssetDto';
import { formatDate } from '../../../utils/elementHelper';
import { setPopupResMessage } from '../../../../services/slices/BookingSlice';

interface BookingTableEntryProps {
    asset: LaundryAssetDto,
    timeslot: Date,
    isAvailable: boolean
}

export default function BookingTableEntry(props: BookingTableEntryProps) {
    const dispatch = useAppDispatch();
    const { isPopupLoading, popupMsg } = useAppSelector(state => state.booking);

    const [isPopupShown, setIsPopupShown] = useState(false);

    const timeslot = `${formatDate(props.timeslot)} ${formatTimeslot(props.timeslot)}`;
    const bookingMsgContent = `You are about to book the usage of ${props.asset.name} in timeslot ${timeslot}.\n\nPlease make sure you will be using the machine within the chosen time slot.`;

    function handleBooking() {
        dispatch(bookAsset({
            assetId: props.asset.id,
            timeslot: props.timeslot.getTime()
        } as BookingRequestDto)).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                dispatch(fetchMyActiveBookings());
            }
        })
    }

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
    }

    return <>
        <div className='booking-table__item'>
            {formatTimeslot(props.timeslot)}
        </div>
        <div className='booking-table__item'>
            <div className='icon-margin-container'>
                <AvailabilityEntryIcon isAssetAvailable={props.isAvailable} />
            </div>
            { props.isAvailable && <>
                <CtaButton
                    actionFn={() => setIsPopupShown(true)}
                    isDisabled={false}
                    label={CONSTANTS.bookLabel}
                />
            </>}
            { isPopupShown && <Popup
                    buttonLabel={CONSTANTS.confirmBookingLabel}
                    title={CONSTANTS.bookingConfirmationTitleLabel}
                    content={bookingMsgContent}
                    errorMsg={popupMsg?.isError ? popupMsg.message : undefined}
                    successMsg={popupMsg?.isError === false ? popupMsg.message : undefined}
                    isLoading={isPopupLoading}
                    closePopupFn={() => handlePopupClose()}
                    actionFn={() => handleBooking()}
                />}
        </div>        
    </>
}
