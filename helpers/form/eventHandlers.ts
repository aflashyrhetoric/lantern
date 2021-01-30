/* Given the formState and invalidFields hooks (and their respective update functions), 
 *  `getHandlers` returns a set of event-handling helper functions that will:
      - update the form value
      - run validations (if any) and make any necessary updates to invalidFields

* The helper functions are intended to reduce the boilerplate for the update/validate flow 
* Only use these helpers for simpler values that do not require downstream recomputations when changed, or complicated custom validation, etc. 
*/

interface ComboBoxEvent {
  selectedItem: { value: string };
}

// Helper: Updates the value on the event
export const setValueOnEvent = (event, value) => ({ ...event, target: { ...event.target, value } });

// Helper function to validate a value against an array of `tests` functions
const passesValidationTests = (tests: Function[], value: string): boolean => {
  return tests.reduce((isValid, currentRule) => {
    if (!isValid) {
      return false;
    }

    return currentRule(value);
  }, true);
};

const getHandlers = (
  formState: Object,
  updateForm: Function,
  invalidFields: string[],
  updateInvalidFields: Function,
) => {
  // Runs all given validation `tests`, and
  //   upon failure or success, updates invalidFields accordingly
  const validateInput = (value, name, tests): void => {
    // If there are no tests or validation passes, input is considered valid
    if (tests.length === 0 || passesValidationTests(tests, value)) {
      // TODO: optimize with indexOf
      updateInvalidFields(invalidFields.filter(f => f !== name));
    } else if (!invalidFields.includes(name)) {
      updateInvalidFields([...invalidFields, name]);
    }
  };

  // Updates the form value for `name`, then validates the value
  const generalHandler = (e, name: string, tests: Function[] = []) => {
    updateForm({ ...formState, [name]: e.target.value });
    validateInput(e.target.value, name, tests);
  };

  // Strips currency symbols and commas from the value before setting
  const handleCurrencyInputChange = (
    e,
    name: string,
    tests: Function[] = [],
    convertToFloat: boolean = false,
  ) => {
    // Skip string-reformatting for null values
    if (e.target.value !== null) {
      // Remove any currency symbols and commas
      let amount = e.target.value;
      amount = amount.replace(/\$/g, "");
      amount = amount.replace(/,/g, "");

      const convertedAmount = parseFloat(amount);

      const event = setValueOnEvent(
        e,
        convertToFloat && !Number.isNaN(convertedAmount) ? convertedAmount : amount,
      );
      return generalHandler(event, name, tests);
    }

    return generalHandler(e, name, tests);
  };

  // Parses the value as an integer first
  const handleIntegerInputChange = (e, name: string, tests: Function[] = []) => {
    if (e.target.value !== null) {
      // Remove any currency symbols and commas
      let amount = e.target.value;
      amount = parseInt(amount, 10);

      const event = setValueOnEvent(e, amount);
      return generalHandler(event, name, tests);
    }

    return generalHandler(e, name, tests);
  };

  // Parses the value as a float first
  const handleFloatInputChange = (e, name: string, tests: Function[] = []) => {
    if (e.target.value !== null) {
      // Remove any currency symbols and commas
      let amount = e.target.value;
      amount = parseFloat(amount);

      const event = setValueOnEvent(e, amount);
      return generalHandler(event, name, tests);
    }

    return generalHandler(e, name, tests);
  };

  const handlePhoneNumberInputChange = (e, name: string, tests: Function[] = []) => {
    let amount = e.target.value;

    // Remove common symbols and commas
    amount = amount.replace(/\(/g, "");
    amount = amount.replace(/\)/g, "");
    amount = amount.replace(/\s/g, "");
    amount = amount.replace(/\./g, "");
    amount = amount.replace(/-/g, "");

    const event = setValueOnEvent(e, amount);
    // TODO: replace with a proper phone number regex
    return generalHandler(event, name, [...tests, v => v.length <= 10]);
  };

  // @KEVIN TODO: Add handlers for DatePickers
  return {
    handleTextInputChange: generalHandler,
    handleIntegerInputChange,
    handleFloatInputChange,
    handleCurrencyInputChange,
    handlePhoneNumberInputChange,
    handleSelectChange: generalHandler,
    handleRadioChange: (value, name: string, tests: Function[] = []) => {
      updateForm({ ...formState, [name]: value });
      validateInput(value, name, tests);
    },
    handleCheckboxChange: (toggledState: boolean, name: string) => {
      updateForm({ ...formState, [name]: !toggledState });
    },

    // handleComboBoxTextChange - for the Combo Box's text input state
    //  e.g. <ComboBox onInputChange={e => handleComboBoxTextChange}>
    handleComboBoxTextChange: (value, name, tests: Function[] = []) => {
      const event = {
        target: {
          name,
          value: value || "",
        },
      };

      return generalHandler(event, name, tests);
    },
    // handleComboBoxChange - for the Combo Box's currently-selected dropdown value
    //  e.g. <ComboBox onChange={e => handleComboBoxChange}>
    handleComboBoxChange: (
      e: ComboBoxEvent,
      name: string,
      defaultValue,
      tests: Function[] = [],
    ) => {
      // if the combo box is cleared via the `x`, `e` = `{selectedItem: null}`,
      // in which case, we should set the form value to the field's default value

      const value =
        e &&
        e.selectedItem &&
        e.selectedItem.value !== undefined &&
        e.selectedItem.value !== null &&
        e.selectedItem.value !== ""
          ? e.selectedItem.value
          : defaultValue;

      updateForm({ ...formState, [name]: value });
      validateInput(value, name, tests);
    },
  };
};

export default getHandlers;
