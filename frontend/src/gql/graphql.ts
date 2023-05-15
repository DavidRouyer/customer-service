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
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  allTickets: Array<Ticket>;
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
