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
      oneOf: [
        { type: "integer"},
        { $ref: "#location"}
      ],
      required: true
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