export default {
  id: 'location',
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 1,
      readonly: true
    },
    name: {
      type: 'string'
    },
    streetAddress: {
      type: 'string'
    },
    addressCountry: {
      description: 'The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code',
      type: 'string'
    },
    postalCode: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    latitude: {
      type: 'number'
    },
    longitude: {
      type: 'number'
    }
  },
  required: [
    'name',
    'latitude',
    'longitude'
  ]
}