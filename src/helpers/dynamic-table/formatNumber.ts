export const formatNumber = (value: any): string => {
  if (
    value == null ||
    value == undefined ||
    (typeof value !== "string" && typeof value != "number")
  ) {
    return "-";
  }

  let res = (Math.floor(Number(value) * 100) / 100).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (res.endsWith("0")) {
    res = res.replace(/0+$/, "");
  }

  if (res.endsWith(",")) {
    res = res.replace(/,+$/, "");
  }
  
  return res;
};
