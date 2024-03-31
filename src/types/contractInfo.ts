export interface ContractInfoFieldConfig {
  label: string;
  key: string;
  formatType?: "TEXT" | "DATE" | "NUMBER" | "PERCENT";
  type?: "NORMAL" | "LINE";
}
