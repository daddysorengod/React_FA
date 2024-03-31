import { pages } from "../layouts/SidebarWrapper/pages";
// import { getSearchTermInArray } from "./getQueryURL";

export const getValidRouter = (parentRouter: string, childRouter: string) => {
  const menuItem = pages?.children
    ?.find(parent => parent.search === parentRouter)
    ?.children?.find(child => child.search === childRouter);
  if (menuItem?.title) {
    return { pageTitle: menuItem?.title };
  }
  return { pageTitle: "" };
};

export const getFormConfig = (parentRouter: string, childRouter) => {
  let formCodes;
  const parentMenu = pages?.children?.find(
    parent => parent.search === parentRouter,
  );
  if (parentMenu?.search) {
    formCodes = parentMenu?.dialogCode;
  }
  return formCodes;
};

export const getFormConfigByRoute = (url: string) => {
  try {
    let formCodes;
    const directRoute = url.split("/");
    const parentMenu = pages?.children
      ?.find(parent => parent.search === directRoute[1])
      ?.children?.find(screen => screen?.url === url);
    formCodes = parentMenu?.dialogCode;
    return formCodes;
  } catch (error) {
    return [];
  }
};
