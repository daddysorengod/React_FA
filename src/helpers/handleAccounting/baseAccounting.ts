import { AccountingApi, EAcounting } from "./enumAccounting";
import { WITHDRAW_A_PART } from "./withdrawAPart";

export const evaluateExpression = (expression, variables) => {
  try {
    const evalFunction = new Function(
      ...Object.keys(variables),
      `return ${expression}`,
    );

    const result = evalFunction(...Object.values(variables));

    return isNaN(result) ? 0 : result;
  } catch (error) {
    return null;
  }
};

export const handleAccounting = (clauseRules, data) => {
  try {
    let validResults: any = [];
    clauseRules.forEach(rule => {
      const calculateValue = evaluateExpression(rule.formula, data);
      if (calculateValue === null) {
        return;
      }
      if (rule.dependency) {
        const getValidDepend = evaluateExpression(rule.dependency, {
          RESULT: calculateValue,
        });
        if (getValidDepend) {
          const accountingResult = {
            ...rule.data,
            totalAmount: formatValidNumber(calculateValue),
          };
          validResults.push(accountingResult);
        }
      } else {
        const accountingResult = {
          ...rule.data,
          totalAmount: formatValidNumber(calculateValue),
        };
        validResults.push(accountingResult);
      }
    });
    return validResults;
  } catch (error) {}
};

export const getFormulaAccounting = async (name, accountingData) => {
  try {
    if (!name) {
      return;
    }
    switch (name) {
      case EAcounting.INVESTMENT_WITHDRAW_A_PART: {
        return handleAccounting(WITHDRAW_A_PART, accountingData);
      }
      default:
        return;
    }
  } catch (error) {
    return;
  }
};

export const getAccountingVariable = (name, accountingData) => {
  try {
    if (!name) {
      return;
    }
    switch (name) {
      case EAcounting.INVESTMENT_WITHDRAW_A_PART: {
        return {
          depositContractId: accountingData?.depositContractId,
          principalAmount: accountingData?.principalAmount,
          totalAmount: accountingData?.totalAmount,
          paymentMethod: accountingData?.paymentMethod,
          newPrincipal: accountingData?.newPrincipal,
        };
      }
      default:
        return;
    }
  } catch (error) {
    return;
  }
};

const formatValidNumber = (value: number) => {
  if (!value || typeof value !== "number") {
    return 0;
  }
  if (isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return -value;
  } else {
    return value;
  }
};
