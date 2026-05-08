/**
 * Returns a debounced version of fn that delays invoking until
 * wait milliseconds have elapsed since the last call.
 *
 * @param {Function} fn
 * @param {number} wait  — milliseconds
 * @returns {Function}
 */
export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
