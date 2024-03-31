export const nonNullValuesInObj = (obj: any) => {
  let temp = 0;
  Object.values(obj)?.map(item => {
    if (item !== null && item !== "") {
      temp = temp + 1;
    }
  });

  return temp;
};
