import { useEffect } from "react";
import { DynamicObject, IField } from "@/src/types/field";
import { MRT_ColumnOrderState } from "material-react-table";

interface IStateOrdering {
  ordering?: MRT_ColumnOrderState;
  setOrdering?: React.Dispatch<React.SetStateAction<MRT_ColumnOrderState>>;
}

interface IStateVisible {
  initialVisibleColumns?: DynamicObject;
  setInitialVisibleColumns?: React.Dispatch<
    React.SetStateAction<DynamicObject>
  >;
}

interface IStateMounting {
  isMounting: boolean;
  setIsMounting: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IConfigurationStore {
  ordering: MRT_ColumnOrderState;
  initialVisibleColumns: DynamicObject;
}

export const useConfigurationStorage = async (
  orderingData: IStateOrdering,
  visibleColData: IStateVisible,
  mountingData: IStateMounting,
  saveLocalStorage?: (data: MRT_ColumnOrderState | DynamicObject) => void,
  configureStore?: IConfigurationStore,
) => {
  // let isMounting = 0

  // console.log("isMounting: ", isMounting)
  // isMounting = isMounting + 1
  // console.log("isMounting: ", isMounting)
  // // orderingData.setOrdering()
  useEffect(() => {
    try {
      if (orderingData.setOrdering && configureStore?.ordering) {
        orderingData.setOrdering(configureStore?.ordering);
      }

      if (
        visibleColData.setInitialVisibleColumns &&
        configureStore?.initialVisibleColumns
      ) {
        visibleColData.setInitialVisibleColumns(
          configureStore?.initialVisibleColumns,
        );
      }
      mountingData.setIsMounting(true);
    } catch (err) {}
  }, [orderingData.ordering]);

  useEffect(() => {
    try {
      if (!mountingData?.isMounting) {
        return;
      }
      // console.log("orderingData: ", orderingData?.ordering,)
    } catch (err) {}
  }, [orderingData.ordering]);

  useEffect(() => {
    try {
      if (!mountingData?.isMounting) {
        return;
      }
      // console.log("visibleColData: ", visibleColData?.initialVisibleColumns,)
    } catch (err) {}
  }, [visibleColData.initialVisibleColumns]);
};
