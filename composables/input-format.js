

export function useTestEmailFormat(email) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/).test(email)
}

// 8 characters minimum, at least one letter and one number
export function useTestPasswordFormat(password) {
  return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/).test(password)
}


export function useTestTaiwanPhoneFormat(phone) {
  return (/^\+?886-?0?9\d{8}$/).test(phone)
}