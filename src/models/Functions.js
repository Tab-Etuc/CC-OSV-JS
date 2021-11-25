/**
 * @param {number | string} n
 * @returns {string}
 */
function formatNumber (n) {
  return Number.parseFloat(String(n)).toLocaleString('be-BE')
}
/**
 * @param {number} int
 * @returns {string}
 */
function formatInt (int) {
  return int < 10 ? `0${int}` : int
}
/**
 * Format duration to string
 * @param {number} millisec Duration in milliseconds
 * @returns {string}
 */
function formatDuration (millisec) {
  if (!millisec || !Number(millisec)) return '00:00'
  const seconds = Math.round((millisec % 60000) / 1000)
  const minutes = Math.floor((millisec % 3600000) / 60000)
  const hours = Math.floor(millisec / 3600000)
  if (hours > 0)
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`
  if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`
  return `00:${formatInt(seconds)}`
}
/**
 * Convert formatted duration to seconds
 * @param {string} formatted duration input
 * @returns {number}
 */
function toMilliSeconds (input) {
  if (!input) return 0
  if (typeof input !== 'string') return Number(input) || 0
  if (input.match(/:/g)) {
    const time = input.split(':').reverse()
    let s = 0
    for (let i = 0; i < 3; i++)
      if (time[i])
        s += Number(time[i].replace(/[^\d.]+/g, '')) * Math.pow(60, i)
    if (time.length > 3)
      s += Number(time[3].replace(/[^\d.]+/g, '')) * 24 * 60 * 60
    return Number(s * 1000)
  } else {
    return Number(input.replace(/[^\d.]+/g, '') * 1000) || 0
  }
}
/**
 * Parse number from input
 * @param {*} input Any
 * @returns {number}
 */
function parseNumber (input) {
  if (typeof input === 'string')
    return Number(input.replace(/[^\d.]+/g, '')) || 0
  return Number(input) || 0
}

function numberFormat (num) {
  let numberFormats = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  let i
  for (i = numberFormats.length - 1; i > 0; i--) {
    if (num >= numberFormats[i].value) break
  }
  return (
    (num / numberFormats[i].value)
      .toFixed(2)
      .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + numberFormats[i].symbol
  )
}
module.exports = {
  formatNumber,
  formatInt,
  formatDuration,
  toMilliSeconds,
  parseNumber,
  numberFormat
}
