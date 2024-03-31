// third-party
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// project import
import formBuilder from "./formBuilder";
import menu from "./menu";
import auth from "./auth";
import snackbar from "./snackbar";
import general from "./general";
import tableConfig from "./tableConfig";
import tableSelectOptions from "./tableSelectOptions";
import allCodeConfig from "./allCodeConfig";


const AUTH_PREFIX = "QVVUSF9QUkVGSVg=";
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  formBuilder,
  menu,
  auth: persistReducer(
    {
      key: "auth",
      storage,
      keyPrefix: AUTH_PREFIX,
    },
    auth,
  ),
  snackbar,
  general,
  tableConfig,
  tableSelectOptions,
  allCodeConfig
});

export default reducers;
