export default {
  id: "timeline",
  type: "object",
  properties: {
    from: {
      type: "string",
      format: "date-time"
    },
    until: {
      type: "string",
      format: "date-time"
    },
    notes: {
      type: "string",
      readonly: true
    },
    phone: {
      type: "string",
      readonly: true
    },
    businessHours: {
      type: "array",
      items: {
        type: "object" //"#businessHour"
      },
      readonly: true
    }
  },
  required: [
    "from",
    "until"
  ]
}