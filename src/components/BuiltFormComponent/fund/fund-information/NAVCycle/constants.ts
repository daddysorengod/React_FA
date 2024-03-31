export const listDayofMonth = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export const listDayofWeek = [
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
  { label: "CN", value: 7 },
];

export const listMonthOfQuater = [
  { label: "Tháng thứ 1", value: 1 },
  { label: "Tháng thứ 2", value: 2 },
  { label: "Tháng thứ 3", value: 3 },
];

export enum TIME_CYCLE_OPTION_VALUE {
  BY_QUATER = "1",
  BY_MONTH = "2",
  BY_WEEK = "3",
  BY_DAY = "4",
}

export enum ON_DAY_OFF_OPTION_VALUE {
  SKIP = "1",
  NEXT_DAY = "2",
  NEXT_DAY_SUB_1 = "3",
  PREVIOUS_DAY = "4",
  UNCHANGED = "5",
}

export const ON_END_OF_MONTH_OPTIONS = {
  YES: { vnCdContent: "Có", cdVal: "1" },
  NO: { vnCdContent: "Không", cdVal: "2" },
};

export const timeCycleOptionsAPIUrl =
  "all-code-api/find-by-cd-type?pageIndex=1&pageSize=20&cdType=FUND_INFO&cdName=TIME_CYCLE";

export const onDayOffOptionsAPIUrl =
  "all-code-api/find-by-cd-type?pageIndex=1&pageSize=20&cdType=FUND_INFO&cdName=ON_DAT_OFF";
