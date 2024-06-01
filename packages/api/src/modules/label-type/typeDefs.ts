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

  type Query {
    labelType(id: ID!): LabelType

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

  type ArchiveLabelTypeOutput {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input CreateLabelTypeInput {
    name: String!
    icon: String
  }

  type CreateLabelTypeOutput {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input UnarchiveLabelTypeInput {
    labelTypeId: ID!
  }

  type UnarchiveLabelTypeOutput {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  input UpdateLabelTypeInput {
    id: ID!
    name: String
    icon: String
  }

  type UpdateLabelTypeOutput {
    labelType: LabelType
    userErrors: [MutationError!]
  }

  type Mutation {
    archiveLabelType(input: ArchiveLabelTypeInput!): ArchiveLabelTypeOutput

    createLabelType(input: CreateLabelTypeInput!): CreateLabelTypeOutput

    unarchiveLabelType(
      input: UnarchiveLabelTypeInput!
    ): UnarchiveLabelTypeOutput

    updateLabelType(input: UpdateLabelTypeInput!): UpdateLabelTypeOutput
  }
`;

export default typeDefs;
