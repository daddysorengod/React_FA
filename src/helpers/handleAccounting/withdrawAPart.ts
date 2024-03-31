export const WITHDRAW_A_PART = [
  {
    data: {
      debitFullname: "1121",
      debitAccountNumber: "Tiền Việt Nam",
      description: "Giá trị gốc rút",
      creditAccountNumber: "12100505",
      creditFullname:
        "Giá mua - Công cụ thị trường tiền tệ - Tiền gửi có kỳ hạn cố định",
      amountConvert: 0,
    },
    formula: "PRINCIPAL_WITHDRAW",
    dependency: "",
  },
  {
    data: {
      debitFullname: "1121",
      debitAccountNumber: "Tiền Việt Nam",
      description: "Lãi thực nhận",
      creditAccountNumber: "1321505",
      creditFullname: "Dự thu tiền lãi - Tiền gửi có kỳ hạn cố định",
      amountConvert: 0,
    },
    formula: "(TOTAL_AMOUNT - PRINCIPAL_WITHDRAW) * IS_ACCRUAL",
    dependency: "RESULT > 0",
  },
  {
    data: {
      debitFullname: "1121",
      debitAccountNumber: "Tiền Việt Nam",
      description: "Lãi thực nhận",
      creditAccountNumber: "51520505",
      creditFullname:
        "Doanh thu tiền lãi phát sinh trong kỳ - Tiền gửi có kỳ hạn cố định",
      amountConvert: 0,
    },
    formula: "(TOTAL_AMOUNT - PRINCIPAL_WITHDRAW) * IS_NOT_ACCRUAL",
    dependency: "RESULT > 0",
  },
  {
    data: {
      debitFullname: "51520505",
      debitAccountNumber:
        "Doanh thu tiền lãi phát sinh trong kỳ - Tiền gửi có kỳ hạn cố định",
      description: "Lãi thoái thu",
      creditAccountNumber: "1321505",
      creditFullname: "Dự thu tiền lãi - Tiền gửi có kỳ hạn cố định",
      amountConvert: 0,
    },
    formula:
      "PRINCIPAL_WITHDRAW * RATE / DAYS_OF_YEAR * (NUMBER_OF_VALUE_DAYS + INCLUDE_FROM_DATE) - (TOTAL_AMOUNT - PRINCIPAL_WITHDRAW)",
    dependency: "RESULT > 0",
  },
  {
    data: {
      debitFullname: "1321505",
      debitAccountNumber: "Dự thu tiền lãi - Tiền gửi có kỳ hạn cố định",
      description: "Lãi thu thêm",
      creditAccountNumber: "51520505",
      creditFullname:
        "Doanh thu tiền lãi phát sinh trong kỳ - Tiền gửi có kỳ hạn cố định",
      amountConvert: 0,
    },
    formula:
      "(PRINCIPAL_WITHDRAW * RATE) / (DAYS_OF_YEAR * (NUMBER_OF_VALUE_DAYS + INCLUDE_FROM_DATE)) - (TOTAL_AMOUNT - PRINCIPAL_WITHDRAW)",
    dependency: "RESULT < 0",
  },
];
