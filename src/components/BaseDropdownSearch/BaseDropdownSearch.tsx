import React, { useEffect, useState } from "react";
import "jquery"; ///
// import $ from "@root/public/plugins/jquery";
import { Autocomplete, TextField } from "@mui/material";
import { useStyles } from "./BaseDropdownSearch.styles";
import { dispatch } from "@/src/store";
import { getListOptionsDropdown } from "@/src/store/reducers/general";

interface Props {
  value: string;
  name: string;
  url: any;
  onChange: (event) => void;
  isDisabled?: boolean;
  fieldIndex: number;
  label: string;
  isRequired: boolean;
}
const DropdownSearch = (props: Props): JSX.Element => {
  const {
    value,
    onChange,
    name,
    url,
    isDisabled,
    fieldIndex,
    label,
    isRequired,
  } = props;
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [value1, setValue1] = React.useState<string | null>();
  const [inputValue, setInputValue] = React.useState("");
  useEffect(() => {
    switch (name) {
      case value:
        break;

      default:
        break;
    }
    getListOptions();
  }, []);
  const getListOptions = async () => {
    const { totalRecords, source, page } = await dispatch(
      getListOptionsDropdown(url),
    );
    if (source && source?.length > 0) {
      setOptions(source);
    }
  };

  return (
    <div>
      <label className={classes.inputLabel}>
        {label}
        {isRequired ? <span style={{ color: "red" }}> *</span> : ""}
      </label>
      <div key={`${name.replace(/\s+/g, "_")}-${fieldIndex}`}>
        <Autocomplete
          value={value}
          onChange={onChange}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          //   onClick={onChange}
          options={options.map((option: any) =>
            option?.vnCdContent ? option?.vnCdContent : option?.text,
          )}
          renderInput={params => (
            <TextField
              {...params}
              label="Search input"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
const BaseDropdownSearch = React.memo(DropdownSearch);
export { BaseDropdownSearch };
