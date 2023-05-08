import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchLaundryAssets, } from '../../../services/slices/ResidenceAdminSlice';
import CONSTANTS from '../../../assets/constants';
import LoadingComponent from '../loadingComponent/LoadingComponent';
import RegisteredLaundryAssetsEntryEntry from './registeredLaundryAssetsEntry/RegisteredLaundryAssetsEntry';
import './RegisteredLaundryAssetsSection.css';

export default function RegisteredLaundryAssetsSection() {
    const dispatch = useAppDispatch();
    const { fetchResMessage, isDataLoading, residenceLaundryAssets} = useAppSelector(state => state.residenceAdmin);

    useEffect(() => {
        dispatch(fetchLaundryAssets());
    }, [dispatch]);

    function getLaundryAssetsTable() {
        return residenceLaundryAssets?.map((laundryAsset, index) => {
            return <RegisteredLaundryAssetsEntryEntry
                key={index}
                laundryAsset={laundryAsset} />
        });
    }

    function getSectionContent() {
        if (fetchResMessage?.isError) {
            return <div className='message-container-centered'>{fetchResMessage.message}</div>
        } else if (isDataLoading || residenceLaundryAssets == null) {
            return <LoadingComponent />
        } else {
            if (residenceLaundryAssets?.length === 0) {
                return <div className='registered-laundry-assets-section-table margin-bottom-2'>
                    <div className='message-container-centered'>{CONSTANTS.noRegisteredLaundryAssetsLabel}</div>
                </div>
            } else {
                return <div className='registered-laundry-assets-section-table margin-bottom-2'>
                    {getLaundryAssetsTable()}
                </div>
            }
        }
    }

    return <div id='registered-laundry-assets-section'>
        <div className='registered-laundry-assets-section__section-title margin-bottom-2'>
                {CONSTANTS.registeredResidenceAdminsLabel}
            </div>
        <div className='registered-tenants-section__header margin-bottom-1'>
            <div className='registered-laundry-assets-section__title'>
                {CONSTANTS.nameLabel}
            </div>
            <div className='registered-laundry-assets-section__title'>
                {CONSTANTS.assetTypeLabel}
            </div>
        </div>
        {getSectionContent()}
    </div>
}
