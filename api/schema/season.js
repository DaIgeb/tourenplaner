export default {
  title: "Season",
  type: "object",
  properties: {
    year: {
      type: "number"
    },
    version: {
      type: "number"
    },
    configurationId: {
      $ref: "#configuration"
    },
    dates: {
      type: "array",
        items: {
          type: "object"
      }
    }
  },
  required: [
    "year",
    "version",
    "dates"
  ]
}