export const generateSubRowsArray = (listData: any[]): any[] => {
  let result: any[] = [];

  listData.forEach(obj => {
    const subRows = obj.subRows;
    let newObj = { ...obj };
    newObj.subRows = null;
    result.push(newObj);

    if (subRows && Array.isArray(subRows) && subRows.length > 0) {
      const subObjects = generateSubRowsArray(subRows);
      result = result.concat(subObjects);
    }
  });

  return result;
};
