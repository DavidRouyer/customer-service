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

  """
  Input type of AddLabels.
  """
  input AddLabelsInput {
    """
    The IDs of the label types to add.
    """
    labelTypeIds: [ID!]!
    """
    The Node ID of the ticket to adds labels to.
    """
    ticketId: ID!
  }

  """
  Return type of AddLabels.
  """
  type AddLabelsPayload {
    labels: [Label!]
    """
    Errors when adding labels to the ticket.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of RemoveLabels.
  """
  input RemoveLabelsInput {
    """
    The IDs of the labels to remove.
    """
    labelIds: [ID!]!
    """
    The Node ID of the ticket to remove labels to.
    """
    ticketId: ID!
  }

  """
  Return type of RemoveLabels.
  """
  type RemoveLabelsPayload {
    """
    Errors when removing labels to the ticket.
    """
    userErrors: [MutationError!]
  }

  extend type Mutation {
    """
    Add labels to a ticket.
    """
    addLabels(
      """
      Parameters for AddLabels.
      """
      input: AddLabelsInput!
    ): AddLabelsPayload

    """
    Remove labels to a ticket.
    """
    removeLabels(
      """
      Parameters for RemoveLabels.
      """
      input: RemoveLabelsInput!
    ): RemoveLabelsPayload
  }
`;

export default typeDefs;
