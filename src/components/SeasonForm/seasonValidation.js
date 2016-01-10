import {createValidator, required, minLength, maxLength} from 'utils/validation';

const restaurantValidation = createValidator({
  name: [required, minLength(5), maxLength(50)]
});
export default restaurantValidation;
