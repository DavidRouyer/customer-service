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

  type LabelTypeConnection {
    edges: [LabelTypeEdge!]!
    pageInfo: PageInfo!
  }

  type LabelTypeEdge {
    cursor: String!
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
    id: ID!
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
    id: ID!
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