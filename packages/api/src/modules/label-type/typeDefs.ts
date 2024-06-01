const typeDefs = /* GraphQL */ `
  type LabelType implements Node {
    id: ID!
    name: String!
    icon: String
    archivedAt: DateTime
    createdAt: DateTime!
    createdBy: User!
    updatedAt: DateTime
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

  input LabelTypesFilter {
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
      filters: LabelTypesFilter
      first: Int
      after: String
      last: Int
      before: String
    ): LabelTypeConnection!
  }

  input ArchiveLabelTypeInput {
    labelTypeId: ID!
  }

  type ArchiveLabelTypePayload {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input CreateLabelTypeInput {
    name: String!
    icon: String
  }

  type CreateLabelTypePayload {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input UnarchiveLabelTypeInput {
    labelTypeId: ID!
  }

  type UnarchiveLabelTypePayload {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input UpdateLabelTypeInput {
    id: ID!
    name: String
    icon: String
  }

  type UpdateLabelTypePayload {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  extend type Mutation {
    archiveLabelType(input: ArchiveLabelTypeInput!): ArchiveLabelTypePayload

    createLabelType(input: CreateLabelTypeInput!): CreateLabelTypePayload

    unarchiveLabelType(
      input: UnarchiveLabelTypeInput!
    ): UnarchiveLabelTypePayload

    updateLabelType(input: UpdateLabelTypeInput!): UpdateLabelTypePayload
  }
`;

export default typeDefs;
