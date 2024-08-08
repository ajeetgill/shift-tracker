export const formatTime = (unixTimeStampSecs) => {
  if (!unixTimeStampSecs) return
  const _time = new Date(+unixTimeStampSecs * 1000)
  const hhmmss = _time.toLocaleTimeString().split(':')
  let hh = hhmmss[0]
  const numHH: number = _time.getHours()
  hh = +hh > 12 ? `${+hh - 12}` : hh
  hh = `${hh.length < 2 ? '0' + hh : hh}`
  let mm = hhmmss[1]
  mm = `${mm.length < 2 ? '0' + mm : mm}`
  let ampm = `${numHH < 12 ? 'AM' : 'PM'}`
  return hh + ':' + mm + ' ' + ampm
}
// TODO:: will optimize this function later
export const formatLiveTimeHHMM = (unixTimeStampMS) => {
  if (!unixTimeStampMS) return
  const _time = new Date(unixTimeStampMS)
  const hhmmss = _time.toLocaleTimeString().split(':')
  let hh = hhmmss[0]
  const numHH: number = _time.getHours()
  hh = +hh > 12 ? `${+hh - 12}` : hh
  hh = `${hh.length < 2 ? '0' + hh : hh}`
  let mm = hhmmss[1]
  mm = `${mm.length < 2 ? '0' + mm : mm}`
  let ampm = `${numHH < 12 ? 'AM' : 'PM'}`
  const fmtTime = hh + ':' + mm + ' ' + ampm
  return fmtTime
}
