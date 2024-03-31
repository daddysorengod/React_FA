// material-ui
import {
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Autocomplete,
  TextField,
} from "@mui/material";

// assets
import { SearchOutlined } from "@ant-design/icons";
import { useStyles } from "./Search.styles";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
  const classes = useStyles()
  return (
    <Box sx={{ width: "10%", ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: "100%", md: 260 } }} >
        <Autocomplete
          value={
            // profiles.find(
            //   (profile: KanbanProfile) => profile.id === formik.values.assign,
            // ) || null
            "VESAF - VINACAPITAL"
          }
          onChange={(event, value) => {
            // formik.setFieldValue("assign", value?.id);
          }}
          options={[
            "VESAF - VINACAPITAL",
            "VESAF - VINACAPITAL2",
            "VESAF - VINACAPITAL3",
          ]}
          fullWidth
          autoHighlight
          // getOptionLabel={option => option.name}
          // isOptionEqualToValue={option => option.id === formik.values.assign}
          // renderOption={(props, option) => (
          //   <Box
          //     component="li"
          //     sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          //     {...props}
          //   >
          //     {/* <Image
          //       width={20}
          //       height={20}
          //       loading="lazy"
          //       src={`/assets/images/users/${option.avatar}`}
          //       alt=""
          //     /> */}
          //     {option.name}
          //   </Box>
          // )}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Tìm kiếm"
              inputProps={{
                ...params.inputProps,
                autoComplete: "", // disable autocomplete and autofill
                // disableUnderline: true,
                // color: "primary",
              }}
              className={classes.textFieldStyles}
            />
          )}
          className={classes.root}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
