import { Moment } from "moment";
import moment from "moment";
//2023-01-04T17:00:00
export const formatNormalDate = (
  date:
    | Moment
    | Date
    | `${string}/${string}/${string}`
    | `${string}-${string}-${string}T${string}:${string}:${string}`
    | null,
) => {
  if (!date) {
    return "";
  }
  return moment(date).format("DD/MM/YYYY");
};

export const formatParamsDate = (
  date:
    | Moment
    | Date
    | `${string}/${string}/${string}`
    | `${string}-${string}-${string}T${string}:${string}:${string}`
    | null,
) => {
  if (!date) {
    return "";
  } //2023-06-14T03:13:10.742Z YYYY-MM-DDThh:mm:ss.SSS[Z]
  // 2000-11-20T10:24:30
  return moment(date).format("YYYY-MM-DDThh:mm:ss.SSS");
};
