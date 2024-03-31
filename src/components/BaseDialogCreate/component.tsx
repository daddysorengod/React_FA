import React from "react";
import { Box, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forms-tab-tabpanel-${index}`}
      aria-labelledby={`forms-tab-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0, height: "100%" }}>{children}</Box>}
    </div>
  );
};
export const tabApplyProps = (index: number) => {
  return {
    id: `forms-tab--${index}`,
    sx:{
      textTransform: 'none',
    }
    // "aria-controls": `forms-tab-tabpanel-${index}`,
  };
};

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
