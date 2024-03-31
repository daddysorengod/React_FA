import EnumBase from "./enumBase"; 

type FieldOption = {
  text: string;
  value: any;
};

export const createEnumOptionsFromString =(inputString: string) =>{
  const options: FieldOption[] = inputString.split("&").map((pair) => {
    const [text, value] = pair.split("*");
    return { text, value };
  });

  const enumOptions = {};

  options.forEach((option) => {
    enumOptions[option.value] = Object.assign({}, EnumBase._initEnum(option.value, option.text));
  });

  return enumOptions;
}

