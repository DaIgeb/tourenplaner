import memoize from 'lru-memoize';
import {createValidator, required, minLength, maxLength} from 'utils/validation';

const seasonWizardDateValidation = createValidator({
  seasonStart: [required, minLength(10), maxLength(10)],
  seasonEnd: [required, minLength(10), maxLength(10)]
});
export default memoize(10)(seasonWizardDateValidation);
