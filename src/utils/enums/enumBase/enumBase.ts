export default abstract class EnumBase {
  value: any;
  text: string | null;

  constructor(val: any, des: string | null = null) {
    this.value = val;
    this.text = des;
    Object.freeze(this);
  }

  static getValues<T extends EnumBase>(
    this: { new(...args: any[]): T } & Record<string, T>,
  ): T[] {
    return Object.values(this).map(item => item.value);
  }

  static getKeys<T extends EnumBase>(
    this: { new(...args: any[]): T } & Record<string, T>,
  ): string[] {
    return Object.keys(this).filter(key => isNaN(parseInt(key, 10)));
  }

  static getInstances<T extends EnumBase>(
    this: { new(...args: any[]): T } & Record<string, T>,
  ): T[] {
    return Object.values(this);
  }

  static getKeyOf(
    value: any
    // this: { new (...args: any[]): T } & Record<string, T>,
  ): string | undefined {
    try {
      const entryValid = Object.entries(this).find(
        ([key, val]) => val.value === value,
      );
      return entryValid ? entryValid[0] : undefined;
    } catch (error) {
      return undefined
    }
  }

  static getDescription
    (
      value: any,

    ): string {
    try {
      const instance = Object.values(this).find(
        (item) => item.value === value
      );
      if (!instance) {
        return ""
      };
      return (
        instance.text || ""
        //   `translate(${this.name}.${this.getKeyOf(instance.value)})`
      );
    } catch (error) {
      return ""
    }
  }

  static toOptions(
    // this: { new (...args: any[]): T } & Record<string, T>,
    has_all: boolean = false,
  ): { text: string; value: any }[] {
    let options = Object.entries(this).map(([key, val]) => ({
      text: this[key].text || `translate(${this.name}.${key})`,
      value: this[key].value,
    }));

    if (has_all) {
      options = [
        {
          text: "commonLabel.all",
          value: "commonLabel.all",
        },
        ...options,
      ];
    }

    return options;
  }

  static _initEnum(val: any, des: any) {
    // return new (this as { new (val: any, des?: string | null): T })(val, des);
    return { value: val, text: des };
  }
}
