import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar Json

  type Contact {
    id: ID!
    name: String
    phone: String
    avatarUrl: String
    language: String
    timezone: String
  }

  type Ticket {
    id: ID!
    contact: Contact!
    content: String
    createdAt: Date!
  }

  enum MessageDirection {
    Inbound
    Outbound
  }

  enum MessageContentType {
    TextPlain
    TextHtml
  }

  enum MessageStatus {
    Pending
    Sent
    DeliveredToCloud
    DeliveredToDevice
    Seen
  }

  type Message {
    id: ID!
    contentType: MessageContentType!
    direction: MessageDirection!
    status: MessageStatus!
    content: Json!
    sender: Contact!
    createdAt: Date!
  }

  type Query {
    allTickets: [Ticket!]!
    allMessages(ticketId: ID!): [Message!]!
  }

  input AddMessageInput {
    contentType: MessageContentType!
    direction: MessageDirection!
    status: MessageStatus!
    content: Json!
    senderId: ID!
    createdAt: Date!
  }

  type Mutation {
    addMessage(ticketId: ID!, message: AddMessageInput!): ID!
  }
`;
