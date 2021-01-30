// A map of commonly-used validation functions
// If the function returns true, the value is considered valid.

const checkIfValidDecimal = v => {
  const decimalPattern = /^-?\d*\.?\d{0,2}$/;
  return decimalPattern.test(v);
};

const Validations = {
  // Basic Validations
  IsValid: v => v !== undefined && v !== "",
  IsRequired: v => v !== undefined && v !== "", // alias of IsValid
  IsNonNull: v => v !== null,
  IsInteger: v => Number.isInteger(v),

  // Regex-based validations
  IsPostalCode: v => {
    const zipPattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return zipPattern.test(v);
  },
  IsDecimal: checkIfValidDecimal,
  IsNumber: v => !Number.isNaN(v) && (Number.isInteger(v) || checkIfValidDecimal(v)),

  // @KEVIN TODO: Add validators for DatePickers
};
export default Validations;
