import { VALIDATION_ERROR_INTERFACE, VALIDATION_INTERFACE } from "@/src/types";
import {
  FORMAT_VALIDATE_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";

export const getValidateInfo = (
  value: any,
  label: string,
  condition?: VALIDATION_INTERFACE,
): VALIDATION_ERROR_INTERFACE => {
  let result: VALIDATION_ERROR_INTERFACE = {
    error: false,
    errorMessage: "",
  };
  if (!condition) {
    return result;
  }
  if (condition.requiredValidate) {
    if (isEmpty(value)) {
      result = {
        error: true,
        errorMessage: `${label} không được để trống.`,
      };
      return result;
    }
  }
  if (condition.formatValidate && !isEmpty(value)) {
    if (condition.regexString) {
      const regex = new RegExp(condition.regexString);
      if (regex instanceof RegExp) {
        if (!regex.test(value)) {
          result = {
            error: true,
            errorMessage: `${label} không đúng định dạng.`,
          };
          return result;
        }
      }
    }
    if (!condition?.formatValidateType) {
      console.log("Format Validate: Validation don't has formatValidateType.");
    } else {
      if (!isFormatValid(value, condition.formatValidateType)) {
        result = {
          error: true,
          errorMessage: `${label} không đúng định dạng.`,
        };
        return result;
      }
    }
  }
  if (condition.noSpecialCharacterValidate) {
    if (hasSpecialCharacters(value)) {
      result = {
        error: true,
        errorMessage: `${label} không được chứa kí tự đặc biệt.`,
      };
      return result;
    }
  }
  if (condition.noBetweenSpace) {
    if (hasBetweenSpace(value)) {
      result = {
        error: true,
        errorMessage: `${label} không được chứa dấu cách ở giữa.`,
      };
      return result;
    }
  }
  if (condition.inRangeValidate) {
    if (!condition?.inRangeValidateType) {
      console.log(
        "InRange Validate: Validation don't has inRangeValidateType.",
      );
    }

    switch (condition?.inRangeValidateType) {
      case IN_RANGE_VALIDATE_TYPE.NUMBER: {
        if (typeof value !== "number") {
          console.log("is In Number Range Valid: Value are not numbers.");
          break;
        }
        if (
          !isInNumberRangeValid(
            value,
            condition.minNumberValue,
            condition.maxNumberValue,
            condition.allowEqual,
          )
        ) {
          result = {
            error: true,
            errorMessage:
              typeof condition.minNumberValue == "number" &&
              typeof condition.maxNumberValue != "number"
                ? `${label} phải có giá trị lớn hơn ${
                    !!condition.allowEqual ? "hoặc bằng " : ""
                  } ${condition.minNumberValue}`
                : typeof condition.minNumberValue != "number" &&
                  typeof condition.maxNumberValue == "number"
                ? `${label} phải có giá trị nhỏ hơn ${
                    !!condition.allowEqual ? "hoặc bằng " : ""
                  } ${condition.maxNumberValue}`
                : `${label} phải có giá trị ${
                    !!condition.allowEqual ? "trong khoảng từ " : "lớn hơn "
                  } ${condition.minNumberValue} ${
                    !!condition.allowEqual ? "đến " : "và nhỏ hơn "
                  } ${condition.maxNumberValue}.`,
          };
          return result;
        }
        break;
      }
      case IN_RANGE_VALIDATE_TYPE.DATE: {
        if (
          typeof value !== "string" ||
          typeof condition?.minDateValue !== "string" ||
          typeof condition?.maxDateValue !== "string"
        ) {
          console.log(
            "is In Date Range Valid: Value, minDateValue, maxDateValue are not strings.",
          );
          break;
        }
        if (
          !isInDateRangeValid(
            value,
            condition.minDateValue,
            condition.maxDateValue,
          )
        ) {
          result = {
            error: true,
            errorMessage:
              typeof condition.minDateValue == "string" &&
              typeof condition.maxDateValue != "string"
                ? `${label} phải có giá trị lớn hơn ${
                    !!condition.allowEqual ? "hoặc bằng " : ""
                  } ${condition.minDateValue}`
                : typeof condition.minDateValue != "string" &&
                  typeof condition.maxDateValue == "string"
                ? `${label} phải có giá trị nhỏ hơn ${
                    !!condition.allowEqual ? "hoặc bằng " : ""
                  } ${condition.maxDateValue}`
                : `${label} phải có giá trị ${
                    !!condition.allowEqual ? "trong khoảng từ " : "lớn hơn "
                  } ${condition.minDateValue} ${
                    !!condition.allowEqual ? "đến " : "và nhỏ hơn "
                  } ${condition.maxDateValue}.`,
          };
          return result;
        }
        break;
      }
      default: {
      }
    }
  }
  if (condition.lengthValidate) {
    if (typeof value === "string") {
      if (
        typeof condition?.minLength === "number" &&
        typeof condition?.maxLength === "number"
      ) {
        if (!isLengthValid(value, condition.minLength, condition.maxLength)) {
          result = {
            error: true,
            errorMessage: `${label} phải có độ dài trong khoảng từ ${condition.minLength} ký tự đến ${condition.maxLength} ký tự.`,
          };
          return result;
        }
      }
      if (typeof condition?.maxLength === "number") {
        if (!isMaxLengthValid(value, condition.maxLength)) {
          result = {
            error: true,
            errorMessage: `${label} phải có độ dài tối đa là ${condition.maxLength} ký tự.`,
          };
          return result;
        }
      }

      if (typeof condition?.minLength === "number") {
        if (!isMinLengthValid(value, condition.minLength)) {
          result = {
            error: true,
            errorMessage: `${label} phải có độ dài tối thiểu là ${condition.minLength} ký tự.`,
          };
          return result;
        }
      }
    }
  }
  return result;
};

// Kiểm tra định dạng
function isFormatValid(value: string, formatType: string): boolean {
  switch (formatType) {
    case FORMAT_VALIDATE_TYPE.EMAIL: {
      return isEmailValid(value);
    }
    case FORMAT_VALIDATE_TYPE.PHONE_NUMBER: {
      return isPhoneNumberValid(value);
    }
    case FORMAT_VALIDATE_TYPE.URL: {
      return isURLValid(value);
    }
    case FORMAT_VALIDATE_TYPE.TIME: {
      return isTimeValid(value);
    }
    case FORMAT_VALIDATE_TYPE.STRONG_PASSWORD: {
      return isPasswordValid(value);
    }
    default: {
    }
  }
  return true;
}

// Kiểm tra rỗng
export function isEmpty(input: any): boolean {
  if (typeof input === "string") {
    return input.trim() === "";
  } else if (Array.isArray(input)) {
    return input.length === 0;
  } else {
    return input === null || input === undefined;
  }
}

// Kiểm tra độ dài
export function isLengthValid(
  input: string,
  minLength: number,
  maxLength: number,
): boolean {
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
}

export function isMinLengthValid(input: string, minLength: number): boolean {
  const length = input.trim().length;
  return length >= minLength;
}

export function isMaxLengthValid(input: string, maxLength: number): boolean {
  const length = input.trim().length;
  return length <= maxLength;
}

export function isInNumberRangeValid(
  value: number,
  minValue?: number,
  maxValue?: number,
  allowEqual?: boolean,
): boolean {
  const number = Number(value);
  if (!!minValue && !!maxValue) {
    return !!allowEqual
      ? number >= minValue && number <= maxValue
      : number > minValue && number < maxValue;
  } else if (typeof minValue == "number") {
    if (!!allowEqual) {
      return number >= minValue;
    } else {
      return number > minValue;
    }
  } else if (typeof maxValue == "number") {
    if (!!allowEqual) {
      return number <= maxValue;
    } else {
      return number < maxValue;
    }
  } else {
    return true;
  }
}

export function isInDateRangeValid(
  value: string,
  minValue?: string,
  maxValue?: string,
  allowEqual?: boolean,
): boolean {
  if (!value) {
    return true;
  }
  const date: Date = new Date(
    `${value.slice(6, 10)}-${value.slice(0, 2)}-${value.slice(3, 5)}`,
  );
  if (minValue && maxValue) {
    const minDate: Date = new Date(
      `${minValue.slice(6, 10)}-${minValue.slice(3, 5)}-${minValue.slice(
        0,
        2,
      )}`,
    );
    const maxDate: Date = new Date(
      `${maxValue.slice(6, 10)}-${maxValue.slice(3, 5)}-${maxValue.slice(
        0,
        2,
      )}`,
    );

    return !!allowEqual
      ? date >= minDate && date <= maxDate
      : date > minDate && date < maxDate;
  } else if (minValue) {
    const minDate: Date = new Date(
      `${minValue.slice(6, 10)}-${minValue.slice(3, 5)}-${minValue.slice(
        0,
        2,
      )}`,
    );

    return !!allowEqual ? date >= minDate : date > minDate;
  } else if (maxValue) {
    const maxDate: Date = new Date(
      `${maxValue.slice(6, 10)}-${maxValue.slice(3, 5)}-${maxValue.slice(
        0,
        2,
      )}`,
    );

    return !!allowEqual ? date >= maxDate : date > maxDate;
  } else {
    return true;
  }
}

// Định dạng Email
export function isEmailValid(input: string): boolean {
  const regex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(input);
}

// Định dạng Url
export function isURLValid(input: string): boolean {
  const regex: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(input);
}

// Đinh dạng Time
export function isTimeValid(time: string): boolean {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return false;
  }

  const [hours, minutes] = time.split(":");
  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  if (parsedHours < 0 || parsedHours > 23) {
    // Kiểm tra giá trị giờ không hợp lệ
    return false;
  }
  if (parsedMinutes < 0 || parsedMinutes > 59) {
    // Kiểm tra giá trị phút không hợp lệ
    return false;
  }
  return true;
}

