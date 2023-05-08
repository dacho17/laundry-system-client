import { useEffect, useState } from "react";
import LoadingComponent from "../loadingComponent/LoadingComponent";
import Dropdown from "../dropdown/Dropdown";
import BookingTable from "../bookingTable/BookingTable";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import { fetchAccessibleLaundryAssets } from "../../../services/slices/BookingSlice";
import CONSTANTS from "../../../assets/constants";
import './BookingSection.css';

export default function BookingSection() {
    const { accessibleLaundryAssets, isDropdownLoading, dropdownErrorMsg } = useAppSelector(state => state.booking);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAccessibleLaundryAssets());
    }, [dispatch]);

    const [currentlySelectedAsset, setCurrentlySelectedAsset] = useState(-1);
    
    const isAssetSelected = currentlySelectedAsset !== CONSTANTS.defaultDropdownValue;
    const selectedAsset = accessibleLaundryAssets && isAssetSelected 
        ? accessibleLaundryAssets[currentlySelectedAsset] : null;
    return <div id='booking-section'>
        <div className='dropdown-container'>
            { isDropdownLoading && <LoadingComponent />}
            { dropdownErrorMsg && <div className='message-container-centered'>{dropdownErrorMsg}</div>}
            { accessibleLaundryAssets && <Dropdown
                items={accessibleLaundryAssets}
                currentlySelectedItem={currentlySelectedAsset}
                setItemFn={setCurrentlySelectedAsset}
            />}
        </div>
        <BookingTable asset={selectedAsset} />
    </div>;
}
