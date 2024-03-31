import { INPUT_FORMAT_TYPE } from "../constants/built-form";

export const formatInput = (value: any, type?: INPUT_FORMAT_TYPE) => {
  return value;
};

export const formatValue = (
  value: any,
  formatType?: INPUT_FORMAT_TYPE,
): any => {
  if (!formatType) {
    return value;
  }

  switch (formatType) {
    case INPUT_FORMAT_TYPE.UPPERCASE: {
      return formatUpperCase(value);
    }
    case INPUT_FORMAT_TYPE.ONLY_NUMBER: {
      return formatStringOnlyNumber(value);
    }
    case INPUT_FORMAT_TYPE.NUMBER_VALUE: {
      return formatNumberStringToNumber(value);
    }
    case INPUT_FORMAT_TYPE.NO_SPACE: {
      return formatNoSpace(value);
    }
    default: {
      return value;
    }
  }
};

export const formatValueFromAPI = (
  value: any,
  formatType?: INPUT_FORMAT_TYPE,
): any => {
  if (!formatType) {
    return value;
  }

  switch (formatType) {
    case INPUT_FORMAT_TYPE.UPPERCASE: {
      return formatUpperCase(value);
    }
    case INPUT_FORMAT_TYPE.ONLY_NUMBER: {
      return formatStringOnlyNumber(value);
    }
    case INPUT_FORMAT_TYPE.NUMBER_VALUE: {
      return formatNumberValueToString(value);
    }
    case INPUT_FORMAT_TYPE.NO_SPACE: {
      return formatNoSpace(value);
    }
    default: {
      return value;
    }
  }
};

// Format Number Value
export const formatOnChangeNumberValueToString = (
  event: React.ChangeEvent<HTMLInputElement>,
  oldValue: string,
  allowNegative?: boolean,
  onlyInt?: boolean,
): string => {
  const native = (event.nativeEvent as InputEvent).data;
  const newValue = event.target.value;
  if (oldValue.includes(",") && native === ",") {
    return oldValue;
  }

  if (allowNegative) {
    if (oldValue.includes("-") && native === "-") {
      return oldValue;
    }
  }

  const defaultRegex = /[^0-9.,]/g; // float/int, positive
  const negativeRegex = /[^-?0-9.,]/g; // float/int, positive/negative  ??
  const intRegex = /[^0-9.]/g; // int positive
  const intNegativeRegex = /[^-?0-9.]/g; // int, positive/negative  ??

  const regex = allowNegative
    ? onlyInt
      ? intNegativeRegex
      : negativeRegex
    : onlyInt
    ? intRegex
    : defaultRegex;

  const parseValue =
    (allowNegative && newValue.includes("-") && !newValue.startsWith("-")
      ? newValue.replaceAll("-", "")
      : newValue
    )
      .replace(regex, "")
      .replace(/\./g, "") +
    (newValue.endsWith(".") && native === "." ? "," : "");
  const isComma =
    !onlyInt && (native === "," || (newValue.endsWith(".") && native === "."));

  const [integerPart, decimalPart] = parseValue.split(",");
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );
  const formattedDecimalPart = decimalPart
    ? "," + decimalPart.substring(0, 2)
    : isComma
    ? ","
    : "";

  return formattedIntegerPart + formattedDecimalPart;
};

export const formatNumberValueToString = (number: Number): string => {
  if (typeof number != "number") {
    return "0,00";
  }
  
  return number.toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatNumberStringToNumber = (numberStr: string): number => {
  if (typeof numberStr !== "string") return 0;
  return parseFloat(numberStr.replace(/\./g, "").replace(/,/g, ".")) || 0;
};

// Format Only Number
export const formatStringOnlyNumber = (value: any): string => {
  if (!value) return "";
  const regex: RegExp = /^\d+$/;

  const str: string = typeof value === "string" ? value : value.toString();
  return str.replaceAll(regex, "");
};

// Format UpperCase
export const formatUpperCase = (value: string): string => {
  const res = (value || "").toUpperCase();
  return (value || "").toUpperCase();
};

export const formatNoSpace = (value: string): string => {
  return (value || "").replaceAll(" ", "");
};

export const formatUppercaseAndNoSpace = (value: string): string => {
  return formatUpperCase(formatNoSpace(value));
};

export const formatOnlyNumberAndNoSpace = (value: string): string => {
  return formatStringOnlyNumber(formatNoSpace(value));
};
