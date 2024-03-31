import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./BaseImageFileUpLoad.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import { Upload as UploadIcon, Clear as ClearIcon } from "@mui/icons-material";
import { IFormType } from "@/src/types/general";
import { DynamicObject, IField } from "@/src/types/field";
interface Props {
  label?: string;
  value: File | string;
  fieldName: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  fieldIndex?: any;
  errorField?: string;
  onChange: Function;
  formType?: IFormType;
  fieldSet?: IField
  initialState?: DynamicObject
}
const BaseImageFileUpLoadComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    label,
    isRequired,
    isDisabled,
    value,
    onChange,
    errorField,
    fieldIndex,
    fieldName,
    formType,
    fieldSet,
    initialState
  } = props;

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageType = file.type.split("/")[0];
      if (imageType === "image") {
        onChange(file);
      } else {
        console.warn("Selected file is not an image.");
      }
    }
  };

  const handleClearImage = () => {
    setImageUrl("");
    setImageName("");
    onChange("");
  };

  useEffect(() => {
    if (typeof value === "string") {
      setImageUrl(value)
    } else if (value instanceof File) {
      const imageType = value.type.split("/")[0];
      if (imageType === "image") {
        const imageUrl = URL.createObjectURL(value);
        setImageUrl(imageUrl);
        setImageName(value.name);
      }
    }
  }, [value]);

  return (
    <Box>
      <Box>
        <label className={isRequired ? classes.requiredLabel : classes.label}>
          {label}
        </label>
        {errorField ? (
          <Tooltip arrow placement="bottom-end" title={errorField}>
            <img src="/svg/error_icon.svg" />
          </Tooltip>
        ) : (
          <></>
        )}
      </Box>
      <Box className={classes.root}>
        <Grid
          container
          columns={24}
          columnSpacing={1}
          className={classes.container}
        >
          <Grid item xs={9}>
            <Box className={classes.image}>
              {imageUrl ? (
                <img src={imageUrl} alt="Signature" loading="lazy" />
              ) : (
                <></>
              )}
            </Box>
          </Grid>
          <Grid item xs={15}>
            <Box className={classes.buttonContainer}>
              <Button
                className={classes.button}
                disabled={isDisabled}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <UploadIcon />
                <Box>{"Tải ảnh lên"}</Box>
              </Button>
            </Box>
          </Grid>
        </Grid>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </Box>
      {imageName ? (
        <Grid container columns={12}>
          <Grid item xs={12}>
            <Box className={classes.imageNameContainer}>
              <Box className={classes.imageName}>{imageName}</Box>
              <IconButton
                size="small"
                className={classes.clearImageNameButton}
                onClick={handleClearImage}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Box>
  );
};
const BaseImageFileUpLoad = React.memo(BaseImageFileUpLoadComponent);
export { BaseImageFileUpLoad };
