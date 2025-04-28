
export const skipEmptyStringConverter = {
  toAttribute(value: string) {
    return value === '' ? null : value;
  },
  fromAttribute(value: string | null) {
    return value ?? '';
  }
};