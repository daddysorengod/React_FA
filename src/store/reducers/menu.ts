import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// project import
import { dispatch, useSelector } from "../store";
import { RootStateProps } from "@app/types/root";
import axios from "@app/helpers/axios";
import { api } from "@/src/constants/api";
// types
import { MenuProps } from "@app/types/menu";

// initial state
const initialState: MenuProps = {
  openItem: [""],
  activeTab: "",
  openComponent: "buttons",
  selectedID: null,
  drawerOpen: true,
  componentDrawerOpen: true,
  menuDashboard: {},
  error: null,
  baseRouteApi: null,
  routeConfig: {
    fetchDataUrl: "find",
    fetchByIdUrl: "find-by-id",
    fetchByManyIdUrl: "find-by-ids",
    insertUpdateUrl: "add-or-update-record",
    insertUpdateManyUrl: "add-or-update-many-records",
    deleteUrl: "delete",
    deleteManyUrl: "delete-many",
    activeDeActiveUrl: "active-or-deactivate-record",
    exportToXlsxFile: "export-to-xlsx-file",
  },
  roleType: "FA",
  isLoading: false,
};

// ==============================|| SLICE - MENU ||============================== //

export const fetchDashboard = createAsyncThunk("", async () => {
  // const response = await axios.get('/api/dashboard');
  // return response.data;
});

const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    activeID(state, action) {
      state.selectedID = action.payload;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    getMenuSuccess(state, action) {
      state.menuDashboard = action.payload;
    },

    hasError(state, action) {
      state.error = action.payload;
    },
    setBaseRouteApi(state, action) {
      state.baseRouteApi = action.payload;
    },
    setRoleType(state, action) {
      if (typeof action.payload === typeof state.roleType) {
        state.roleType = action.payload;
      }
    },
    setIsLoading(state, action) {
      if (typeof action.payload !== "boolean") {
        state.isLoading = false;
        return;
      }
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      // state.menuDashboard = action.payload.dashboard;
    });
  },
});

export default menu.reducer;

export const {
  activeItem,
  activeComponent,
  openDrawer,
  openComponentDrawer,
  activeID,
  setRoleType,
  setIsLoading,
} = menu.actions;

export function setBaseRouteApiReducer(params) {
  return async () => {
    try {
      if (params) {
        dispatch(menu.actions.setBaseRouteApi(params));
        return;
      }
      dispatch(menu.actions.setBaseRouteApi(""));
    } catch (err) {
      console.log(err);
    }
  };
}
