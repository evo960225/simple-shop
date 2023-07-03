export function urlAddHash(url, mintu) {
    return url + '?v=' + Date.now() .toString()
}

export function urlAddHashByTime(url, gapSec) {
    return url + '?v=' + Math.floor(Date.now() / (gapSec * 1000) ).toString()
}
  