interface Obj {
  value: string;
  name: string;
}

export const formatOrganizeProviderRoles = (listRoles: Obj[]) => {
  if (listRoles.length == 0) return "";
  let arr: string[] = [];
  listRoles.forEach(ele => {
    if (!arr.includes(ele.name)) {
      arr.push(ele.name);
    }
  });

  return arr.join(", ");
};
