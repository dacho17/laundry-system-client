import CONSTANTS from "../../../assets/constants";
import { useAppSelector } from "../../../services/store";
import AvailabilityEntry from "../availabilityEntry/AvailabilityEntry";
import LoadingComponent from "../loadingComponent/LoadingComponent";


export default function AvailabilitySectionTable() {
    const { earliestAvailabilities, isLoading, errorMsg } = useAppSelector(state => state.availability);

    console.log(`AvailabilitySection reloaded`);
    console.log(`earliest availabilities exist = ${earliestAvailabilities != null}`);

    function getPageContent() {
        if (isLoading) {
            return <LoadingComponent />
        } else if (errorMsg) {
            return <div className='message-container-centered'>{errorMsg}</div>;
        } else  { // (earliestAvailabilities == null) 
            if (earliestAvailabilities) {
                if (earliestAvailabilities.length === 0) {
                    return <div className='message-container-centered'>{CONSTANTS.noRegisteredLaundryAssetsLabel}</div>;
                } else {
                    return <>
                        {earliestAvailabilities.map((availability, index) => {
                            return <AvailabilityEntry
                                key={index}
                                availability={availability}
                            />
                        })}
                    </>
                }
            } else {
                return <div className='message-container-centered'>{CONSTANTS.theDataCannotBeFetchedMomentarily}</div>;
            }
        } 
    }

    const tableStyleAdaptation = earliestAvailabilities === null || earliestAvailabilities.length === 0 ? {paddingTop: 0} : {};
    return <div id='availability-section__table' style={tableStyleAdaptation}>
        {getPageContent()}
    </div>;
}
