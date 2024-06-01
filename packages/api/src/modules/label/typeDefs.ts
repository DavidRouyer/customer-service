const typeDefs = /* GraphQL */ `
  type Label implements Node {
    id: ID!
    labelType: LabelType!
    archivedAt: DateTime
  }

  input AddLabelsInput {
    labelTypeIds: [ID!]!
    ticketId: ID!
  }

  type AddLabelsPayload {
    labels: [Label!]
    userErrors: [MutationError!]
  }

  input RemoveLabelsInput {
    labelIds: [ID!]!
    ticketId: ID!
  }

  type RemoveLabelsPayload {
    userErrors: [MutationError!]
  }

  type Mutation {
    addLabels(input: AddLabelsInput!): AddLabelsPayload

    removeLabels(input: RemoveLabelsInput!): RemoveLabelsPayload
  }
`;

export default typeDefs;
