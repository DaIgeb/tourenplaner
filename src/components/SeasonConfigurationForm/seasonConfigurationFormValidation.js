import memoize from 'lru-memoize';
import {createValidator, required, integer, minLength, maxLength, dateTime} from 'utils/validation';

const seasonWizardDateValidation = createValidator({
  year: [required, integer, minLength(4), maxLength(4)],
  seasonStart: [required, dateTime],
  seasonEnd: [required, dateTime],
  eveningStart: [required, dateTime],
  eveningEnd: [required, dateTime]
});

export default memoize(10)(seasonWizardDateValidation);
