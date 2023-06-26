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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  Json: { input: any; output: any };
};

export type AddMessageInput = {
  content: Scalars['Json']['input'];
  contentType: MessageContentType;
  createdAt: Scalars['Date']['input'];
  direction: MessageDirection;
  senderId: Scalars['ID']['input'];
  status: MessageStatus;
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['Json']['output'];
  contentType: MessageContentType;
  createdAt: Scalars['Date']['output'];
  direction: MessageDirection;
  id: Scalars['ID']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Scalars['ID']['output'];
};

export type MutationAddMessageArgs = {
  message: AddMessageInput;
  ticketId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  allMessages: Array<Message>;
  allTickets: Array<Ticket>;
};

export type QueryAllMessagesArgs = {
  ticketId: Scalars['ID']['input'];
};

export type Ticket = {
  __typename?: 'Ticket';
  contact: Contact;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
};

export type AddMessageMutationVariables = Exact<{
  ticketId: Scalars['ID']['input'];
  message: AddMessageInput;
}>;

export type AddMessageMutation = {
  __typename?: 'Mutation';
  addMessage: string;
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
  ticketId: Scalars['ID']['input'];
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

export const AddMessageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddMessage' },
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
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'message' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'AddMessageInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addMessage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ticketId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ticketId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'message' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'message' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddMessageMutation, AddMessageMutationVariables>;
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
