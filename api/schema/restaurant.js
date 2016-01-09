export default {
  id: "restaurant",
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1,
      readonly: true
    },
    location: {
      type: "integer"
    },
    timelines: {
      type: "array",
      items: {
        $ref: "#timeline"
      },
      minItems: 1
    }
  },
  required: [
    "location",
    "timelines"
  ]
}