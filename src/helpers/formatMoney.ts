import { formatNumber } from "./dynamic-table";

export function scientificToDecimal(num: any) {
  try {
    // num = String(num).replace(/\,/g, "");
    num = String(num).replace(/\./g, "");
    const sign = Math.sign(num);
    // if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    if (/\d+\,?\d*e[\+\-]*\d+/i.test(num)) {
      const zero = "0";
      const parts = String(num).toLowerCase().split("e");
      const e = parts.pop() as any;
      let l = Math.abs(e);
      const direction = e / l;
      // const coeff_array = parts[0].split(".");
      const coeff_array = parts[0].split(",");

      if (direction === -1) {
        coeff_array[0] = Math.abs(Number(coeff_array[0])).toString();
        // num = zero + "." + new Array(l).join(zero) + coeff_array.join("");
        num = zero + "," + new Array(l).join(zero) + coeff_array.join("");
      } else {
        const dec = coeff_array[1];
        if (dec) l = l - dec.length;
        num = coeff_array.join("") + new Array(l + 1).join(zero);
      }
    }

    if (sign < 0) {
      num = -num;
    }

    return num;
  } catch (err) {
    console.log("err", err);
    return 0;
  }
}

export const formatMoney = (
  value: any,

  options?: Partial<{
    negative: boolean;
    decimal?: number;
    offFormat?: boolean;
  }>,
) => {
  if (value == undefined || value === "") {
    return "";
  }
  if (value === 0) {
    return 0;
  }
  if (options?.offFormat) {
    return value;
  }
  // value = String(value).replace(/\s/g, "");
  if (options?.negative) {
    value = scientificToDecimal(value);
  }

  // var x = value.toString().split(".");
  // var result = x[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  // const replaceComma = Number(result.replace(/\,/g, ""));
  // const replaceNumberZero = String(replaceComma).replace(
  //   /\B(?=(?:\d{3})+(?!\d))/g,
  //   ",",
  // );
  var x;
  if (typeof value === "string") {
    x = value.toString().replace(/\s/g, "").split(",");
  } else {
    x = value.toString().split(".");
  }
  // var x = value.toString().split(",");
  var result = x[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ".");
  const replaceComma = Number(result.replace(/\./g, ""));
  const replaceNumberZero = String(replaceComma).replace(
    /\B(?=(?:\d{3})+(?!\d))/g,
    ".",
  );

  if (x.length > 1) {
    if (options?.decimal && x[1].length > options?.decimal) {
      const cutWithDecimal = x[1].slice(0, options?.decimal);
      // if (!x[0]) {
      //   return "0" + "." + cutWithDecimal;
      // } else return replaceNumberZero + "." + cutWithDecimal;
      if (!x[0]) {
        return "0" + "," + cutWithDecimal;
      } else return replaceNumberZero + "," + cutWithDecimal;
    } else {
      if (!x[0]) {
        //   return "0" + "." + x[1];
        // } else return replaceNumberZero + "." + x[1];
        return "0" + "," + x[1];
      } else return replaceNumberZero + "," + x[1];
    }
  }
  return replaceNumberZero;
};

export const formatNumberStringToNumber = (
  numberStr: string | number,
): Number => {
  try {
    if (numberStr && typeof numberStr === "string") {
      return parseFloat(numberStr.replace(/\./g, "").replace(/,/g, "."));
    } else if (numberStr && typeof numberStr === "number") {
      return numberStr ? Number(numberStr) : 0;
    } else return 0;
  } catch (error) {
    return 0;
  }
};

export const isValidMoney = (value: string): boolean => {
  if (value) {
    return /^[\d,.]+$/.test(value);
  }
  return true;
};

export const formatNumberV2 = (x?: string | number) => {
  try {
    if (!x) {
      return "0";
    }
    let numberCommand = x.toString().replace(".", ",");
    return Number(numberCommand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  } catch (error) {
    return 0 
  }
};

export const formatMoneyV2 = (
  value: any,

  options?: Partial<{
    negative: boolean;
    decimal?: number;
    offFormat?: boolean;
  }>,
) => {
  return formatNumber(scientificToDecimal(value));
};
