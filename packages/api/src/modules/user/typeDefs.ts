const typeDefs = /* GraphQL */ `
type User implements Node {
  id: ID!
  name: String
  email: String!
  emailVerified: DateTime
  image: String
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  cursor: String!
  node: User!
}

type Query {
  myUserInfo: User
  user(id: ID!): User
  users(first: Int, after: String, last: Int, before: String): UserConnection!
}
`;

export default typeDefs;