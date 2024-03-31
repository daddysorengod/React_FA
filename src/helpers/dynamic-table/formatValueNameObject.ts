interface Obj {
  value: string;
  name: string;
}

export const formatValueNameObject = (obj?: Obj) => {
  return obj?.name || "";
};
