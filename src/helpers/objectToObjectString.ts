export const objectToObjectString = (objectJs: any): string => {
  try {
    const result = objectToString(objectJs);
    return `const data = ${result}`;
  } catch (error) {
    console.log(error);
    return "";
  }
};

function objectToString(obj: any) {
  const keys = Object.keys(obj);
  const pairs = keys.map(key => {
    const value = obj[key];
    if (typeof value === "string") {
      return `${key}: "${value}"`;
    } else if (typeof value === "boolean" || typeof value === "number") {
      return `${key}: ${value}`;
    } else if (Array.isArray(value)) {
      return `${key}: [${arrayToString(value)}]`;
    } else if (typeof value === "object") {
      return `${key}: ${objectToString(value)}`;
    }
  });
  return `{${pairs.join(",\n")}}`;
}

function arrayToString(arr: any[]) {
  const values = arr.map(value => {
    if (typeof value === "string") {
      return `"${value}"`;
    } else if (typeof value === "boolean" || typeof value === "number") {
      return value;
    } else if (Array.isArray(value)) {
      return `[${arrayToString(value)}]`;
    } else if (typeof value === "object") {
      return objectToString(value);
    }
  });
  return values.join(",\n");
}
