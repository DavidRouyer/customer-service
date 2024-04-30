import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    ...({"headers":{"content-type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ArchiveLabelTypeInput = {
  id: Scalars['ID']['input'];
};

export type AssignmentChangedEntry = {
  __typename?: 'AssignmentChangedEntry';
  newAssignedTo?: Maybe<User>;
  oldAssignedTo?: Maybe<User>;
};

export type ChatEntry = {
  __typename?: 'ChatEntry';
  text: Scalars['String']['output'];
};

export type CreateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Entry = AssignmentChangedEntry | ChatEntry | LabelsChangedEntry | NoteEntry | PriorityChangedEntry | StatusChangedEntry;

export type Label = Node & {
  __typename?: 'Label';
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  labelType: LabelType;
};

export type LabelType = Node & {
  __typename?: 'LabelType';
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};

export type LabelTypeConnection = {
  __typename?: 'LabelTypeConnection';
  edges: Array<LabelTypeEdge>;
  pageInfo: PageInfo;
};

export type LabelTypeEdge = {
  __typename?: 'LabelTypeEdge';
  cursor: Scalars['String']['output'];
  node: LabelType;
};

export type LabelTypesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LabelsChangedEntry = {
  __typename?: 'LabelsChangedEntry';
  newLabels: Array<Label>;
  oldLabels: Array<Label>;
};

export type Mutation = {
  __typename?: 'Mutation';
  archiveLabelType?: Maybe<LabelType>;
  createLabelType?: Maybe<LabelType>;
  unarchiveLabelType?: Maybe<LabelType>;
  updateLabelType?: Maybe<LabelType>;
};


export type MutationArchiveLabelTypeArgs = {
  input: ArchiveLabelTypeInput;
};


export type MutationCreateLabelTypeArgs = {
  input: CreateLabelTypeInput;
};


export type MutationUnarchiveLabelTypeArgs = {
  input: UnarchiveLabelTypeInput;
};


export type MutationUpdateLabelTypeArgs = {
  input: UpdateLabelTypeInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type NoteEntry = {
  __typename?: 'NoteEntry';
  rawContent: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PriorityChangedEntry = {
  __typename?: 'PriorityChangedEntry';
  newPriority?: Maybe<TicketPriority>;
  oldPriority?: Maybe<TicketPriority>;
};

export type Query = {
  __typename?: 'Query';
  labelType?: Maybe<LabelType>;
  labelTypes: LabelTypeConnection;
  ticket?: Maybe<Ticket>;
  tickets: TicketConnection;
  user?: Maybe<User>;
  users: UserConnection;
};


export type QueryLabelTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabelTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<LabelTypesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTicketArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTicketsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TicketsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type StatusChangedEntry = {
  __typename?: 'StatusChangedEntry';
  newStatus?: Maybe<TicketStatus>;
  oldStatus?: Maybe<TicketStatus>;
};

export type Ticket = Node & {
  __typename?: 'Ticket';
  assignedTo?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  customer: User;
  id: Scalars['ID']['output'];
  labels: Array<Label>;
  priority: TicketPriority;
  status: TicketStatus;
  statusChangedAt?: Maybe<Scalars['DateTime']['output']>;
  statusChangedBy?: Maybe<User>;
  statusDetail?: Maybe<TicketStatusDetail>;
  timelineEntries: TimelineEntryConnection;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
};


export type TicketTimelineEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type TicketConnection = {
  __typename?: 'TicketConnection';
  edges: Array<TicketEdge>;
  pageInfo: PageInfo;
};

export type TicketEdge = {
  __typename?: 'TicketEdge';
  cursor: Scalars['String']['output'];
  node: Ticket;
};

export enum TicketPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TicketStatus {
  Done = 'DONE',
  Open = 'OPEN'
}

export enum TicketStatusDetail {
  Created = 'CREATED',
  NewReply = 'NEW_REPLY',
  Replied = 'REPLIED'
}

export type TicketsFilter = {
  isAssigned?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TimelineEntry = Node & {
  __typename?: 'TimelineEntry';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['ID']['output'];
  entry: Entry;
  id: Scalars['ID']['output'];
  ticketId: Scalars['ID']['output'];
};

export type TimelineEntryConnection = {
  __typename?: 'TimelineEntryConnection';
  edges: Array<TimelineEntryEdge>;
  pageInfo: PageInfo;
};

export type TimelineEntryEdge = {
  __typename?: 'TimelineEntryEdge';
  cursor: Scalars['String']['output'];
  node: TimelineEntry;
};

export type UnarchiveLabelTypeInput = {
  id: Scalars['ID']['input'];
};

export type UpdateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type LabelTypesQueryVariables = Exact<{
  filters?: InputMaybe<LabelTypesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type LabelTypesQuery = { __typename?: 'Query', labelTypes: { __typename?: 'LabelTypeConnection', edges: Array<{ __typename?: 'LabelTypeEdge', cursor: string, node: { __typename?: 'LabelType', id: string, name: string, icon?: string | null } }> } };

export type TicketQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TicketQuery = { __typename?: 'Query', ticket?: { __typename?: 'Ticket', id: string, status: TicketStatus, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email?: string | null, image?: string | null } | null, customer: { __typename?: 'User', id: string, name?: string | null, email?: string | null, image?: string | null }, labels: Array<{ __typename?: 'Label', id: string, archivedAt?: any | null, labelType: { __typename?: 'LabelType', id: string, name: string, icon?: string | null, archivedAt?: any | null } }>, timelineEntries: { __typename?: 'TimelineEntryConnection', edges: Array<{ __typename?: 'TimelineEntryEdge', cursor: string, node: { __typename?: 'TimelineEntry', id: string, entry: { __typename?: 'AssignmentChangedEntry', oldAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email?: string | null, emailVerified?: any | null, image?: string | null } | null, newAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email?: string | null, emailVerified?: any | null, image?: string | null } | null } | { __typename?: 'ChatEntry', text: string } | { __typename?: 'LabelsChangedEntry', oldLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: any | null, labelType: { __typename?: 'LabelType', id: string, name: string, icon?: string | null, archivedAt?: any | null } }>, newLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: any | null, labelType: { __typename?: 'LabelType', id: string, name: string, icon?: string | null, archivedAt?: any | null } }> } | { __typename?: 'NoteEntry', text: string, rawContent: string } | { __typename?: 'PriorityChangedEntry', oldPriority?: TicketPriority | null, newPriority?: TicketPriority | null } | { __typename?: 'StatusChangedEntry', oldStatus?: TicketStatus | null, newStatus?: TicketStatus | null } } }> } } | null };



export const LabelTypesDocument = `
    query labelTypes($filters: LabelTypesFilter, $first: Int, $last: Int, $before: String, $after: String) {
  labelTypes(
    filters: $filters
    first: $first
    last: $last
    before: $before
    after: $after
  ) {
    edges {
      cursor
      node {
        id
        name
        icon
      }
    }
  }
}
    `;

export const useLabelTypesQuery = <
      TData = LabelTypesQuery,
      TError = unknown
    >(
      variables?: LabelTypesQueryVariables,
      options?: Omit<UseQueryOptions<LabelTypesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<LabelTypesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<LabelTypesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['labelTypes'] : ['labelTypes', variables],
    queryFn: fetcher<LabelTypesQuery, LabelTypesQueryVariables>(LabelTypesDocument, variables),
    ...options
  }
    )};

