const typeDefs = /* GraphQL */ `
  scalar DateTime

  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type MutationError {
    message: String!
    code: String!
    path: [String!]!
  }
`;

export default typeDefs;
