export const dataSelectedByKeys = (
  data: any,
  options = ['email', 'username'],
) => {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {}; // Add type annotation
      options.forEach((key) => {
        newItem[key] = item[key];
      });
      return newItem;
    });
  }
  const newItem: { [key: string]: any } = {}; // Add type annotation
  options.forEach((key) => {
    newItem[key] = data[key];
  });
  return newItem;
};