// Định dạng Phone number
export function isPhoneNumberValid(input: string): boolean {
  // const regex: RegExp =
  //   /(84[3|5|7|8|9]|841[2|6|8|9]|\+84[3|5|7|8|9]|\+841[2|6|8|9]|0[3|5|7|8|9]|01[2|6|8|9])+([0-9]{8})\b/;
  const regex: RegExp = /^\d+$/;
  return regex.test(input);
}

// Định dạng Password
export function isPasswordValid(input: string): boolean {
  const regex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(input);
}

// Kiểm tra ký tự đặc biệt
export function hasSpecialCharacters(input: string): boolean {
  const specialCharRegex: RegExp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
  return specialCharRegex.test(input);
}

// Kiểm tra ký tự đặc biệt
export function hasBetweenSpace(input: string): boolean {
  const regex: RegExp = /\s/;
  return regex.test(input.trim());
}

// // Kiểm tra loại dữ liệu
// export function isInteger(input: any): boolean {
//   return Number.isInteger(Number(input));
// }

// export function isNumber(input: any): boolean {
//   return !isNaN(Number(input));
// }

// export function isString(input: any): boolean {
//   return typeof input === "string";
// }

// export function isBoolean(input: any): boolean {
//   return typeof input === "boolean";
// }

// // Kiểm tra giá trị tối thiểu/tối đa
// export function isInRange(input: number, minValue: number, maxValue: number): boolean {
//   return input >= minValue && input <= maxValue;
// }

// // Kiểm tra sự trùng lặp
// export function isDuplicate(input: any, existingData: any[]): boolean {
//   return existingData.includes(input);
// }

export const isTimeValidHHMMSS = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (timeRegex.test(time)) {
    return true;
  } else {
    return false;
  }
};
