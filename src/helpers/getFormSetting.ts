import { useEffect } from "react";
import { dispatch } from "../store";
import { getListFormConfigFromCodesSingleScreen } from "../store/reducers/formBuilder";

interface IUseMapFormToState {
  listFormCode?: string[];
  dependencies: any[];
}

export const useMapFormToState = async ({
  listFormCode,
  dependencies,
}: IUseMapFormToState) => {
  try {
    useEffect(() => {
    //   console.log("useMapFormToState --- mounting", listFormCode);
      dispatch(getListFormConfigFromCodesSingleScreen(listFormCode));
    }, dependencies);
  } catch (error) {
    console.log("useMapFormToState --- err: ", error);
  }
};
