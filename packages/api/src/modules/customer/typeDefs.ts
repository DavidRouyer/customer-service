const typeDefs = /* GraphQL */ `
  """
  A customer is a person that creates tickets.
  """
  type Customer implements Node {
    """
    The Node ID of the Customer object.
    """
    id: ID!
    """
    The full name of the customer.
    """
    name: String
    """
    The email of the customer.
    """
    email: String
    """
    The phone number of the customer.
    """
    phone: String
    """
    A URL pointing to the customer's avatar.
    """
    avatarUrl: String
    """
    The customer's preferred language.
    """
    language: String
    """
    The customer's timezone.
    """
    timezone: String
    """
    Identifies the date and time when the customer was created.
    """
    createdAt: DateTime!
    """
    The user who created the customer.
    """
    createdBy: User!
    """
    Identifies the date and time when the customer was last updated.
    """
    updatedAt: DateTime
    """
    The user who last updated the customer.
    """
    updatedBy: User
  }

  extend type Query {
    """
    Fetches a customer given its ID.
    """
    customer(customerId: ID!): Customer
  }
`;

export default typeDefs;
