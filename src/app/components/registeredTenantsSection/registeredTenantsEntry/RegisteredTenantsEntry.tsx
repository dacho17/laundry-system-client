import CONSTANTS from "../../../../assets/constants";
import Tenant from "../../../../dtos/Tenant";
import { formatDate } from "../../../utils/elementHelper";
import { useAppDispatch } from "../../../../services/store";
import { setActiveSection, setUpdatedTenant } from "../../../../services/slices/ResidenceAdminSlice";
import './RegisteredTenantsEntry.css';

interface RegisteredTenantsEntryProps {
    tenant: Tenant;
}

export default function RegisteredTenantsEntry(props: RegisteredTenantsEntryProps) {
    const tenantName = `${props.tenant.name} ${props.tenant.surname}`;
    const tenancyFromDay = formatDate(new Date(props.tenant.tenancyFrom));
    const tenancyUntilDay = formatDate(new Date(props.tenant.tenancyTo));
    const tenancyPeriod = `${tenancyFromDay} - ${tenancyUntilDay}`;
    const tenantContact = `${props.tenant.email}, ${props.tenant.mobileNumber}`;

    const dispatch = useAppDispatch();

    function handleUpdateTenant() {
        dispatch(setUpdatedTenant(props.tenant));
        console.log('tenant has been updated')
    }

    return <button
        className='registered-tenants-section-table__entry'
        type="button"
        disabled={!props.tenant.tenancyActive}
        onClick={handleUpdateTenant}
    >        
        <div className='registered-tenants-section-table__item'>{tenantName}</div>
        <div className='registered-tenants-section-table__item'>{tenancyPeriod}</div>
        <div className='registered-tenants-section-table__item'>{tenantContact}</div>
        {/* <div className='registered-tenants-section-table__item'>
            <CtaButton
                isDisabled={}    // TODO/NOTE: good condition is disable if it has been deleted
                label={CONSTANTS.updateLabel}
                actionFn={handleUpdateTenant}
            />
        </div> */}
    </button>
}
