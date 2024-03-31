import React, { useState, useEffect } from "react";
import { useStyles } from "./BaseWorkFollowStatusIcon.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Done as DoneIcon,
  AccessTime as AccessTimeIcon,
  Clear as ClearIcon,
  Block as BlockIcon
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const WORK_FOLLOW_OPTIONS = [
  {
    value: "1",
    label: "Chờ duyệt",
    icon: <AccessTimeIcon sx={{ color: "#FFB80B" }} />,
  },
  {
    value: "2",
    label: "Đã duyệt",
    icon: <DoneIcon sx={{ color: "#04A857" }} />,
  },
  {
    value: "3",
    label: "Hủy",
    icon: <ClearIcon sx={{ color: "#E6544F" }} />,
  },
  {
    value: "4",
    label: "Hủy duyệt",
    icon: <BlockIcon sx={{ color: "#828D9A" }} />,
  },
];

interface Props {
  value: string | number;
}

const BaseWorkFollowStatusIconComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { value } = props;
  const [label, setLabel] = useState<string>("");
  const [icon, setIcon] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const item = WORK_FOLLOW_OPTIONS.find(ele => ele.value == value);
    if (item) {
      setLabel(item.label);
      setIcon(item.icon);
    }
  }, [value]);

  return label ? (
    <Tooltip title={label} arrow>
      {icon}
    </Tooltip>
  ) : (
    <></>
  );
};
const BaseWorkFollowStatusIcon = React.memo(BaseWorkFollowStatusIconComponent);
export { BaseWorkFollowStatusIcon };
