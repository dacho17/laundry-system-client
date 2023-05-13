import CONSTANTS from "../../assets/constants"

// TODO: validate this correctly, It will take longer time to find and implement valid numbers which are not so relevant atm.
export function validateMobileNumber(dialCode: string, mobileNumber: string) {
    switch (dialCode) {
        case CONSTANTS.DIAL_CODE_MY:
        case CONSTANTS.DIAL_CODE_SG:
        case CONSTANTS.DIAL_CODE_TH:
        case CONSTANTS.DIAL_CODE_ID:
        case CONSTANTS.DIAL_CODE_PH:
        case CONSTANTS.DIAL_CODE_VN:
        case CONSTANTS.DIAL_CODE_LA:
        case CONSTANTS.DIAL_CODE_KH:
        case CONSTANTS.DIAL_CODE_MM:
        case CONSTANTS.DIAL_CODE_AU:
            return mobileNumber.trim().length >= 6;
        default:
            throw new Error(CONSTANTS.unknownDialCodeError);
    }
}
