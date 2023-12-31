export const regex = {
  password: new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  digitWithdecimal: new RegExp(/^\d+(\.\d{1,2})?$/),
  phoneNumber: new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/),
  usPhoneFormat: new RegExp(/^\(\d{3}\)\s?\d{3}-\d{4}$/),
  onlyNumber: new RegExp(/^[0-9]*$/),
  extension: new RegExp(/^[0-9]{4}$/),
  height: new RegExp(/^[0-9]'(?:\s*(?:1[01]|[0-9])(''|"))?$/),
  zipCode: new RegExp(/^[0-9]{5}$/),
  domainName: new RegExp(/^[a-z0-9_]+$/),
  alphaNumericLimit: new RegExp(/^[0-9]{10}$/),
  alphaNumeric: new RegExp('^[a-zA-Z0-9]{20}$'), // limit 12 digit
  emailValidation: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  numeric: new RegExp(/^[0-9]{10}$/), // limit 10 digit
  nonDecimalDigits: new RegExp(/^(\d)*(\^.)?([0-9]{1})?$/),
  percentageRegex: new RegExp(/^(100|[1-9][0-9]?)$/), // Allowed Range 1 to 100
  BPRegex: new RegExp(/^(([1-9]|[1-9][0-9]|[1-4][0-9]{2}|500))$/), // Allowed Range 1 to 500
  glucoseRegex: new RegExp(/^([1-9]|[1-9]\d{1,2}|1\d{3}|2000)$/), // Allowed Range 1 to 2000,
  // noSpace:/^(?!\s).+(?<!\s)$/  /** no space allowed. */
  // noSpace:/^\!s*$/
};
