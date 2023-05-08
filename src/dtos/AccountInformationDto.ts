import ResidenceDto from "./ResidenceDto";
import UpdateUserInfoForm from "./UpdateUserInfoForm";

export default interface AccountInformationDto {
    userInfo: UpdateUserInfoForm;
    residenceInfo: ResidenceDto;
}
