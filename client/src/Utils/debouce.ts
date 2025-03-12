const debounce = <T extends (...args: any[]) => void>(
    func: T, // The function to debounce
    delay: number // The delay in milliseconds
  ) => {
    let timeoutId: NodeJS.Timeout;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId); // Clear the previous timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set a new timeout
    };
  };
  
  export default debounce;