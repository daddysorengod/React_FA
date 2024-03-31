export const getProperty = (
  object: any,
  property: string,
  defaultResponse?: any,
): any => {
  const propertyChain = property.split(".");

  // Sử dụng try...catch để xử lý trường hợp thuộc tính không tồn tại
  try {
    const result = propertyChain.reduce((obj, prop) => obj[prop], object);
    return result !== undefined ? result : defaultResponse;
  } catch (error) {
    return defaultResponse;
  }
};
