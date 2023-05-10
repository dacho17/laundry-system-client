import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import CtaButton from '../ctaButton/CtaButton';
import Popup from '../popup/Popup';
import './MyActiveTimeslots.css';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchMyActiveBookings } from '../../../services/slices/BookingSlice';
import { formatDate, formatFromToTimeslot, getCurrentDate, getDateWithRoundedHour } from '../../utils/elementHelper';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import { ActiveBookingType } from '../../../enums/ActiveBookingType';
import ReservedBooking from '../../../dtos/ReservedBooking';
import BookingRequestDto from '../../../dtos/BookingRequestDto';
import { purchaseLaundryAssetService, setPopupResMessage } from '../../../services/slices/AvailabilitySlice';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default function MyActiveTimeslots() {
    const dispatch = useAppDispatch();
    const { myActiveBookings, isTableLoading, tableErrorMsg } = useAppSelector(state => state.booking); 
    const { isPopupLoading, popupResMsg } = useAppSelector(state => state.availability);

    const [isPopupShown, setIsPopupShown] = useState(false);

    const [windowSize, setWindowSize] = useState(getWindowDimensions());

    useEffect(() => {
        if (myActiveBookings == null) {
            dispatch(fetchMyActiveBookings());
        }

        function handleWindowResize() {
        setWindowSize(getWindowDimensions());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
        window.removeEventListener('resize', handleWindowResize);
        };
    }, [dispatch, myActiveBookings]);

    function getTableItem(label: string, value: string) {
        if (windowSize.width > 800) {
            return value;
        } else {
            return `${label}: ${value}`;
        }
    }

    function handlePurchaseAsset(purchase: ReservedBooking) {
        const purchaseRequest = {
            assetId: purchase.assetId,
            timeslot: getDateWithRoundedHour(new Date(purchase.fromTimeslot), getCurrentDate().getHours()).getTime()
        } as BookingRequestDto;

        console.log(`The object to be sent: ${JSON.stringify(purchaseRequest)}`);
        dispatch(purchaseLaundryAssetService(purchaseRequest)).then(res => {
            console.log('log after dispatch has been called');
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                console.log('fulfilled status received');
            } else {
                console.log('status other than fulfilled has been received');
            }
        });
    }

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
        dispatch(fetchMyActiveBookings());
    }

    function showPopup(purchase: ReservedBooking) {
        const contentMsg = `You are about to pay for the usage of ${purchase.assetName}.\n\nYour card will be charged with ${(purchase.servicePrice!.toFixed(2))} ${purchase.currency}.\n\n\nPlease confirm your payment. The wash button will then be activated.`;

        return isPopupShown && <Popup
            buttonLabel={CONSTANTS.confirmPaymentLabel}
            title={CONSTANTS.paymentConfirmationTitleLabel}
            content={contentMsg}
            errorMsg={popupResMsg?.isError ? popupResMsg.message : undefined}
            successMsg={popupResMsg?.isError === false ? popupResMsg.message : undefined}
            closePopupFn={() => handlePopupClose()}
            actionFn={() => handlePurchaseAsset(purchase)}   // TODO: here will go a call to make a purchase
            isLoading={isPopupLoading}
        />
    }

    function getNoteAndNoteClass(activeBookingType: ActiveBookingType): [string | null, string | null] {
        switch (activeBookingType) {
            case ActiveBookingType.EXPIRED:
                return [CONSTANTS.purchaseOptionExpired, 'fail-msg'];
            case ActiveBookingType.PURCHASED:
                return [null, null];
            case ActiveBookingType.READY_FOR_USE:
                return [CONSTANTS.laundryAssetPurchased, 'success-msg'];
        }
    }

    function getNoBookingsOfTypeMsg(activeBookingType: ActiveBookingType): string {
        switch (activeBookingType) {
            case ActiveBookingType.EXPIRED:
                return CONSTANTS.noExpiredBookings;
            case ActiveBookingType.PURCHASED:
                return CONSTANTS.noCurrentlyRunnningBookings;
            case ActiveBookingType.READY_FOR_USE:
                return CONSTANTS.noBookingsReadyForUse;
        }
    }

    function getActiveTimeslotsTable(listOfBookings: ReservedBooking[] | undefined, isActionable: boolean, activeBookingType: ActiveBookingType) {
        const [note, noteClass] = getNoteAndNoteClass(activeBookingType);

        return listOfBookings!.map((booking, index) => {
            
            const timeslotDate = new Date(booking.fromTimeslot);
            const formattedTimeslot = `${formatDate(timeslotDate)} ${formatFromToTimeslot(booking.fromTimeslot, booking.toTimeslot)}`;

            return <div
                className='my-active-timeslots-section-table__entry'
                key={`my-active-timeslots-section-table__entry-${index}`}
            >
                <div className='my-active-timeslots-section-table__item'>{booking.assetName}</div>
                <div className='my-active-timeslots-section-table__item'>{getTableItem(CONSTANTS.timeslotLabel, formattedTimeslot)}</div>
                <div className={`my-active-timeslots-section-table__item ${noteClass}`}>{isActionable
                    ? <>
                        <CtaButton
                            key={`purchase-button-${index}`}
                            isDisabled={false}
                            label={CONSTANTS.useLabel}
                            actionFn={() => setIsPopupShown(true)} />
                    </>
                    : <>{note}</>
                }</div>
                {showPopup(booking)}
            </div>
        });
    }

    function getActiveTimeslotsTableContent(listOfBookings: ReservedBooking[] | undefined, isActionable: boolean, activeBookingType: ActiveBookingType) {
        console.log(`in getactiveTimeslotsTableContent ${JSON.stringify(listOfBookings)}`)
        if (tableErrorMsg !== null) {
            return <div className='message-container-centered'>{tableErrorMsg}</div>
        } else if (isTableLoading || listOfBookings == null) {
            return <LoadingComponent />
        } 
        // else if (listOfBookings === undefined || listOfBookings === null) {
        //     return <div className='message-container-centered'>{CONSTANTS.theDataCannotBeFetchedMomentarily}</div>
        // } 
        else {
            if (listOfBookings?.length === 0) {
                const noBookingsPresentMessage = getNoBookingsOfTypeMsg(activeBookingType);
                return <div className='my-active-timeslots-section-table margin-bottom-2' style={{paddingTop: 0}}>
                    <div className='message-container-centered'>{noBookingsPresentMessage}</div>
                </div>
            } else {
                return <div className='my-active-timeslots-section-table margin-bottom-2'>
                    {getActiveTimeslotsTable(listOfBookings, isActionable, activeBookingType)}
                </div>

            }
        }
    }

    return (
        <div id='my-active-timeslots-section'>
            <div className='my-active-timeslots-section__header margin-bottom-1'>
                <div className='my-active-timeslots-section__title'>
                    {CONSTANTS.assetLabel}
                </div>
                <div className='my-active-timeslots-section__title'>
                    {CONSTANTS.timeslotLabel}
                </div>
                <div className='my-active-timeslots-section__title'>
                    {CONSTANTS.actionLabel}
                </div>
            </div>
            {getActiveTimeslotsTableContent(myActiveBookings?.purchasedBookings, false, ActiveBookingType.PURCHASED)}
            {getActiveTimeslotsTableContent(myActiveBookings?.bookingsToPurchase, true, ActiveBookingType.READY_FOR_USE)}
            {/* {getActiveTimeslotsTableContent(myActiveBookings?.expiredBookings, false, ActiveBookingType.EXPIRED)} */}
        </div>
    );
}
