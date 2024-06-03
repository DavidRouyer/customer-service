const typeDefs = /* GraphQL */ `
  """
  A label for categorizing tickets.
  """
  type Label implements Node {
    """
    The Node ID of the Label object.
    """
    id: ID!
    """
    The label type of the label.
    """
    labelType: LabelType!
    """
    Identifies the date and time when the label was archived.
    """
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

  extend type Mutation {
    addLabels(input: AddLabelsInput!): AddLabelsPayload

    removeLabels(input: RemoveLabelsInput!): RemoveLabelsPayload
  }
`;

export default typeDefs;
