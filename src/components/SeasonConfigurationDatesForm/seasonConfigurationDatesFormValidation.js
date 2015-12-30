import memoize from 'lru-memoize';
import {createValidator, required, minLength, maxLength} from 'utils/validation';

const seasonWizardDateValidation = createValidator({
  seasonStart: [required, minLength(24), maxLength(24)],
  seasonEnd: [required, minLength(24), maxLength(24)]
});
export default memoize(10)(seasonWizardDateValidation);
