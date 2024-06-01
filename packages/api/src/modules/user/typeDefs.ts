const typeDefs = /* GraphQL */ `
  """
  The Kyaku user corresponding to the email field. Null if no such user exists
  """
  type User implements Node {
    """
    The Node ID of the User object
    """
    id: ID!
    """
    The user's profile name
    """
    name: String
    """
    The user's profile email
    """
    email: String!
    """
    Identifies the date and time when the user's email was confirmed.
    """
    emailVerified: DateTime
    """
    A URL pointing to the user's profile avatar
    """
    image: String
  }

  """
  A list of users.
  """
  type UserConnection {
    """
    A list of edges.
    """
    edges: [UserEdge!]!
    """
    Information to aid in pagination.
    """
    pageInfo: PageInfo!
  }

  """
  Represents a user.
  """
  type UserEdge {
    """
    A cursor for use in pagination.
    """
    cursor: String!
    """
    The item at the end of the edge.
    """
    node: User!
  }

  type Query {
    myUserInfo: User
    user(id: ID!): User
    users(first: Int, after: String, last: Int, before: String): UserConnection!
  }
`;

export default typeDefs;
