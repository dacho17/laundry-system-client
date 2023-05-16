import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import CtaButton from '../ctaButton/CtaButton';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchMyActiveBookings } from '../../../services/slices/BookingSlice';
import { formatDate, formatFromToTimeslot } from '../../utils/elementHelper';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import { ActiveBookingType } from '../../../enums/ActiveBookingType';
import ReservedBooking from '../../../dtos/ReservedBooking';
import { convertPriceToPoints } from '../../utils/priceConverter';
import PurchasePopup from '../purchasePopup/PurchasePopup';
import './MyActiveTimeslots.css';
import PurchaseRequestDto from '../../../dtos/PurchaseRequestDto';
import { purchaseLaundryAssetService, setPopupResMessage } from '../../../services/slices/AvailabilitySlice';
import { setLoyaltyPoints } from '../../../services/slices/AuthSlice';

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
    const { user } = useAppSelector(state => state.auth);

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

    function handlePurchaseAsset(purchase: ReservedBooking, isPayingWithLoyaltyPoints: boolean) {
        const purchaseRequest = {
            assetId: purchase.assetId,
            isPayingWithLoyaltyPoints: isPayingWithLoyaltyPoints
        } as PurchaseRequestDto;

        dispatch(purchaseLaundryAssetService(purchaseRequest)).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                const currentPointBalance = user!.loyaltyPoints;
                const newPointBalance = currentPointBalance - convertPriceToPoints(purchase.servicePrice!, purchase.currency!);
                dispatch(setLoyaltyPoints(newPointBalance));  
            }
        });
    }

    function getTableItem(label: string, value: string) {
        if (windowSize.width > 800) {
            return value;
        } else {
            return `${label}: ${value}`;
        }
    }

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
        dispatch(fetchMyActiveBookings());
    }

    function showPopup(purchase: ReservedBooking) {
        let contentMsg = `You are about to use the machine ${purchase.assetName}.\n\n`;

        const priceInPoints = convertPriceToPoints(purchase.servicePrice!, purchase.currency!);
        let pointBalanceContent = null;

        if (priceInPoints < user?.loyaltyPoints!) {
            pointBalanceContent = `Loyalty point balance: ${user?.loyaltyPoints}`;
            contentMsg += `You can either choose to pay by card or using loyalty points.\n\nPrice of the use is either ${(purchase.servicePrice!.toFixed(2))} ${purchase.currency} or ${priceInPoints} loyalty points.`
        } else {
            contentMsg += `Your card will be charged with ${(purchase.servicePrice!.toFixed(2))} ${purchase.currency}.\n\n\nPlease confirm your payment. The wash button will then be activated.`;        
        }

        return isPopupShown && <PurchasePopup
            user={user!}
            useCardButtonLabel={CONSTANTS.useCardLabel}
            usePointsButtonLabel={CONSTANTS.usePointsLabel}
            title={CONSTANTS.paymentConfirmationTitleLabel}
            content={contentMsg}
            pointBalanceContent={pointBalanceContent ?? undefined}
            priceInPoints={priceInPoints}
            assetId={purchase.assetId}
            errorMsg={popupResMsg?.isError ? popupResMsg.message : undefined}
            successMsg={popupResMsg?.isError === false ? popupResMsg.message : undefined}
            closePopupFn={() => handlePopupClose()}
            actionFn={(isPayingWithLoyaltyPoints: boolean) => handlePurchaseAsset(purchase, isPayingWithLoyaltyPoints)}
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
