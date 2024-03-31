import { TextFieldType } from "@/src/types/field";
import EnumBase from "@app/utils/enums/enumBase/enumBase";

export default class CommonFieldTypeOptions extends EnumBase {
  static textBox = this._initEnum(TextFieldType.textBox, "Text box");
  static selectOption = this._initEnum(
    TextFieldType.selectOption,
    "Select options",
  );
  static checkbox = this._initEnum(TextFieldType.checkbox, "Check box");
  static numberInt = this._initEnum(TextFieldType.numberInt, "Nhập số nguyên");
  static numberPercent = this._initEnum(
    TextFieldType.numberPercent,
    "Nhập tỷ lệ",
  );
  static numberFloat = this._initEnum(
    TextFieldType.numberFloat,
    "Nhập số thực",
  );
  static label = this._initEnum(TextFieldType.label, "Tiêu đề");
  static radio = this._initEnum(TextFieldType.radio, "Radio");
  static radioMultipleSelect = this._initEnum(
    TextFieldType.radioMultipleSelect,
    "Chọn 1 trong ...",
  );
  static detailsOfJournalEntries = this._initEnum(
    TextFieldType.detailsOfJournalEntries,
    "Chi tiết bút toán",
  );
  static detailsOfJournalEntryTable = this._initEnum(
    TextFieldType.detailsOfJournalEntryTable,
    "Bảng chi tiết bút toán",
  );
  static detailsOfJournalEntryTableFixed = this._initEnum(
    TextFieldType.detailsOfJournalEntryTableFixed,
    "Bảng chi tiết bút toán ver 2",
  );
  static multiTextBox = this._initEnum(
    TextFieldType.multiTextBox,
    "Nhập nhiều dòng",
  );
  static fileUpload = this._initEnum(TextFieldType.fileUpload, "Tải file");
  static datePicker = this._initEnum(TextFieldType.datePicker, "Chọn ngày");
  static detailStockTable = this._initEnum(
    TextFieldType.detailStockTable,
    "Bảng chi tiết chứng khoán",
  );
  static edibleTable = this._initEnum(
    TextFieldType.editableTable,
    "Bảng chỉnh sửa",
  );
  static customLabel = this._initEnum(
    TextFieldType.customLabel,
    "Hiển thi nội dung",
  );
  static customForm = this._initEnum(
    TextFieldType.customForm,
    "Form chỉnh sửa",
  );
  static searchButton = this._initEnum(
    TextFieldType.searchButton,
    "nút tìm kiếm",
  );
  static groupButton = this._initEnum(
    TextFieldType.groupButton,
    "Cấu hình nút",
  );
  static submitValueHiddenView = this._initEnum(
    TextFieldType.submitValueHiddenView,
    "Giá trị ấn",
  );
  static submitValueIntegerHiddenView = this._initEnum(
    TextFieldType.submitValueIntegerHiddenView,
    "Giá trị số nguyên ấn",
  );
  static submitValueFloatHiddenView = this._initEnum(
    TextFieldType.submitValueFloatHiddenView,
    "Giá trị số thực ấn",
  );
  static none = this._initEnum(TextFieldType.none, "Bỏ trống");
}
