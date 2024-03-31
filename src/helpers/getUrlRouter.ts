import { TABLE_LEVEL_TYPE } from "../constants";

export const addQueryToURL = (queryParams,tableLevel) => {
  try {
    if(tableLevel !==TABLE_LEVEL_TYPE.MAIN){
      return
    }
    const currentURL = window.location.href;
  const url = new URL(currentURL);
  url.searchParams.forEach((value, key) => {
    url.searchParams.delete(key);
  });

  Object.keys(queryParams).forEach(key => {
    url.searchParams.append(key, queryParams[key]);
  });

  window.history.pushState({}, "", url.toString());
  } catch (error) {
    
  }
};

export const removeQueryFromURL = (queryParams,tableLevel) => {
  try {
    if(tableLevel !==TABLE_LEVEL_TYPE.MAIN){
      return
    }
    if(queryParams &&Object.keys(queryParams).length<1){
      return
    }
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    url.searchParams.forEach((value, key) => {
      url.searchParams.delete(key);
    });
    window.history.pushState({}, "", url.toString());
  } catch (error) {
    
  }
};
