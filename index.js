/**
 * [outliers]{@link https://github.com/MatthewMueller/outliers}
 *
 * @version 0.1.0
 * @author Matthew Mueller [mattmuelle@gmail.com]
 * @license MIT
 */


const isArray = Array.isArray;


/**
 * Initialize the outliers
 *
 * @param {array|String} [arr] - Input array (must not be provided when used as a filter).
 * @param {number} [g=1.5] - Threshold (defaults to 1.5).
 * @return {array|function} - If an array has been passed, returns outliers array; when used as a filter function.
 */
function outliers(arr, g=1.5) {
  if (isArray(arr)) return calc(arr, null,g);

  let o = null;
  const k = 'string' === typeof arr && arr;

  return function(v, i, a) {
    if (!o) o = calc(a, k, g);
    v = k ? v[k] : v;
    return !~o.indexOf(v);
  };
}


/**
 * Calculate the outliers
 *
 * @param {Array} arr - Input array.
 * @param {string} [key] - Optional key for objects.
 * @param {number} [g=1.5] - Threshold (defaults to 1.5).
 * @return {Array} - Outliers Array.
 */
function calc(arr, key, g=1.5) {
  if (key) arr = arr.map(v => v[key]);
  arr = arr.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0));

  const middle = Number(median(arr));
  const range = Number(iqr(arr, g));

  return arr.filter(n => Math.abs(Number(n) - middle) > range);
}


/**
 * Find the median
 *
 * @param {Array} arr - Input Array.
 * @return {number} - Median of input array.
 */
function median(arr) {
  const half = arr.length >>> 1;

  return arr.length % 2
    ? arr[half]
    : (Number(arr[half - 1]) + Number(arr[half])) / 2;
}


/**
 * Find the range
 *
 * @param {Array} arr - Input Array.
 * @param {number} [g=1.5] - Threshold (defaults to 1.5).
 * @return {number} - The range from quartile 1 to quartile 3.
 */
function iqr(arr, g=1.5) {
  const half = arr.length >>> 1; 

  const q1 = median(arr.slice(0, half));
  const q3 = median(arr.slice(half+1));

  return (Number(q3) - Number(q1)) * g;
}

export default outliers;
