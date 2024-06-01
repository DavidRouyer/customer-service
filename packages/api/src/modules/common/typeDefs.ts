const typeDefs = /* GraphQL */ `
  """
  An ISO-8601 encoded UTC date string.
  """
  scalar DateTime

  type Query

  type Mutation

  """
  An object with an ID.
  """
  interface Node {
    """
    ID of the object.
    """
    id: ID!
  }

  """
  Information about pagination in a connection.
  """
  type PageInfo {
    """
    When paginating forwards, the cursor to continue.
    """
    endCursor: String
    """
    When paginating forwards, are there more items?
    """
    hasNextPage: Boolean!
    """
    When paginating backwards, are there more items?
    """
    hasPreviousPage: Boolean!
    """
    When paginating backwards, the cursor to continue.
    """
    startCursor: String
  }

  type MutationError {
    message: String!
    code: String!
    path: [String!]!
  }
`;

export default typeDefs;
