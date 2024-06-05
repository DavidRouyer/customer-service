const typeDefs = /* GraphQL */ `
  """
  An ISO-8601 encoded UTC date string.
  """
  scalar DateTime

  """
  The query root of Kyaku's GraphQL interface.
  """
  type Query

  """
  The mutation root of Kyaku's GraphQL interface.
  """
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

  """
  Represents an error in a mutation.
  """
  type MutationError {
    """
    The error code.
    """
    code: String!
    """
    The path to the input field that caused the error.
    """
    path: [String!]!
    """
    The error message.
    """
    message: String!
  }
`;

export default typeDefs;
