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

  type AddLabelsOutput {
    labels: [Label!]
    userErrors: [MutationError!]
  }

  input RemoveLabelsInput {
    labelIds: [ID!]!
    ticketId: ID!
  }

  type RemoveLabelsOutput {
    userErrors: [MutationError!]
  }

  type Mutation {
    addLabels(input: AddLabelsInput!): AddLabelsOutput

    removeLabels(input: RemoveLabelsInput!): RemoveLabelsOutput
  }
`;

export default typeDefs;
