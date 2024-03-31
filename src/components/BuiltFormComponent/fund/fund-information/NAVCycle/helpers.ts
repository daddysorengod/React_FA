import moment from "moment";

export const getValidationTimeCycle = (value: any): string => {
  return value != undefined && value != null
    ? ""
    : "Chu kỳ không được để trống.";
};

export const getValidationOnEndOfMonth = (value: any): string => {
  return value != undefined && value != null
    ? ""
    : "Chốt NAV cuối tháng không được để trống.";
};

export const getValidationStartTime = (value: any): string => {
  if (value) {
    const parseDate = moment(value, "DD-MM-YYYY");
    if (!parseDate.isValid()) {
      return "Ngày bắt đầu sinh lịch NAV không đúng định dạng.";
    }
    return "";
  } else {
    return "Ngày bắt đầu sinh lịch NAV không được để trống.";
  }
};

export const getValidatiOnDayOff = (value: any): string => {
  return value != undefined && value != null
    ? ""
    : "Nếu NAV rơi vào ngày nghỉ không được để trống.";
};

export const getValidationListDayInWeekValue = (list: any[]): string => {
  return list.length === 0 ? "Vui lòng chọn ngày trong tuần." : "";
};

export const getValidationListDayInMonthValue = (list: any[]): string => {
  return list.length === 0 ? "Vui lòng chọn ngày trong tháng." : "";
};

export const getValidationListMonthOfQuaterValue = (list: any[]): string => {
  return list.length === 0 ? "Vui lòng chọn tháng trong quý." : "";
};
