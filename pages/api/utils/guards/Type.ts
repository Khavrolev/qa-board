export const isString = (x: any): x is string => {
  return typeof x === "string";
};

export function isArray<Type>(x: any): x is Type[] {
  return Object.prototype.toString.call(x) === "[object Array]";
}
