import EnumBase from "@app/utils/enums/enumBase/enumBase";

export enum StatusFaOptions {
    // Confirm = "Confirm",
    NOT_APPROVED = "1",
    Reopen = "4",
    Approved = "2",
    Reject = "3",
}
export default class CommonStatusFaOption extends EnumBase {
  // static Confirm = this._initEnum(StatusFaOptions.Confirm, "Confirm");
  static NOT_APPROVED = this._initEnum(StatusFaOptions.NOT_APPROVED, "Chưa duyệt");
  static Reopen = this._initEnum(StatusFaOptions.Reopen, "Re-open");
  static Approved = this._initEnum(StatusFaOptions.Approved, "Duyệt");
  static Reject = this._initEnum(StatusFaOptions.Reject, "Từ chối");
}
