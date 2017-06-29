const ManifestSchema = Object.assign({}, {
  type: "object",
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: "string"
    },
    url: {
      type: "string"
    },
    author: { $ref: "#/definitions/author" },
    isSingle: {
      type: "boolean"
    },
    scope: {
      type: "string",
      "enum": ["agent", "user"]
    },
    targets: {
      type: "array",
      minItems: 1,
      maxItems: 1,
      items: { $ref: "#/definitions/target" }
    },
    settings: {
      type: "array"
    },
    version: {
      type: "string"
    },
    deskproApiTags: {
      type: "array",
      items: {
        type: "string"
      }
    },
    externalApis: {
      type: "array",
      items: {
        type: "string"
      }
    }
  },
  required: ["name", "description", "author", "scope", "targets"],
  definitions: {
    author: {
      type: "object",
      properties: {
        name: {type: "string"},
        email: {type: "string"},
        url: {type: "string"}
      },
      required: ["name", "email"]
    },
    target: {
      type: "object",
      properties: {
        target: {
          type: "string",
          "enum": [
            "ticket-sidebar", "ticket-header-top", "ticket-header-bottom", "ticket-header-after",
            "ticket-properties-before", "ticket-properties-after", "ticket-replybox-before", "ticket-replybox-after",
            "ticket-messages-before", "ticket-messages-after", "ticket-footer",
            "ticket-properties-new-tab", "ticket-body-tabs-new-tab",

            "person-sidebar", "person-header-top", "person-header-bottom", "person-header-after",
            "person-content-before", "person-summary-before", "person-summary-after", "person-properties-before",
            "person-properties-after", "person-notes-before", "person-notes-after", "person-content-after",
            "person-contact-before", "person-contact-after", "person-org-before", "person-org-after",
            "person-usergroups-before", "person-usergroups-after", "person-footer",
            "person-summary-new-tab", "person-content-box-new-tab", "person-notes-new-tab",

            "org-sidebar", "org-header-top", "org-header-bottom", "org-header-after",
            "org-content-before", "org-summary-before", "org-summary-after", "org-notes-before", "org-notes-after",
            "org-content-after",
            "org-contact-before", "org-contact-after", "org-properties-before", "org-properties-after",
            "org-email-assoc-before", "org-email-assoc-after", "org-usergroups-before", "org-usergroups-after",
            "org-hierarchy-before", "org-hierarchy-after", "org-footer",
            "org-summary-new-tab", "org-content-box-new-tab", "org-notes-new-tab",

            "background"
          ]
        },
        url: {type: "string"}
      }
    },
    integerData: {
      type: "integer",
      minimum: 0
    },
    stringData: {
      type: "string"
    }
  }
});

module.exports = ManifestSchema;