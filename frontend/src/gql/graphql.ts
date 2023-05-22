/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Json: any;
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['Json'];
  contentType: MessageContentType;
  createdAt: Scalars['Date'];
  direction: MessageDirection;
  id: Scalars['ID'];
  sender: Contact;
  status: MessageStatus;
};

export enum MessageContentType {
  TextPlain = 'TextPlain',
}

export enum MessageDirection {
  Inbound = 'Inbound',
  Outbound = 'Outbound',
}

export enum MessageStatus {
  DeliveredToCloud = 'DeliveredToCloud',
  DeliveredToDevice = 'DeliveredToDevice',
  Pending = 'Pending',
  Seen = 'Seen',
  Sent = 'Sent',
}

export type Query = {
  __typename?: 'Query';
  allMessages: Array<Message>;
  allTickets: Array<Ticket>;
};

export type QueryAllMessagesArgs = {
  ticketId: Scalars['ID'];
};

export type Ticket = {
  __typename?: 'Ticket';
  contact: Contact;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
};

export type AllTicketsQueryVariables = Exact<{ [key: string]: never }>;

export type AllTicketsQuery = {
  __typename?: 'Query';
  allTickets: Array<{
    __typename?: 'Ticket';
    id: string;
    createdAt: any;
    content?: string | null;
    contact: {
      __typename?: 'Contact';
      id: string;
      imageUrl?: string | null;
      name?: string | null;
    };
  }>;
};

export type AllMessagesQueryVariables = Exact<{
  ticketId: Scalars['ID'];
}>;

export type AllMessagesQuery = {
  __typename?: 'Query';
  allMessages: Array<{
    __typename?: 'Message';
    id: string;
    createdAt: any;
    content: any;
    contentType: MessageContentType;
    direction: MessageDirection;
    status: MessageStatus;
    sender: {
      __typename?: 'Contact';
      id: string;
      imageUrl?: string | null;
      name?: string | null;
    };
  }>;
};

export const AllTicketsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'allTickets' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allTickets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'imageUrl' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AllTicketsQuery, AllTicketsQueryVariables>;
export const AllMessagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'allMessages' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'ticketId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allMessages' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ticketId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ticketId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'content' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contentType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'direction' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sender' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'imageUrl' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AllMessagesQuery, AllMessagesQueryVariables>;
