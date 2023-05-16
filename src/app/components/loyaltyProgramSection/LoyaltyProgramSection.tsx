import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import { fetchLoyaltyOffers } from "../../../services/slices/AccountSlice";
import LoadingComponent from "../loadingComponent/LoadingComponent";
import CONSTANTS from "../../../assets/constants";
import './LoyaltyProgramSection.css';
import LoyaltyProgramEntry from "./LoyaltyProgramEntry/LoyaltyProgramEntry";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const headerLabels = [
    CONSTANTS.nameLabel, CONSTANTS.pointsLabel, CONSTANTS.priceLabel, CONSTANTS.expiryDateLabel, ''
];

export default function LoyaltyProgramSection() {
    const dispatch = useAppDispatch();
    const { loyaltyOffers, isFetchLoading, fetchResMsg } = useAppSelector(state => state.account);
    const { user } = useAppSelector(state => state.auth);

    const [windowSize, setWindowSize] = useState(getWindowDimensions());

    useEffect(() => {
        if (loyaltyOffers == null) {
            dispatch(fetchLoyaltyOffers());
        }

        function handleWindowResize() {
            setWindowSize(getWindowDimensions());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [loyaltyOffers, dispatch]);

    function getTableContent() {
        if (fetchResMsg?.isError) {
            return <div className='message-container-centered'>{fetchResMsg.message}</div>
        } else if (isFetchLoading) {
            return <div className='message-container-centered'><LoadingComponent /></div>
        } else if (loyaltyOffers) {
            if (loyaltyOffers.length === 0) {
                return <div className='message-container-centered'>{CONSTANTS.noLoyaltyOffers}</div>
            } else {
                const isMobileDeviceView = windowSize.width <= 800;
                return loyaltyOffers.map((entry, index) => {
                    return <LoyaltyProgramEntry
                        key={`loyalty-program-table__entry-${index}`}
                        isMobileDeviceView={isMobileDeviceView}
                        loyaltyOffer={entry}
                        headerLabels={headerLabels}
                    />;
                })
            }
        } else {
            return <div className='message-container-centered'>{CONSTANTS.unanticipatedEvent}</div>
        }
    }

    return <>
        <div id='loyalty-program-points'>
            {`${CONSTANTS.yourLoyaltyPointsLabel}: ${user?.loyaltyPoints}`}
        </div>
        <div id='loyalty-program-table-container'>
            <div id='loyalty-program-table-header'>
                {headerLabels.map((label, index) => {
                    return <div
                        className='loyalty-program-table__header-item'
                        key={`loyalty-program-table__header-item-${index}`}
                    >{label}</div>
                })}
            </div>
            <div id='loyalty-program-table'>
                {getTableContent()}
            </div>
        </div>
    </>
}