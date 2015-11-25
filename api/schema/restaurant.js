export default {
  id: "restaurant",
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1,
      readonly: true
    },
    name: {
      type: "string",
      readonly: true
    },
    location: {
      type: ["integer", "#location" ]
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
    "name",
    "location",
    "timelines"
  ]
}