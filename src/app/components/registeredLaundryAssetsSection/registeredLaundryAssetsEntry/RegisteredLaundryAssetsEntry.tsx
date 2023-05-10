import { useAppDispatch } from "../../../../services/store";
import { setUpadatedLaundryAsset } from "../../../../services/slices/ResidenceAdminSlice";
import LaundryAssetDto from "../../../../dtos/LaundryAssetDto";
import { AssetType } from "../../../../enums/AssetType";
import CONSTANTS from "../../../../assets/constants";
import './RegisteredLaundryAssetsEntry.css';

interface RegisteredLaundryAssetsEntryProps {
    laundryAsset: LaundryAssetDto;
}

export default function RegisteredLaundryAssetsEntry(props: RegisteredLaundryAssetsEntryProps) {
    const name = props.laundryAsset.name;
    const assetType = props.laundryAsset.assetType.toString() === AssetType[AssetType.WASHER] ? CONSTANTS.washerLabel : CONSTANTS.drierLabel;

    const dispatch = useAppDispatch();

    function handleUpdateLaundryAsset() {
        dispatch(setUpadatedLaundryAsset(props.laundryAsset));
    }

    return <button
        className='registered-laundry-assets-section-table__entry'
        type="button"
        onClick={handleUpdateLaundryAsset}
    >        
        <div className='registered-laundry-assets-section-table__item'>{name}</div>
        <div className='registered-laundry-assets-section-table__item'>{assetType}</div>
    </button>
}
