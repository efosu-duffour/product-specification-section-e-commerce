export const emptyStringConverter = {
  toAttribute(value: string) {
    // If the value is an empty string, return it as the attribute value
    return value === '' ? '' : value;
  },
  fromAttribute(value: string | null) {
    // Convert the attribute value back to the internal property
    return value ?? '';  // Default to empty string if null
  }
};