const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
export default debounce;