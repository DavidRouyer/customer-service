/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {\n    addMessage(ticketId: $ticketId, message: $message)\n  }\n':
    types.AddMessageDocument,
  '\n  query allTickets {\n    allTickets {\n      id\n      createdAt\n      contact {\n        id\n        avatarUrl\n        name\n      }\n      content\n    }\n  }\n':
    types.AllTicketsDocument,
  '\n  query allMessages($ticketId: ID!) {\n    allMessages(ticketId: $ticketId) {\n      id\n      createdAt\n      content\n      contentType\n      direction\n      status\n      sender {\n        id\n        avatarUrl\n        name\n      }\n    }\n  }\n':
    types.AllMessagesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {\n    addMessage(ticketId: $ticketId, message: $message)\n  }\n'
): (typeof documents)['\n  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {\n    addMessage(ticketId: $ticketId, message: $message)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query allTickets {\n    allTickets {\n      id\n      createdAt\n      contact {\n        id\n        avatarUrl\n        name\n      }\n      content\n    }\n  }\n'
): (typeof documents)['\n  query allTickets {\n    allTickets {\n      id\n      createdAt\n      contact {\n        id\n        avatarUrl\n        name\n      }\n      content\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query allMessages($ticketId: ID!) {\n    allMessages(ticketId: $ticketId) {\n      id\n      createdAt\n      content\n      contentType\n      direction\n      status\n      sender {\n        id\n        avatarUrl\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query allMessages($ticketId: ID!) {\n    allMessages(ticketId: $ticketId) {\n      id\n      createdAt\n      content\n      contentType\n      direction\n      status\n      sender {\n        id\n        avatarUrl\n        name\n      }\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
