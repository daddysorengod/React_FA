import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useStyles } from "../../../BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Checkbox, Grid, Tooltip } from "@mui/material";
import {
  ON_DAY_OFF_OPTION_VALUE,
  ON_END_OF_MONTH_OPTIONS,
  TIME_CYCLE_OPTION_VALUE,
  listDayofMonth,
  listDayofWeek,
  listMonthOfQuater,
  onDayOffOptionsAPIUrl,
  timeCycleOptionsAPIUrl,
} from "./constants";
import { getValidationStartTime } from "./helpers";
import { VALIDATION_ERROR_INTERFACE, VALIDATION_INTERFACE } from "@/src/types";
import { getItemById, getListDataBase, getValidateInfo } from "@/src/helpers";
/// import store
import { dispatch } from "@store/store";
import { insertOrUpdateRecord } from "@/src/store/reducers/general";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
/// end import store

interface Props {
  onlyShow: boolean;
  parentId?: string;
}

const fieldLabels = {
  timeCycle: "Chu kỳ",
  onEndOfMonth: "Chốt NAV cuối tháng",
  startDate: "Ngày bắt đầu sinh lịch NAV",
  onDayOff: "Nếu NAV rơi vào ngày nghỉ",
  listMonthOfQuaterValue: "Tháng trong quý",
  listDayInMonthValue: "Ngày trong tháng",
  listDayInWeekValue: "Ngày trong tuần",
};

