import ResidenceAdmin from "../../../../dtos/ResidenceAdmin";
import { useAppDispatch } from "../../../../services/store";
import { setUpdatedResidenceAdmin } from "../../../../services/slices/ResidenceAdminSlice";
import './RegisteredResidenceAdminsEntry.css';

interface RegisteredResidencedminsEntryProps {
    residenceAdmin: ResidenceAdmin;
}

export default function RegisteredResidenceAdminsEntry(props: RegisteredResidencedminsEntryProps) {
    const residenceAdminName = `${props.residenceAdmin.name} ${props.residenceAdmin.surname}`;
    const residenceAdminContact = `${props.residenceAdmin.email}, ${props.residenceAdmin.mobileNumber}`;

    const dispatch = useAppDispatch();

    function handleUpdateResidenceAdmin() {
        dispatch(setUpdatedResidenceAdmin(props.residenceAdmin));
    }

    return <button
        className='registered-residence-admins-section-table__entry'
        type="button"
        onClick={handleUpdateResidenceAdmin}
    >        
        <div className='registered-residence-admins-section-table__item'>{residenceAdminName}</div>
        <div className='registered-residence-admins-section-table__item'>{residenceAdminContact}</div>
    </button>
}
