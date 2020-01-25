export function debounce(fn: Function, interval: number) {
  let timer: NodeJS.Timeout
  return function() {
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn()
    }, interval)
  }
}

// ES6
export function debounced(delay: number, fn: Function) {
  let timerId: NodeJS.Timeout | null;
  return function (...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }
}