const validationConfig: {
  [key: string]: VALIDATION_INTERFACE;
} = {
  timeCycle: {
    requiredValidate: true,
  },
  onEndOfMonth: {
    requiredValidate: true,
  },
  startDate: {
    requiredValidate: true,
  },
  onDayOff: {
    requiredValidate: true,
  },
  listMonthOfQuaterValue: {
    requiredValidate: true,
  },
  listDayInMonthValue: {
    requiredValidate: true,
  },
  listDayInWeekValue: {
    requiredValidate: true,
  },
};
const NAVCycleComponent = forwardRef((props: Props, ref: any): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { onlyShow, parentId } = props;
  const handleSubmitForm = useRef() as any;
  // Data submit
  const [timeCycle, setTimeCycle] = useState<any>("");
  const [onEndOfMonth, setOnEndOfMonth] = useState<any>("");
  const [startDate, setStartTime] = useState<any>(null);
  const [onDayOff, setOnDayOff] = useState<any>("");
  const [listMonthOfQuaterValue, setListMonthOfQuaterValue] = useState<
    number[]
  >([]);
  const [listDayInMonthValue, setListDayInMonthValue] = useState<number[]>([]);
  const [listDayInWeekValue, setListDayInWeekValue] = useState<number[]>([]);
  const [listDayInWeekEveryDay, setListDayInWeekEveryDay] = useState<number[]>([1,2,3,4,7]);
  // ---------

  // List option select
  const [timeCycleOptions, setTimeCycleOptions] = useState<any[]>([]);
  const [onEndOfMonthOptions, setOnEndOfMonthOptions] = useState<any[]>([
    ON_END_OF_MONTH_OPTIONS.YES,
    ON_END_OF_MONTH_OPTIONS.NO,
  ]);
  const [onDayOffOptions, setOnDayOffOptions] = useState<any[]>([]);
  // ---------

  // Validation error
  const [validationErrors, setValidationErrors] = useState<any>({
    timeCycle: "",
    onEndOfMonth: "",
    startDate: "",
    onDayOff: "",
    listMonthOfQuaterValue: "",
    listDayInMonthValue: "",
    listDayInWeekValue: "",
  });

  const [navRecord, setNavRecord] = useState<any>({});

  // Get Data Here <=========
  const getFormData = () => {
    if (navRecord?.timeCycle) {
      setTimeCycle(navRecord.timeCycle);
    }
    if (
      navRecord?.onEndOfMonth &&
      typeof navRecord.onEndOfMonth === "boolean"
    ) {
      setOnEndOfMonth(
        navRecord.onEndOfMonth
          ? ON_END_OF_MONTH_OPTIONS.YES.cdVal
          : ON_END_OF_MONTH_OPTIONS.NO.cdVal,
      );
    }

    if (navRecord?.onDayOff) {
      setOnDayOff(navRecord.onDayOff);
    }

    setStartTime(navRecord?.startDate || "");

    if (navRecord?.timeNav?.monthQuarterIndex) {
      setListMonthOfQuaterValue(navRecord?.timeNav.monthQuarterIndex);
    }
    
    if (navRecord?.timeNav?.dayIndex) {
      if (navRecord?.timeCycle == TIME_CYCLE_OPTION_VALUE.BY_WEEK) {
        setListDayInWeekValue(navRecord.timeNav.dayIndex);
      } else if (navRecord?.timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY) {
        setListDayInWeekEveryDay([1,2,3,4,7]);
      }
       else {
        setListDayInMonthValue(navRecord.timeNav.dayIndex);
      }
    }
  };

  // Submit Here <==========
  const generateSubmitForm = async () => {
    if (handleValidateAll()) {
      const submitData = {
        timeCycle: timeCycle,
        onEndOfMonth: onEndOfMonth === "1",
        startDate: startDate,
        onDayOff: onDayOff,
        timeNav: {
          monthQuarterIndex:
            timeCycle == TIME_CYCLE_OPTION_VALUE.BY_QUATER
              ? listMonthOfQuaterValue
              : [],
          dayIndex:
            timeCycle == TIME_CYCLE_OPTION_VALUE.BY_WEEK
              ? listDayInWeekValue
              : timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY
              ? listDayInWeekEveryDay
              : listDayInMonthValue,
        },
        navSystemTasks: [],
        id: navRecord?.id || null,
        fundId: parentId || null,
      };

      const response = await dispatch(
        insertOrUpdateRecord({
          url: "fund-nav-config-api/add-or-update-record",
          params: submitData,
        }),
      );
      if (response) {
        return true;
      }
      return false;
    } else return false;
  };

  // Function
  const getNAVRecord = async () => {
    try {
      if (!parentId) {
        return;
      }

      const navSource = await getItemById(
        parentId,
        "fund-nav-config-api/find-by-id",
        "fundId",
      );
      if (navSource) {
        setNavRecord(navSource);
        if (navSource?.timeCycle) {
          setTimeCycle(navSource.timeCycle);
        }

        if (
          Object.keys(navSource)?.includes("onEndOfMonth") &&
          typeof navSource.onEndOfMonth === "boolean"
        ) {
          setOnEndOfMonth(
            navSource.onEndOfMonth
              ? ON_END_OF_MONTH_OPTIONS.YES.cdVal
              : ON_END_OF_MONTH_OPTIONS.NO.cdVal,
          );
        }

        if (navSource?.onDayOff) {
          setOnDayOff(navSource.onDayOff);
        }

        setStartTime(navSource?.startDate || "");

        if (navSource?.timeNav?.monthQuarterIndex) {
          setListMonthOfQuaterValue(navSource?.timeNav.monthQuarterIndex);
        }
        if (navSource?.timeNav?.dayIndex) {
          if (navSource.timeCycle == TIME_CYCLE_OPTION_VALUE.BY_WEEK) {
            setListDayInWeekValue(navSource.timeNav.dayIndex);
          } else if (navSource?.timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY) {
            setListDayInWeekEveryDay(navSource.timeNav.dayIndex);
          } else {
            setListDayInMonthValue(navSource.timeNav.dayIndex);
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getTimeCycleOptions = async () => {
    try {
      const res = await getListDataBase({ url: timeCycleOptionsAPIUrl });
      if (res.source) {
        setTimeCycleOptions(res.source);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getOnDayOffOptions = async () => {
    try {
      const res = await getListDataBase({ url: onDayOffOptionsAPIUrl });
      if (res.source) {
        setOnDayOffOptions(res.source);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getMonthOfQuaterCheckboxProps = value => {
    return {
      disabled:
        (!listMonthOfQuaterValue.includes(value) &&
          listMonthOfQuaterValue.length === 2) ||
        onlyShow,
      checked: listMonthOfQuaterValue.includes(value),
    };
  };

  const handleMonthOfQuaterCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemValue: number,
  ) => {
    if (event.target.checked) {
      if (!listMonthOfQuaterValue.includes(itemValue)) {
        setListMonthOfQuaterValue([...listMonthOfQuaterValue, itemValue]);
      }
    } else {
      if (listMonthOfQuaterValue.includes(itemValue)) {
        const indexToRemove = listMonthOfQuaterValue.findIndex(
          ele => ele === itemValue,
        );
        if (indexToRemove !== -1) {
          setListMonthOfQuaterValue([
            ...listMonthOfQuaterValue.slice(0, indexToRemove),
            ...listMonthOfQuaterValue.slice(indexToRemove + 1),
          ]);
        }
      }
    }
  };

  const handleDayInMonthCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemValue: number,
  ) => {
    if (event.target.checked) {
      if (!listDayInMonthValue.includes(itemValue)) {
        setListDayInMonthValue([...listDayInMonthValue, itemValue]);
      }
    } else {
      if (listDayInMonthValue.includes(itemValue)) {
        const indexToRemove = listDayInMonthValue.findIndex(
          ele => ele === itemValue,
        );
        if (indexToRemove !== -1) {
          setListDayInMonthValue([
            ...listDayInMonthValue.slice(0, indexToRemove),
            ...listDayInMonthValue.slice(indexToRemove + 1),
          ]);
        }
      }
    }
  };

  const handleDayInWeekCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemValue: number,
  ) => {
    if (event.target.checked) {
      if (!listDayInWeekValue.includes(itemValue)) {
        setListDayInWeekValue([...listDayInWeekValue, itemValue]);
      }
    } else {
      if (listDayInWeekValue.includes(itemValue)) {
        const indexToRemove = listDayInWeekValue.findIndex(
          ele => ele === itemValue,
        );
        if (indexToRemove !== -1) {
          setListDayInWeekValue([
            ...listDayInWeekValue.slice(0, indexToRemove),
            ...listDayInWeekValue.slice(indexToRemove + 1),
          ]);
        }
      }
    }
  };

  const handleDayInWeekEveryDayCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemValue: number,
  ) => {
    if (event.target.checked) {
      if (!listDayInWeekEveryDay.includes(itemValue)) {
        setListDayInWeekEveryDay([...listDayInWeekEveryDay, itemValue]);
      }
    } else {
      if (listDayInWeekEveryDay.includes(itemValue)) {
        const indexToRemove = listDayInWeekEveryDay.findIndex(
          ele => ele === itemValue,
        );
        if (indexToRemove !== -1) {
          setListDayInWeekEveryDay([
            ...listDayInWeekEveryDay.slice(0, indexToRemove),
            ...listDayInWeekEveryDay.slice(indexToRemove + 1),
          ]);
        }
      }
    }
  };

  const handleTimeCycleChange = (value: any) => {
    setTimeCycle(value);
    handleValidateTimeCycle(value);
  };

  const handleOnEndOfMonthChange = (value: any) => {
    setOnEndOfMonth(value);
    handleValidateOnEndOfMonth(value);
  };

  const handleStartTimeChange = (newValue: any) => {
    setStartTime(newValue);
    const validation = getValidationStartTime(newValue);
    setValidationErrors({
      ...validationErrors,
      startDate: validation,
    });
  };

  const handleOnDayOffChange = (value: any) => {
    setOnDayOff(value);
    handleValidateOnDayOff(value);
  };

  // VALIDATION
  const handleValidateAll = (): boolean => {
    let validation = validationErrors;
    let valid = true;

    const obj = {
      timeCycle,
      onEndOfMonth,
      startDate,
      onDayOff,
      listDayInWeekValue,
      listDayInMonthValue,
      listMonthOfQuaterValue,
    };

    for (const key in fieldLabels) {
      if (validationConfig[key]) {
        if (
          timeCycle &&
          ((key === "listMonthOfQuaterValue" &&
            timeCycle !== TIME_CYCLE_OPTION_VALUE.BY_QUATER) ||
            (key === "listDayInWeekValue" &&
              timeCycle !== TIME_CYCLE_OPTION_VALUE.BY_WEEK) ||
            (key === "listDayInMonthValue" &&
              ![
                TIME_CYCLE_OPTION_VALUE.BY_QUATER,
                TIME_CYCLE_OPTION_VALUE.BY_MONTH,
              ].includes(timeCycle)))
        ) {
          continue;
        }
        const info: VALIDATION_ERROR_INTERFACE = getValidateInfo(
          obj[key],
          fieldLabels[key],
          validationConfig[key],
        );
        if (info.error) {
          validation[key] = info.errorMessage;
          valid = false;
        }
      }
    }
    setValidationErrors({ ...validation });
    return valid;
  };

  const handleValidateField = (
    value: any,
    key: string,
  ): VALIDATION_ERROR_INTERFACE => {
    if (validationConfig[key] && fieldLabels[key]) {
      const info = getValidateInfo(
        value,
        fieldLabels[key],
        validationConfig[key],
      );
      setValidationErrors({
        ...validationErrors,
        [key]: info.errorMessage,
      });
      return info;
    }
    return {
      error: false,
      errorMessage: "",
    };
  };

  const handleValidateTimeCycle = (value: any): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "timeCycle");
  };

  const handleValidateOnEndOfMonth = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "onEndOfMonth");
  };

  const handleValidateStartTime = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "startDate");
  };

  const handleValidateOnDayOff = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "onDayOff");
  };

  const handleValidateListMonthOfQuaterValue = (
    value,
  ): VALIDATION_ERROR_INTERFACE => {
    return timeCycle == TIME_CYCLE_OPTION_VALUE.BY_QUATER
      ? handleValidateField(value, "listMonthOfQuaterValue")
      : {
          error: false,
          errorMessage: "",
        };
  };

  const handleValidateListDayInMonthValue = (
    value,
  ): VALIDATION_ERROR_INTERFACE => {
    return [
      TIME_CYCLE_OPTION_VALUE.BY_QUATER,
      TIME_CYCLE_OPTION_VALUE.BY_MONTH,
    ].includes(timeCycle)
      ? handleValidateField(value, "listDayInMonthValue")
      : {
          error: false,
          errorMessage: "",
        };
  };

  const handleValidateListDayInWeekValue = (
    value,
  ): VALIDATION_ERROR_INTERFACE => {
    return timeCycle == TIME_CYCLE_OPTION_VALUE.BY_WEEK
      ? handleValidateField(value, "listDayInWeekValue")
      : {
          error: false,
          errorMessage: "",
        };
  };

  // Validate onChange
  useEffect(() => {
    handleValidateListDayInWeekValue(listDayInWeekValue);
  }, [listDayInWeekValue]);

  useEffect(() => {
    handleValidateListDayInMonthValue(listDayInMonthValue);
  }, [listDayInMonthValue]);

  useEffect(() => {
    handleValidateListMonthOfQuaterValue(listMonthOfQuaterValue);
  }, [listMonthOfQuaterValue]);
  // END VALIDATION ------------------

  useEffect(() => {
    const fetchData = async () => {
      await getOnDayOffOptions();
      await getTimeCycleOptions();
      await getNAVRecord();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getFormData();
    };
    fetchData();
  }, [onDayOffOptions, timeCycleOptions]);

  useEffect(() => {
    if (timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY) {
      setOnEndOfMonth(ON_END_OF_MONTH_OPTIONS.YES.cdVal);
      const item = onDayOffOptions.find(
        ele => ele.cdVal == ON_DAY_OFF_OPTION_VALUE.SKIP,
      );
      if (item) {
        setOnDayOff(item.cdVal);
      }
      setValidationErrors({
        ...validationErrors,
        onEndOfMonth: "",
        onDayOff: "",
      });
    }
  }, [timeCycle]);

  useImperativeHandle(ref, () => ({
    async onSubmitRef() {
      const payload = await generateSubmitForm();
      if (payload) {
        return payload;
      }
      return false;
    },
    async onSaveValueRef() {
      const payload = await onSaveValue();
      if (payload) {
        return payload;
      }
      return null;
    },
    handleUnFocus() {
      // setFormErrors({});
    },
  }));

  const onSaveValue = async () => {
    return false;
  };

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.title}>{"Chu kì chốt NAV"}</Box>
        <Box className={classes.form}>
          <Box className={classes.topForm}>
            <Grid container columns={12} columnSpacing={4}>
              <Grid item md={2}>
                <BaseAutocomplete
                  label={fieldLabels.timeCycle}
                  required={true}
                  options={timeCycleOptions || []}
                  value={timeCycle}
                  onChange={handleTimeCycleChange}
                  onBlur={() => {
                    handleValidateTimeCycle(timeCycle);
                  }}
                  valueKey={"cdVal"}
                  labelKey={"vnCdContent"}
                  fullWidth
                  disabled={onlyShow}
                  error={!!validationErrors.timeCycle}
                  errorMessage={validationErrors.timeCycle}
                />
              </Grid>
              <Grid item md={2}>
                <BaseAutocomplete
                  label={fieldLabels.onEndOfMonth}
                  required={true}
                  options={onEndOfMonthOptions}
                  value={onEndOfMonth}
                  onChange={handleOnEndOfMonthChange}
                  onBlur={() => {
                    handleValidateOnEndOfMonth(onEndOfMonth);
                  }}
                  valueKey={"cdVal"}
                  labelKey={"vnCdContent"}
                  fullWidth
                  disabled={
                    timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY || onlyShow
                  }
                  error={!!validationErrors.onEndOfMonth}
                  errorMessage={validationErrors.onEndOfMonth}
                />
              </Grid>
              <Grid item md={2}>
                <label className={classes.requiredInputLabel}>
                  {fieldLabels.startDate}
                </label>
                <BaseDatePickerInput
                  value={startDate}
                  onChange={handleStartTimeChange}
                  onBlur={() => {}}
                  error={!!validationErrors.startDate}
                  errorMessage={validationErrors.startDate}
                  disabled={onlyShow}
                />
              </Grid>
              <Grid item md={2}>
                <BaseAutocomplete
                  label={fieldLabels.onDayOff}
                  required={true}
                  options={onDayOffOptions || []}
                  value={onDayOff}
                  onChange={handleOnDayOffChange}
                  onBlur={() => {
                    handleValidateOnDayOff(onDayOff);
                  }}
                  valueKey={"cdVal"}
                  labelKey={"vnCdContent"}
                  fullWidth
                  disabled={
                    timeCycle == TIME_CYCLE_OPTION_VALUE.BY_DAY || onlyShow
                  }
                  error={!!validationErrors.onDayOff}
                  errorMessage={validationErrors.onDayOff}
                />
              </Grid>
            </Grid>
          </Box>
          {timeCycle === TIME_CYCLE_OPTION_VALUE.BY_WEEK ? (
            <Box className={classes.formSelectMonth}>
              <Box>
                <span className={classes.requiredLabel}>
                  {fieldLabels.listDayInWeekValue}
                </span>
                {validationErrors.listDayInWeekValue ? (
                  <Tooltip
                    arrow
                    placement="bottom-end"
                    title={validationErrors.listDayInWeekValue}
                  >
                    <img src="/svg/error_icon.svg" />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Box>
              <Grid container columns={12}>
                {listDayofWeek.map((item, idx) => (
                  <Grid item md={1} key={idx} className={classes.checkBox}>
                    <Checkbox
                      id={`listDayofWeek-${item.value}`}
                      checked={listDayInWeekValue.includes(item.value)}
                      onChange={event => {
                        handleDayInWeekCheckBoxChange(event, item.value);
                      }}
                      disabled={onlyShow}
                    />
                    <label htmlFor={`listDayofWeek-${item.value}`}>
                      {item.label}
                    </label>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {timeCycle === TIME_CYCLE_OPTION_VALUE.BY_DAY ? (
            <Box className={classes.formSelectMonth}>
              <Box>
                <span className={classes.requiredLabel}>
                  {fieldLabels.listDayInWeekValue}
                </span>
                {validationErrors.listDayInWeekValue ? (
                  <Tooltip
                    arrow
                    placement="bottom-end"
                    title={validationErrors.listDayInWeekValue}
                  >
                    <img src="/svg/error_icon.svg" />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Box>
              <Grid container columns={12}>
                {listDayofWeek.map((item, idx) => (
                  <Grid item md={1} key={idx} className={classes.checkBox}>
                    <Checkbox
                      id={`listDayofWeek-${item.value}`}
                      checked={listDayInWeekEveryDay.includes(item.value)}
                      onChange={event => {
                        handleDayInWeekEveryDayCheckBoxChange(
                          event,
                          item.value,
                        );
                      }}
                      disabled={onlyShow}
                    />
                    <label htmlFor={`listDayofWeek-${item.value}`}>
                      {item.label}
                    </label>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {timeCycle === TIME_CYCLE_OPTION_VALUE.BY_QUATER ? (
            <Box className={classes.formSelectMonth}>
              <Box>
                <span className={classes.requiredLabel}>
                  {`${fieldLabels.listMonthOfQuaterValue} (tối đa 2 tháng)`}
                </span>
                {validationErrors.listMonthOfQuaterValue ? (
                  <Tooltip
                    arrow
                    placement="bottom-end"
                    title={validationErrors.listMonthOfQuaterValue}
                  >
                    <img src="/svg/error_icon.svg" />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Box>
              <Grid container columns={12}>
                {listMonthOfQuater.map((item, idx) => (
                  <Grid item md={1} key={idx} className={classes.checkBox}>
                    <Checkbox
                      id={`listMonthOfQuater-${item.value}`}
                      {...getMonthOfQuaterCheckboxProps(item.value)}
                      onChange={event => {
                        handleMonthOfQuaterCheckboxChange(event, item.value);
                      }}
                    />
                    <label htmlFor={`listMonthOfQuater-${item.value}`}>
                      {item.label}
                    </label>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {timeCycle &&
          [
            TIME_CYCLE_OPTION_VALUE.BY_MONTH,
            TIME_CYCLE_OPTION_VALUE.BY_QUATER,
          ].includes(timeCycle) ? (
            <Box className={classes.formSelectMonth}>
              <Box>
                <span className={classes.requiredLabel}>
                  {fieldLabels.listDayInMonthValue}
                </span>
                {validationErrors.listDayInMonthValue ? (
                  <Tooltip
                    arrow
                    placement="bottom-end"
                    title={validationErrors.listDayInMonthValue}
                  >
                    <img src="/svg/error_icon.svg" />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Box>
              <Grid container columns={12}>
                {listDayofMonth.map((item, idx) => (
                  <Grid key={idx} item md={1} className={classes.checkBox}>
                    <Checkbox
                      id={`listDayofMonth-${item}`}
                      checked={listDayInMonthValue.includes(item)}
                      onChange={event => {
                        handleDayInMonthCheckBoxChange(event, item);
                      }}
                      disabled={onlyShow}
                    />
                    <label htmlFor={`listDayofMonth-${item}`}>{item}</label>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
});
const NAVCycle = React.memo(NAVCycleComponent);
export { NAVCycle };
