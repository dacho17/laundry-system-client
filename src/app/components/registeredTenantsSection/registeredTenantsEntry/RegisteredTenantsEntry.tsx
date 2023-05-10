import Tenant from "../../../../dtos/Tenant";
import { formatDate } from "../../../utils/elementHelper";
import { useAppDispatch } from "../../../../services/store";
import { setUpdatedTenant } from "../../../../services/slices/ResidenceAdminSlice";
import './RegisteredTenantsEntry.css';

interface RegisteredTenantsEntryProps {
    tenant: Tenant;
}

export default function RegisteredTenantsEntry(props: RegisteredTenantsEntryProps) {
    const tenantName = `${props.tenant.name} ${props.tenant.surname}`;
    const tenancyFromDay = formatDate(new Date(props.tenant.tenancyFrom));
    const tenancyUntilDay = formatDate(new Date(props.tenant.tenancyTo));
    const tenancyPeriod = `${tenancyFromDay} - ${tenancyUntilDay}`;
    // const tenantContact = `${props.tenant.email}, ${props.tenant.mobileNumber}`; NOTE: decided not to be displayed. Redesign for mobile users is neccessary

    const dispatch = useAppDispatch();

    function handleUpdateTenant() {
        dispatch(setUpdatedTenant(props.tenant));
        console.log('tenant has been updated')
    }

    return <button
        className='registered-tenants-section-table__entry'
        type="button"
        disabled={false}    // the update can be disabled based on some property - !props.tenant.tenancyActive
        onClick={handleUpdateTenant}
    >        
        <div className='registered-tenants-section-table__item'>{tenantName}</div>
        <div className='registered-tenants-section-table__item'>{tenancyPeriod}</div>
        {/* <div className='registered-tenants-section-table__item'>{tenantContact}</div> */}
    </button>
}
