import {
  FORMAT_VALIDATE_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";

export interface VALIDATION_ERROR_INTERFACE {
  error: boolean;
  errorMessage: string;
}
export interface VALIDATION_INTERFACE {
  requiredValidate?: boolean;
  lengthValidate?: boolean;
  formatValidate?: boolean;
  inRangeValidate?: boolean;
  noSpecialCharacterValidate?: boolean;
  noBetweenSpace?: boolean;

  // Kiểu LENGTH
  minLength?: number;
  maxLength?: number;

  // Kiểu FORMAT
  formatValidateType?: FORMAT_VALIDATE_TYPE; // EMAIL || PHONE_NUMBER || URL || STRONG_PASSWORD || NO_SPEACIAL_CHARACTERS || IP
  regexString?: RegExp;
  // Kiểu DATA_TYPE
  // dataTypeValidateType?: DATA_TYPE_VALIDATE_TYPE; // INTEGER | NUMBER | STRING | BOOLEAN

  // Kiểu IN_RANGE
  inRangeValidateType?: IN_RANGE_VALIDATE_TYPE; // NUMBER | DATE
  minNumberValue?: number;
  maxNumberValue?: number;
  minDateValue?: string;
  maxDateValue?: string;
  allowEqual?: boolean;
}
