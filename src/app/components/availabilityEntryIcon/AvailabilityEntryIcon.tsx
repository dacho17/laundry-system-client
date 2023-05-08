import { TbWashTumbleDry } from 'react-icons/tb';
import './AvailabilityEntryIcon.css';

interface AvailabilityEntryIconProps {
    isAssetAvailable: boolean;
}

export default function AvailabilityEntryIcon(props: AvailabilityEntryIconProps) {
    const iconClassName = `availability-entry__icon ${props.isAssetAvailable ? 'available' : 'not-available'}`;

    return (
        <div className={iconClassName}>
            <TbWashTumbleDry size={30} />
        </div>
    );
}
