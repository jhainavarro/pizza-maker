import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";

export const required = (errorText: string): ValidatorFn => (
  control: AbstractControl
): ValidationErrors | null =>
  control.value !== undefined &&
  control.value !== null &&
  control.value.toString().trim() !== ""
    ? null
    : { required: errorText };

export const tooManyToppings = (errorText: string): ValidatorFn => (
  group: FormGroup
): ValidationErrors | null => {
  const size = group.get("size")?.value;
  const toppings = group.get("toppings")?.value;

  if (!size || !toppings) {
    return null;
  }

  // value is  `true` if checkbox is selected
  const selectedToppings = toppings.filter((selected) => !!selected);

  return selectedToppings.length > size.maxToppings
    ? { tooManyToppings: errorText }
    : null;
};
