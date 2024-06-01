const typeDefs = /* GraphQL */ `
  type Customer implements Node {
    id: ID!
    name: String
    email: String
    phone: String
    avatarUrl: String
    language: String
    timezone: String
    createdAt: DateTime!
    createdBy: User!
    updatedAt: DateTime
    updatedBy: User
  }

  extend type Query {
    """
    Fetches a customer given its ID.
    """
    customer(id: ID!): Customer
  }
`;

export default typeDefs;
