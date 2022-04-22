export const getFromLocalStorage = (localVariable: string) => {
  return localStorage.getItem(localVariable);
};

export const setToLocalStorage = (localVariable: string, value: string) => {
  localStorage.setItem(localVariable, value);
};

export const removeFromLocalStorage = (localVariable: string) => {
  localStorage.removeItem(localVariable);
};