useLabelTypesQuery.getKey = (variables?: LabelTypesQueryVariables) => variables === undefined ? ['labelTypes'] : ['labelTypes', variables];


useLabelTypesQuery.fetcher = (variables?: LabelTypesQueryVariables) => fetcher<LabelTypesQuery, LabelTypesQueryVariables>(LabelTypesDocument, variables);

export const TicketDocument = `
    query ticket($id: ID!) {
  ticket(id: $id) {
    id
    assignedTo {
      id
      name
      email
      image
    }
    customer {
      id
      name
      email
      image
    }
    labels {
      id
      labelType {
        id
        name
        icon
        archivedAt
      }
      archivedAt
    }
    status
    timelineEntries {
      edges {
        cursor
        node {
          id
          entry {
            ... on AssignmentChangedEntry {
              oldAssignedTo {
                id
                name
                email
                emailVerified
                image
              }
              newAssignedTo {
                id
                name
                email
                emailVerified
                image
              }
            }
            ... on ChatEntry {
              text
            }
            ... on LabelsChangedEntry {
              oldLabels {
                id
                labelType {
                  id
                  name
                  icon
                  archivedAt
                }
                archivedAt
              }
              newLabels {
                id
                labelType {
                  id
                  name
                  icon
                  archivedAt
                }
                archivedAt
              }
            }
            ... on NoteEntry {
              text
              rawContent
            }
            ... on PriorityChangedEntry {
              oldPriority
              newPriority
            }
            ... on StatusChangedEntry {
              oldStatus
              newStatus
            }
          }
        }
      }
    }
  }
}
    `;

export const useTicketQuery = <
      TData = TicketQuery,
      TError = unknown
    >(
      variables: TicketQueryVariables,
      options?: Omit<UseQueryOptions<TicketQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TicketQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TicketQuery, TError, TData>(
      {
    queryKey: ['ticket', variables],
    queryFn: fetcher<TicketQuery, TicketQueryVariables>(TicketDocument, variables),
    ...options
  }
    )};

useTicketQuery.getKey = (variables: TicketQueryVariables) => ['ticket', variables];


useTicketQuery.fetcher = (variables: TicketQueryVariables) => fetcher<TicketQuery, TicketQueryVariables>(TicketDocument, variables);
