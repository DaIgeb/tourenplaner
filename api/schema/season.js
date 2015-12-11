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
      $ref: "#seasonconfiguration"
    },
    tours: {
      type: "array",
        items: {
          type: "object"
      }
    }
  },
  required: [
    "year",
    "version",
    "tours"
  ]
}