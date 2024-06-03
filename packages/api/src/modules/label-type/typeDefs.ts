const typeDefs = /* GraphQL */ `
  """
  A label type for categorizing labels.
  """
  type LabelType implements Node {
    """
    The Node ID of the LabelType object.
    """
    id: ID!
    """
    The name of the label type.
    """
    name: String!
    """
    The icon of the label type.
    """
    icon: String
    """
    Identifies the date and time when the label type was archived.
    """
    archivedAt: DateTime
    """
    Identifies the date and time when the label type was archived.
    """
    createdAt: DateTime!
    """
    The user who created the label type.
    """
    createdBy: User!
    """
    Identifies the date and time when the label type was last updated.
    """
    updatedAt: DateTime
    """
    The user who last updated the label type.
    """
    updatedBy: User
  }

  """
  A list of label types.
  """
  type LabelTypeConnection {
    """
    A list of edges.
    """
    edges: [LabelTypeEdge!]!
    """
    Information to aid in pagination.
    """
    pageInfo: PageInfo!
  }

  """
  Represents a label type.
  """
  type LabelTypeEdge {
    """
    A cursor for use in pagination.
    """
    cursor: String!
    """
    The item at the end of the edge.
    """
    node: LabelType!
  }

  """
  Ways in which to filter lists of label types.
  """
  input LabelTypeFilters {
    isArchived: Boolean
  }

  extend type Query {
    """
    Fetches a label type given its ID.
    """
    labelType(labelTypeId: ID!): LabelType

    """
    Fetches a list of label types.
    """
    labelTypes(
      filters: LabelTypeFilters
      first: Int
      after: String
      last: Int
      before: String
    ): LabelTypeConnection!
  }

  """
  Input type of ArchiveLabelType.
  """
  input ArchiveLabelTypeInput {
    """
    The Node ID of the label type to archive.
    """
    labelTypeId: ID!
  }

  """
  Return type of ArchiveLabelType.
  """
  type ArchiveLabelTypePayload {
    """
    The archived label type.
    """
    labelType: LabelType
    """
    Errors when archiving the label type.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of CreateLabelType.
  """
  input CreateLabelTypeInput {
    name: String!
    icon: String
  }

  """
  Return type of CreateLabelType.
  """
  type CreateLabelTypePayload {
    """
    The new label type.
    """
    labelType: LabelType
    """
    Errors when creating the label type.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of UnarchiveLabelType.
  """
  input UnarchiveLabelTypeInput {
    """
    The Node ID of the label type to unarchive.
    """
    labelTypeId: ID!
  }

  """
  Return type of UnarchiveLabelType.
  """
  type UnarchiveLabelTypePayload {
    """
    The unarchived label type.
    """
    labelType: LabelType
    """
    Errors when unarchiving the label type.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of UpdateLabelType.
  """
  input UpdateLabelTypeInput {
    id: ID!
    name: String
    icon: String
  }

  """
  Return type of UpdateLabelType.
  """
  type UpdateLabelTypePayload {
    """
    The updated label type.
    """
    labelType: LabelType
    """
    Errors when updating the label type.
    """
    userErrors: [MutationError!]
  }

  extend type Mutation {
    """
    Archive a label type.
    """
    archiveLabelType(
      """
      Parameters for ArchiveLabelType.
      """
      input: ArchiveLabelTypeInput!
    ): ArchiveLabelTypePayload

    """
    Create a label type.
    """
    createLabelType(
      """
      Parameters for CreateLabelType.
      """
      input: CreateLabelTypeInput!
    ): CreateLabelTypePayload

    """
    Unarchive a label type.
    """
    unarchiveLabelType(
      """
      Parameters for UnarchiveLabelType.
      """
      input: UnarchiveLabelTypeInput!
    ): UnarchiveLabelTypePayload

    """
    Update a label type.
    """
    updateLabelType(
      """
      Parameters for UpdateLabelType.
      """
      input: UpdateLabelTypeInput!
    ): UpdateLabelTypePayload
  }
`;

export default typeDefs;
