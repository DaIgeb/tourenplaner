import memoize from 'lru-memoize';
import {createValidator, integer, required, minLength, maxLength} from 'utils/validation';

const seasonWizardDateValidation = createValidator({
  year: [required, integer, minLength(4), maxLength(4)]
});
export default memoize(10)(seasonWizardDateValidation);
