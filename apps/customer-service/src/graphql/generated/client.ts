import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/react-query';
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
  DateTime: { input: string; output: string; }
};

export type AddLabelsInput = {
  labelTypeIds: Array<Scalars['ID']['input']>;
  ticketId: Scalars['ID']['input'];
};

export type AddLabelsOutput = {
  __typename?: 'AddLabelsOutput';
  labels?: Maybe<Array<Label>>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type ArchiveLabelTypeInput = {
  id: Scalars['ID']['input'];
};

export type ArchiveLabelTypeOutput = {
  __typename?: 'ArchiveLabelTypeOutput';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type AssignTicketInput = {
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type AssignTicketOutput = {
  __typename?: 'AssignTicketOutput';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
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

export type CreateLabelTypeOutput = {
  __typename?: 'CreateLabelTypeOutput';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type CreateTicketInput = {
  customerId: Scalars['ID']['input'];
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  priority?: InputMaybe<TicketPriority>;
  title: Scalars['String']['input'];
};

export type CreateTicketOutput = {
  __typename?: 'CreateTicketOutput';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type Customer = Node & {
  __typename?: 'Customer';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<User>;
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
  addLabels?: Maybe<AddLabelsOutput>;
  archiveLabelType?: Maybe<ArchiveLabelTypeOutput>;
  assignTicket?: Maybe<AssignTicketOutput>;
  createLabelType?: Maybe<CreateLabelTypeOutput>;
  createTicket?: Maybe<CreateTicketOutput>;
  removeLabels?: Maybe<RemoveLabelsOutput>;
  unarchiveLabelType?: Maybe<UnarchiveLabelTypeOutput>;
  unassignTicket?: Maybe<UnassignTicketOutput>;
  updateLabelType?: Maybe<UpdateLabelTypeOutput>;
};


export type MutationAddLabelsArgs = {
  input: AddLabelsInput;
};


export type MutationArchiveLabelTypeArgs = {
  input: ArchiveLabelTypeInput;
};


export type MutationAssignTicketArgs = {
  input: AssignTicketInput;
};


export type MutationCreateLabelTypeArgs = {
  input: CreateLabelTypeInput;
};


export type MutationCreateTicketArgs = {
  input: CreateTicketInput;
};


export type MutationRemoveLabelsArgs = {
  input: RemoveLabelsInput;
};


export type MutationUnarchiveLabelTypeArgs = {
  input: UnarchiveLabelTypeInput;
};


export type MutationUnassignTicketArgs = {
  input: UnassignTicketInput;
};


export type MutationUpdateLabelTypeArgs = {
  input: UpdateLabelTypeInput;
};

export type MutationError = {
  __typename?: 'MutationError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  path: Array<Scalars['String']['output']>;
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
  customer?: Maybe<Customer>;
  labelType?: Maybe<LabelType>;
  labelTypes: LabelTypeConnection;
  ticket?: Maybe<Ticket>;
  tickets: TicketConnection;
  user?: Maybe<User>;
  users: UserConnection;
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
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

export type RemoveLabelsInput = {
  labelIds: Array<Scalars['ID']['input']>;
  ticketId: Scalars['ID']['input'];
};

export type RemoveLabelsOutput = {
  __typename?: 'RemoveLabelsOutput';
  userErrors?: Maybe<Array<MutationError>>;
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
  customer: Customer;
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
  customerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  isAssigned?: InputMaybe<Scalars['Boolean']['input']>;
  statuses?: InputMaybe<Array<TicketStatus>>;
};

export type TimelineEntry = Node & {
  __typename?: 'TimelineEntry';
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  customerCreatedBy?: Maybe<Customer>;
  entry: Entry;
  id: Scalars['ID']['output'];
  ticketId: Scalars['ID']['output'];
  userCreatedBy?: Maybe<User>;
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

export type UnarchiveLabelTypeOutput = {
  __typename?: 'UnarchiveLabelTypeOutput';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type UnassignTicketInput = {
  id: Scalars['ID']['input'];
};

export type UnassignTicketOutput = {
  __typename?: 'UnassignTicketOutput';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type UpdateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLabelTypeOutput = {
  __typename?: 'UpdateLabelTypeOutput';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type User = Node & {
  __typename?: 'User';
  email: Scalars['String']['output'];
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

export type CustomerPartsFragment = { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null };

export type LabelTypePartsFragment = { __typename?: 'LabelType', id: string, name: string, icon?: string | null };

export type LabelTypesQueryVariables = Exact<{
  filters?: InputMaybe<LabelTypesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type LabelTypesQuery = { __typename?: 'Query', labelTypes: { __typename?: 'LabelTypeConnection', edges: Array<{ __typename?: 'LabelTypeEdge', cursor: string, node: { __typename?: 'LabelType', id: string, name: string, icon?: string | null } }> } };

export type LabelPartsFragment = { __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } };

export type AddLabelsMutationVariables = Exact<{
  input: AddLabelsInput;
}>;


export type AddLabelsMutation = { __typename?: 'Mutation', addLabels?: { __typename?: 'AddLabelsOutput', labels?: Array<{ __typename?: 'Label', id: string }> | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type RemoveLabelsMutationVariables = Exact<{
  input: RemoveLabelsInput;
}>;


export type RemoveLabelsMutation = { __typename?: 'Mutation', removeLabels?: { __typename?: 'RemoveLabelsOutput', userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type TicketQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TicketQuery = { __typename?: 'Query', ticket?: { __typename?: 'Ticket', id: string, priority: TicketPriority, status: TicketStatus, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, labels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } | null };

export type TicketTimelineQueryVariables = Exact<{
  ticketId: Scalars['ID']['input'];
}>;


export type TicketTimelineQuery = { __typename?: 'Query', ticket?: { __typename?: 'Ticket', timelineEntries: { __typename?: 'TimelineEntryConnection', edges: Array<{ __typename?: 'TimelineEntryEdge', cursor: string, node: { __typename?: 'TimelineEntry', id: string, createdAt: string, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, entry: { __typename: 'AssignmentChangedEntry', oldAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, newAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null } | { __typename: 'ChatEntry', text: string } | { __typename: 'LabelsChangedEntry', oldLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }>, newLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } | { __typename: 'NoteEntry', text: string, rawContent: string } | { __typename: 'PriorityChangedEntry', oldPriority?: TicketPriority | null, newPriority?: TicketPriority | null } | { __typename: 'StatusChangedEntry', oldStatus?: TicketStatus | null, newStatus?: TicketStatus | null }, userCreatedBy?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customerCreatedBy?: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null } | null } }> } } | null };

export type TicketsQueryVariables = Exact<{
  filters?: InputMaybe<TicketsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type TicketsQuery = { __typename?: 'Query', tickets: { __typename?: 'TicketConnection', edges: Array<{ __typename?: 'TicketEdge', node: { __typename?: 'Ticket', id: string, title?: string | null, status: TicketStatus, statusChangedAt?: string | null, priority: TicketPriority, createdAt: string, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, labels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type UserPartsFragment = { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null };

export type UsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } }> } };


export const CustomerPartsFragmentDoc = `
    fragment CustomerParts on Customer {
  id
  name
  email
  phone
  avatarUrl
}
    `;
export const LabelTypePartsFragmentDoc = `
    fragment LabelTypeParts on LabelType {
  id
  name
  icon
}
    `;
export const LabelPartsFragmentDoc = `
    fragment LabelParts on Label {
  id
  labelType {
    ...LabelTypeParts
    archivedAt
  }
  archivedAt
}
    `;
export const UserPartsFragmentDoc = `
    fragment UserParts on User {
  id
  name
  email
  image
}
    `;
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
        ...LabelTypeParts
      }
    }
  }
}
    ${LabelTypePartsFragmentDoc}`;

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

export const useInfiniteLabelTypesQuery = <
      TData = InfiniteData<LabelTypesQuery>,
      TError = unknown
    >(
      variables: LabelTypesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<LabelTypesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<LabelTypesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<LabelTypesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['labelTypes.infinite'] : ['labelTypes.infinite', variables],
      queryFn: (metaData) => fetcher<LabelTypesQuery, LabelTypesQueryVariables>(LabelTypesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteLabelTypesQuery.getKey = (variables?: LabelTypesQueryVariables) => variables === undefined ? ['labelTypes.infinite'] : ['labelTypes.infinite', variables];


useLabelTypesQuery.fetcher = (variables?: LabelTypesQueryVariables) => fetcher<LabelTypesQuery, LabelTypesQueryVariables>(LabelTypesDocument, variables);

export const AddLabelsDocument = `
    mutation addLabels($input: AddLabelsInput!) {
  addLabels(input: $input) {
    labels {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useAddLabelsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddLabelsMutation, TError, AddLabelsMutationVariables, TContext>) => {
    
    return useMutation<AddLabelsMutation, TError, AddLabelsMutationVariables, TContext>(
      {
    mutationKey: ['addLabels'],
    mutationFn: (variables?: AddLabelsMutationVariables) => fetcher<AddLabelsMutation, AddLabelsMutationVariables>(AddLabelsDocument, variables)(),
    ...options
  }
    )};


useAddLabelsMutation.fetcher = (variables: AddLabelsMutationVariables) => fetcher<AddLabelsMutation, AddLabelsMutationVariables>(AddLabelsDocument, variables);

export const RemoveLabelsDocument = `
    mutation removeLabels($input: RemoveLabelsInput!) {
  removeLabels(input: $input) {
    userErrors {
      message
    }
  }
}
    `;

export const useRemoveLabelsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveLabelsMutation, TError, RemoveLabelsMutationVariables, TContext>) => {
    
    return useMutation<RemoveLabelsMutation, TError, RemoveLabelsMutationVariables, TContext>(
      {
    mutationKey: ['removeLabels'],
    mutationFn: (variables?: RemoveLabelsMutationVariables) => fetcher<RemoveLabelsMutation, RemoveLabelsMutationVariables>(RemoveLabelsDocument, variables)(),
    ...options
  }
    )};


useRemoveLabelsMutation.fetcher = (variables: RemoveLabelsMutationVariables) => fetcher<RemoveLabelsMutation, RemoveLabelsMutationVariables>(RemoveLabelsDocument, variables);

export const TicketDocument = `
    query ticket($id: ID!) {
  ticket(id: $id) {
    id
    assignedTo {
      ...UserParts
    }
    customer {
      ...CustomerParts
    }
    labels {
      ...LabelParts
    }
    priority
    status
  }
}
    ${UserPartsFragmentDoc}
${CustomerPartsFragmentDoc}
${LabelPartsFragmentDoc}
${LabelTypePartsFragmentDoc}`;

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

export const useInfiniteTicketQuery = <
      TData = InfiniteData<TicketQuery>,
      TError = unknown
    >(
      variables: TicketQueryVariables,
      options: Omit<UseInfiniteQueryOptions<TicketQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<TicketQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<TicketQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ticket.infinite', variables],
      queryFn: (metaData) => fetcher<TicketQuery, TicketQueryVariables>(TicketDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteTicketQuery.getKey = (variables: TicketQueryVariables) => ['ticket.infinite', variables];


useTicketQuery.fetcher = (variables: TicketQueryVariables) => fetcher<TicketQuery, TicketQueryVariables>(TicketDocument, variables);

export const TicketTimelineDocument = `
    query ticketTimeline($ticketId: ID!) {
  ticket(id: $ticketId) {
    timelineEntries {
      edges {
        cursor
        node {
          id
          customer {
            ...CustomerParts
          }
          entry {
            __typename
            ... on AssignmentChangedEntry {
              oldAssignedTo {
                ...UserParts
              }
              newAssignedTo {
                ...UserParts
              }
            }
            ... on ChatEntry {
              text
            }
            ... on LabelsChangedEntry {
              oldLabels {
                ...LabelParts
              }
              newLabels {
                ...LabelParts
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
          createdAt
          userCreatedBy {
            ...UserParts
          }
          customerCreatedBy {
            ...CustomerParts
          }
        }
      }
    }
  }
}
    ${CustomerPartsFragmentDoc}
${UserPartsFragmentDoc}
${LabelPartsFragmentDoc}
${LabelTypePartsFragmentDoc}`;

export const useTicketTimelineQuery = <
      TData = TicketTimelineQuery,
      TError = unknown
    >(
      variables: TicketTimelineQueryVariables,
      options?: Omit<UseQueryOptions<TicketTimelineQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TicketTimelineQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TicketTimelineQuery, TError, TData>(
      {
    queryKey: ['ticketTimeline', variables],
    queryFn: fetcher<TicketTimelineQuery, TicketTimelineQueryVariables>(TicketTimelineDocument, variables),
    ...options
  }
    )};

useTicketTimelineQuery.getKey = (variables: TicketTimelineQueryVariables) => ['ticketTimeline', variables];

export const useInfiniteTicketTimelineQuery = <
      TData = InfiniteData<TicketTimelineQuery>,
      TError = unknown
    >(
      variables: TicketTimelineQueryVariables,
      options: Omit<UseInfiniteQueryOptions<TicketTimelineQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<TicketTimelineQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<TicketTimelineQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ticketTimeline.infinite', variables],
      queryFn: (metaData) => fetcher<TicketTimelineQuery, TicketTimelineQueryVariables>(TicketTimelineDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteTicketTimelineQuery.getKey = (variables: TicketTimelineQueryVariables) => ['ticketTimeline.infinite', variables];


useTicketTimelineQuery.fetcher = (variables: TicketTimelineQueryVariables) => fetcher<TicketTimelineQuery, TicketTimelineQueryVariables>(TicketTimelineDocument, variables);

export const TicketsDocument = `
    query tickets($filters: TicketsFilter, $first: Int, $after: String, $last: Int, $before: String) {
  tickets(
    filters: $filters
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        id
        assignedTo {
          ...UserParts
        }
        title
        customer {
          ...CustomerParts
        }
        status
        statusChangedAt
        priority
        labels {
          ...LabelParts
        }
        createdAt
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  }
}
    ${UserPartsFragmentDoc}
${CustomerPartsFragmentDoc}
${LabelPartsFragmentDoc}
${LabelTypePartsFragmentDoc}`;

export const useTicketsQuery = <
      TData = TicketsQuery,
      TError = unknown
    >(
      variables?: TicketsQueryVariables,
      options?: Omit<UseQueryOptions<TicketsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TicketsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TicketsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['tickets'] : ['tickets', variables],
    queryFn: fetcher<TicketsQuery, TicketsQueryVariables>(TicketsDocument, variables),
    ...options
  }
    )};

useTicketsQuery.getKey = (variables?: TicketsQueryVariables) => variables === undefined ? ['tickets'] : ['tickets', variables];

export const useInfiniteTicketsQuery = <
      TData = InfiniteData<TicketsQuery>,
      TError = unknown
    >(
      variables: TicketsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<TicketsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<TicketsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<TicketsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['tickets.infinite'] : ['tickets.infinite', variables],
      queryFn: (metaData) => fetcher<TicketsQuery, TicketsQueryVariables>(TicketsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteTicketsQuery.getKey = (variables?: TicketsQueryVariables) => variables === undefined ? ['tickets.infinite'] : ['tickets.infinite', variables];


useTicketsQuery.fetcher = (variables?: TicketsQueryVariables) => fetcher<TicketsQuery, TicketsQueryVariables>(TicketsDocument, variables);

export const UsersDocument = `
    query users($first: Int, $last: Int, $before: String, $after: String) {
  users(first: $first, last: $last, before: $before, after: $after) {
    edges {
      cursor
      node {
        ...UserParts
      }
    }
  }
}
    ${UserPartsFragmentDoc}`;

export const useUsersQuery = <
      TData = UsersQuery,
      TError = unknown
    >(
      variables?: UsersQueryVariables,
      options?: Omit<UseQueryOptions<UsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['users'] : ['users', variables],
    queryFn: fetcher<UsersQuery, UsersQueryVariables>(UsersDocument, variables),
    ...options
  }
    )};

useUsersQuery.getKey = (variables?: UsersQueryVariables) => variables === undefined ? ['users'] : ['users', variables];

export const useInfiniteUsersQuery = <
      TData = InfiniteData<UsersQuery>,
      TError = unknown
    >(
      variables: UsersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UsersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['users.infinite'] : ['users.infinite', variables],
      queryFn: (metaData) => fetcher<UsersQuery, UsersQueryVariables>(UsersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUsersQuery.getKey = (variables?: UsersQueryVariables) => variables === undefined ? ['users.infinite'] : ['users.infinite', variables];


useUsersQuery.fetcher = (variables?: UsersQueryVariables) => fetcher<UsersQuery, UsersQueryVariables>(UsersDocument, variables);
