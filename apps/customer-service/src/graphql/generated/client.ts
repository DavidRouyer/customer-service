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
  /** An ISO-8601 encoded UTC date string. */
  DateTime: { input: string; output: string; }
};

/** Input type of AddLabels. */
export type AddLabelsInput = {
  /** The IDs of the label types to add. */
  labelTypeIds: Array<Scalars['ID']['input']>;
  /** The Node ID of the ticket to adds labels to. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of AddLabels. */
export type AddLabelsPayload = {
  __typename?: 'AddLabelsPayload';
  labels?: Maybe<Array<Label>>;
  /** Errors when adding labels to the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of ArchiveLabelType. */
export type ArchiveLabelTypeInput = {
  /** The Node ID of the label type to archive. */
  labelTypeId: Scalars['ID']['input'];
};

/** Return type of ArchiveLabelType. */
export type ArchiveLabelTypePayload = {
  __typename?: 'ArchiveLabelTypePayload';
  /** The archived label type. */
  labelType?: Maybe<LabelType>;
  /** Errors when archiving the label type. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of AssignTicket. */
export type AssignTicketInput = {
  /** The Node ID of the ticket to assign. */
  ticketId: Scalars['ID']['input'];
  /** The Node ID of the user to assign the ticket to. */
  userId: Scalars['ID']['input'];
};

/** Return type of AssignTicket. */
export type AssignTicketPayload = {
  __typename?: 'AssignTicketPayload';
  /** The assigned ticket. */
  ticket?: Maybe<Ticket>;
  /** Errors when assigning the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

export type AssignmentChangedEntry = {
  __typename?: 'AssignmentChangedEntry';
  newAssignedTo?: Maybe<User>;
  oldAssignedTo?: Maybe<User>;
};

/** Input type of ChangeTicketPriority. */
export type ChangeTicketPriorityInput = {
  /** The new priority of the ticket. */
  priority: TicketPriority;
  /** The Node ID of the ticket to change the priority of. */
  ticketId: Scalars['ID']['input'];
};

/** Input type of ChangeTicketPriority. */
export type ChangeTicketPriorityPayload = {
  __typename?: 'ChangeTicketPriorityPayload';
  /** The ticket with the new priority. */
  ticket?: Maybe<Ticket>;
  /** Errors when changing the priority of the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

export type ChatEntry = {
  __typename?: 'ChatEntry';
  text: Scalars['String']['output'];
};

/** Input type of CreateLabelType. */
export type CreateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Return type of CreateLabelType. */
export type CreateLabelTypePayload = {
  __typename?: 'CreateLabelTypePayload';
  /** The new label type. */
  labelType?: Maybe<LabelType>;
  /** Errors when creating the label type. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of CreateNote. */
export type CreateNoteInput = {
  rawContent: Scalars['String']['input'];
  /** The content of the note. */
  text: Scalars['String']['input'];
  /** The Node ID of the ticket to which the note belongs. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of CreateNote. */
export type CreateNotePayload = {
  __typename?: 'CreateNotePayload';
  /** The ticket with the new note. */
  ticket?: Maybe<Ticket>;
  /** Errors when creating the note. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of CreateTicket. */
export type CreateTicketInput = {
  /** The Node ID of the customer who is affected to the ticket. */
  customerId: Scalars['ID']['input'];
  /** The IDs of the labels to add to the ticket. */
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The priority of the ticket. */
  priority?: InputMaybe<TicketPriority>;
  /** The title of the ticket. */
  title: Scalars['String']['input'];
};

/** Return type of CreateTicket. */
export type CreateTicketPayload = {
  __typename?: 'CreateTicketPayload';
  /** The new ticket. */
  ticket?: Maybe<Ticket>;
  /** Errors when creating the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** A customer is a person that creates tickets. */
export type Customer = Node & {
  __typename?: 'Customer';
  /** A URL pointing to the customer's avatar. */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Identifies the date and time when the customer was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who created the customer. */
  createdBy: User;
  /** The email of the customer. */
  email?: Maybe<Scalars['String']['output']>;
  /** The Node ID of the Customer object. */
  id: Scalars['ID']['output'];
  /** The customer's preferred language. */
  language?: Maybe<Scalars['String']['output']>;
  /** The full name of the customer. */
  name?: Maybe<Scalars['String']['output']>;
  /** The phone number of the customer. */
  phone?: Maybe<Scalars['String']['output']>;
  /** The customer's timezone. */
  timezone?: Maybe<Scalars['String']['output']>;
  /** Identifies the date and time when the customer was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The user who last updated the customer. */
  updatedBy?: Maybe<User>;
};

export type Entry = AssignmentChangedEntry | ChatEntry | LabelsChangedEntry | NoteEntry | PriorityChangedEntry | StatusChangedEntry;

/** A label for categorizing tickets. */
export type Label = Node & {
  __typename?: 'Label';
  /** Identifies the date and time when the label was archived. */
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The Node ID of the Label object. */
  id: Scalars['ID']['output'];
  /** The label type of the label. */
  labelType: LabelType;
};

/** A label type for categorizing labels. */
export type LabelType = Node & {
  __typename?: 'LabelType';
  /** Identifies the date and time when the label type was archived. */
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Identifies the date and time when the label type was archived. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who created the label type. */
  createdBy: User;
  /** The icon of the label type. */
  icon?: Maybe<Scalars['String']['output']>;
  /** The Node ID of the LabelType object. */
  id: Scalars['ID']['output'];
  /** The name of the label type. */
  name: Scalars['String']['output'];
  /** Identifies the date and time when the label type was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The user who last updated the label type. */
  updatedBy?: Maybe<User>;
};

/** A list of label types. */
export type LabelTypeConnection = {
  __typename?: 'LabelTypeConnection';
  /** A list of edges. */
  edges: Array<LabelTypeEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** Represents a label type. */
export type LabelTypeEdge = {
  __typename?: 'LabelTypeEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: LabelType;
};

/** Ways in which to filter lists of label types. */
export type LabelTypeFilters = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LabelsChangedEntry = {
  __typename?: 'LabelsChangedEntry';
  newLabels: Array<Label>;
  oldLabels: Array<Label>;
};

/** Input type of MarkTicketAsDone. */
export type MarkTicketAsDoneInput = {
  /** The Node ID of the ticket to mark as done. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of MarkTicketAsDone. */
export type MarkTicketAsDonePayload = {
  __typename?: 'MarkTicketAsDonePayload';
  /** The ticket with the new status. */
  ticket?: Maybe<Ticket>;
  /** Errors when marking the ticket as done. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of MarkTicketAsOpen. */
export type MarkTicketAsOpenInput = {
  /** The Node ID of the ticket to mark as open. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of MarkTicketAsOpen. */
export type MarkTicketAsOpenPayload = {
  __typename?: 'MarkTicketAsOpenPayload';
  /** The ticket with the new status. */
  ticket?: Maybe<Ticket>;
  /** Errors when marking the ticket as open. */
  userErrors?: Maybe<Array<MutationError>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add labels to a ticket. */
  addLabels?: Maybe<AddLabelsPayload>;
  /** Archive a label type. */
  archiveLabelType?: Maybe<ArchiveLabelTypePayload>;
  /** Assign a ticket to a user. */
  assignTicket?: Maybe<AssignTicketPayload>;
  /** Change the priority of a ticket. */
  changeTicketPriority?: Maybe<ChangeTicketPriorityPayload>;
  /** Create a label type. */
  createLabelType?: Maybe<CreateLabelTypePayload>;
  /** Create a note for a ticket. */
  createNote?: Maybe<CreateNotePayload>;
  /** Create a ticket. */
  createTicket?: Maybe<CreateTicketPayload>;
  /** Mark a ticket as done. */
  markTicketAsDone?: Maybe<MarkTicketAsDonePayload>;
  /** Mark a ticket as open. */
  markTicketAsOpen?: Maybe<MarkTicketAsOpenPayload>;
  /** Remove labels to a ticket. */
  removeLabels?: Maybe<RemoveLabelsPayload>;
  /** Create a chat for a ticket. */
  sendChat?: Maybe<SendChatPayload>;
  /** Unarchive a label type. */
  unarchiveLabelType?: Maybe<UnarchiveLabelTypePayload>;
  /** Unassign a ticket. */
  unassignTicket?: Maybe<UnassignTicketPayload>;
  /** Update a label type. */
  updateLabelType?: Maybe<UpdateLabelTypePayload>;
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


export type MutationChangeTicketPriorityArgs = {
  input: ChangeTicketPriorityInput;
};


export type MutationCreateLabelTypeArgs = {
  input: CreateLabelTypeInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateTicketArgs = {
  input: CreateTicketInput;
};


export type MutationMarkTicketAsDoneArgs = {
  input: MarkTicketAsDoneInput;
};


export type MutationMarkTicketAsOpenArgs = {
  input: MarkTicketAsOpenInput;
};


export type MutationRemoveLabelsArgs = {
  input: RemoveLabelsInput;
};


export type MutationSendChatArgs = {
  input: SendChatInput;
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

/** Represents an error in a mutation. */
export type MutationError = {
  __typename?: 'MutationError';
  /** The error code. */
  code: Scalars['String']['output'];
  /** The error message. */
  message: Scalars['String']['output'];
  /** The path to the input field that caused the error. */
  path: Array<Scalars['String']['output']>;
};

/** An object with an ID. */
export type Node = {
  /** ID of the object. */
  id: Scalars['ID']['output'];
};

export type NoteEntry = {
  __typename?: 'NoteEntry';
  rawContent: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PriorityChangedEntry = {
  __typename?: 'PriorityChangedEntry';
  newPriority?: Maybe<TicketPriority>;
  oldPriority?: Maybe<TicketPriority>;
};

export type Query = {
  __typename?: 'Query';
  /** Fetches a customer given its ID. */
  customer?: Maybe<Customer>;
  /** Fetches a label type given its ID. */
  labelType?: Maybe<LabelType>;
  /** Fetches a list of label types. */
  labelTypes: LabelTypeConnection;
  /** Fetches information of the current user. */
  myUserInfo?: Maybe<User>;
  /** Fetches a ticket given its ID. */
  ticket?: Maybe<Ticket>;
  /** Fetches a list of tickets. */
  tickets: TicketConnection;
  /** Fetches a user given its ID. */
  user?: Maybe<User>;
  /** Fetches a list of users. */
  users: UserConnection;
};


export type QueryCustomerArgs = {
  customerId: Scalars['ID']['input'];
};


export type QueryLabelTypeArgs = {
  labelTypeId: Scalars['ID']['input'];
};


export type QueryLabelTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<LabelTypeFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type QueryTicketsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TicketFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** Input type of RemoveLabels. */
export type RemoveLabelsInput = {
  /** The IDs of the labels to remove. */
  labelIds: Array<Scalars['ID']['input']>;
  /** The Node ID of the ticket to remove labels to. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of RemoveLabels. */
export type RemoveLabelsPayload = {
  __typename?: 'RemoveLabelsPayload';
  /** Errors when removing labels to the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of SendChat. */
export type SendChatInput = {
  /** The content of the chat. */
  text: Scalars['String']['input'];
  /** The Node ID of the ticket to which the chat belongs. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of SendChat. */
export type SendChatPayload = {
  __typename?: 'SendChatPayload';
  /** The ticket with the new chat. */
  ticket?: Maybe<Ticket>;
  /** Errors when creating the chat. */
  userErrors?: Maybe<Array<MutationError>>;
};

export type StatusChangedEntry = {
  __typename?: 'StatusChangedEntry';
  newStatus?: Maybe<TicketStatus>;
  oldStatus?: Maybe<TicketStatus>;
};

/** A ticket is a place to discuss ideas, enhancements, tasks and bugs. */
export type Ticket = Node & {
  __typename?: 'Ticket';
  /** The user to whom the ticket is assigned. */
  assignedTo?: Maybe<User>;
  /** Identifies the date and time when the ticket was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who created the ticket. */
  createdBy: User;
  /** The customer who is affected to the ticket. */
  customer: Customer;
  /** The Node ID of the Ticket object. */
  id: Scalars['ID']['output'];
  /** The labels of the ticket. */
  labels: Array<Label>;
  /** The priority of the ticket. */
  priority: TicketPriority;
  /** The status of the ticket. */
  status: TicketStatus;
  /** The date and time when the ticket status was last changed. */
  statusChangedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The user who last changed the ticket status. */
  statusChangedBy?: Maybe<User>;
  /** The status detail of the ticket. */
  statusDetail?: Maybe<TicketStatusDetail>;
  /** The timeline entries of the ticket. */
  timelineEntries: TimelineEntryConnection;
  /** The title of the ticket. */
  title?: Maybe<Scalars['String']['output']>;
  /** Identifies the date and time when the ticket was last updated. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The user who last updated the ticket. */
  updatedBy?: Maybe<User>;
};


/** A ticket is a place to discuss ideas, enhancements, tasks and bugs. */
export type TicketTimelineEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** A list of tickets. */
export type TicketConnection = {
  __typename?: 'TicketConnection';
  /** A list of edges. */
  edges: Array<TicketEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** Represents a ticket. */
export type TicketEdge = {
  __typename?: 'TicketEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Ticket;
};

/** Ways in which to filter lists of tickets. */
export type TicketFilters = {
  customerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  isAssigned?: InputMaybe<Scalars['Boolean']['input']>;
  statuses?: InputMaybe<Array<TicketStatus>>;
};

/** Possible priorities a ticket may have. */
export enum TicketPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** Possible statuses a ticket may have. */
export enum TicketStatus {
  Done = 'DONE',
  Open = 'OPEN'
}

/** Possible status details a ticket may have. */
export enum TicketStatusDetail {
  Created = 'CREATED',
  NewReply = 'NEW_REPLY',
  Replied = 'REPLIED'
}

/** An entry of the timeline. */
export type TimelineEntry = Node & {
  __typename?: 'TimelineEntry';
  /** Identifies the date and time when the timeline entry was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The customer who is affected to the timeline entry. */
  customer: Customer;
  /** The customer who created the timeline entry. */
  customerCreatedBy?: Maybe<Customer>;
  /** The entry content. */
  entry: Entry;
  /** The Node ID of the TimelineEntry object. */
  id: Scalars['ID']['output'];
  /** The Node ID of the ticket to which the timeline entry belongs. */
  ticketId: Scalars['ID']['output'];
  /** The user who created the timeline entry. */
  userCreatedBy?: Maybe<User>;
};

/** A list of timeline entries. */
export type TimelineEntryConnection = {
  __typename?: 'TimelineEntryConnection';
  /** A list of edges. */
  edges: Array<TimelineEntryEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** Represents a timeline entry. */
export type TimelineEntryEdge = {
  __typename?: 'TimelineEntryEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TimelineEntry;
};

/** Input type of UnarchiveLabelType. */
export type UnarchiveLabelTypeInput = {
  /** The Node ID of the label type to unarchive. */
  labelTypeId: Scalars['ID']['input'];
};

/** Return type of UnarchiveLabelType. */
export type UnarchiveLabelTypePayload = {
  __typename?: 'UnarchiveLabelTypePayload';
  /** The unarchived label type. */
  labelType?: Maybe<LabelType>;
  /** Errors when unarchiving the label type. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of UnassignTicket. */
export type UnassignTicketInput = {
  /** The Node ID of the ticket to unassign. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of UnassignTicket. */
export type UnassignTicketPayload = {
  __typename?: 'UnassignTicketPayload';
  /** The unassigned ticket. */
  ticket?: Maybe<Ticket>;
  /** Errors when unassigning the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** Input type of UpdateLabelType. */
export type UpdateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Return type of UpdateLabelType. */
export type UpdateLabelTypePayload = {
  __typename?: 'UpdateLabelTypePayload';
  /** The updated label type. */
  labelType?: Maybe<LabelType>;
  /** Errors when updating the label type. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** The Kyaku user corresponding to the email field. Null if no such user exists */
export type User = Node & {
  __typename?: 'User';
  /** The user's profile email */
  email: Scalars['String']['output'];
  /** Identifies the date and time when the user's email was confirmed. */
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  /** The Node ID of the User object */
  id: Scalars['ID']['output'];
  /** A URL pointing to the user's profile avatar */
  image?: Maybe<Scalars['String']['output']>;
  /** The user's profile name */
  name?: Maybe<Scalars['String']['output']>;
};

/** A list of users. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** A list of edges. */
  edges: Array<UserEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** Represents a user. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: User;
};

export type CustomerPartsFragment = { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null };

export type LabelTypePartsFragment = { __typename?: 'LabelType', id: string, name: string, icon?: string | null };

export type LabelTypesQueryVariables = Exact<{
  filters?: InputMaybe<LabelTypeFilters>;
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


export type AddLabelsMutation = { __typename?: 'Mutation', addLabels?: { __typename?: 'AddLabelsPayload', labels?: Array<{ __typename?: 'Label', id: string }> | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type RemoveLabelsMutationVariables = Exact<{
  input: RemoveLabelsInput;
}>;


export type RemoveLabelsMutation = { __typename?: 'Mutation', removeLabels?: { __typename?: 'RemoveLabelsPayload', userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type TicketQueryVariables = Exact<{
  ticketId: Scalars['ID']['input'];
}>;


export type TicketQuery = { __typename?: 'Query', ticket?: { __typename?: 'Ticket', id: string, priority: TicketPriority, status: TicketStatus, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, labels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } | null };

export type TicketTimelineQueryVariables = Exact<{
  ticketId: Scalars['ID']['input'];
}>;


export type TicketTimelineQuery = { __typename?: 'Query', ticket?: { __typename?: 'Ticket', timelineEntries: { __typename?: 'TimelineEntryConnection', edges: Array<{ __typename?: 'TimelineEntryEdge', cursor: string, node: { __typename?: 'TimelineEntry', id: string, createdAt: string, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, entry: { __typename: 'AssignmentChangedEntry', oldAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, newAssignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null } | { __typename: 'ChatEntry', text: string } | { __typename: 'LabelsChangedEntry', oldLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }>, newLabels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } | { __typename: 'NoteEntry', text: string, rawContent: string } | { __typename: 'PriorityChangedEntry', oldPriority?: TicketPriority | null, newPriority?: TicketPriority | null } | { __typename: 'StatusChangedEntry', oldStatus?: TicketStatus | null, newStatus?: TicketStatus | null }, userCreatedBy?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customerCreatedBy?: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null } | null } }> } } | null };

export type TicketsQueryVariables = Exact<{
  filters?: InputMaybe<TicketFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type TicketsQuery = { __typename?: 'Query', tickets: { __typename?: 'TicketConnection', edges: Array<{ __typename?: 'TicketEdge', node: { __typename?: 'Ticket', id: string, title?: string | null, status: TicketStatus, statusChangedAt?: string | null, priority: TicketPriority, createdAt: string, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null, customer: { __typename?: 'Customer', id: string, name?: string | null, email?: string | null, phone?: string | null, avatarUrl?: string | null }, labels: Array<{ __typename?: 'Label', id: string, archivedAt?: string | null, labelType: { __typename?: 'LabelType', archivedAt?: string | null, id: string, name: string, icon?: string | null } }> } }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type AssignTicketMutationVariables = Exact<{
  input: AssignTicketInput;
}>;


export type AssignTicketMutation = { __typename?: 'Mutation', assignTicket?: { __typename?: 'AssignTicketPayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type ChangeTicketPriorityMutationVariables = Exact<{
  input: ChangeTicketPriorityInput;
}>;


export type ChangeTicketPriorityMutation = { __typename?: 'Mutation', changeTicketPriority?: { __typename?: 'ChangeTicketPriorityPayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote?: { __typename?: 'CreateNotePayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type MarkTicketAsDoneMutationVariables = Exact<{
  input: MarkTicketAsDoneInput;
}>;


export type MarkTicketAsDoneMutation = { __typename?: 'Mutation', markTicketAsDone?: { __typename?: 'MarkTicketAsDonePayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type MarkTicketAsOpenMutationVariables = Exact<{
  input: MarkTicketAsOpenInput;
}>;


export type MarkTicketAsOpenMutation = { __typename?: 'Mutation', markTicketAsOpen?: { __typename?: 'MarkTicketAsOpenPayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type SendChatMutationVariables = Exact<{
  input: SendChatInput;
}>;


export type SendChatMutation = { __typename?: 'Mutation', sendChat?: { __typename?: 'SendChatPayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type UnassignTicketMutationVariables = Exact<{
  input: UnassignTicketInput;
}>;


export type UnassignTicketMutation = { __typename?: 'Mutation', unassignTicket?: { __typename?: 'UnassignTicketPayload', ticket?: { __typename?: 'Ticket', id: string } | null, userErrors?: Array<{ __typename?: 'MutationError', message: string }> | null } | null };

export type UserPartsFragment = { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null };

export type MyUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUserInfoQuery = { __typename?: 'Query', myUserInfo?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null };

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
    query labelTypes($filters: LabelTypeFilters, $first: Int, $last: Int, $before: String, $after: String) {
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
    query ticket($ticketId: ID!) {
  ticket(ticketId: $ticketId) {
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
  ticket(ticketId: $ticketId) {
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
    query tickets($filters: TicketFilters, $first: Int, $after: String, $last: Int, $before: String) {
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

export const AssignTicketDocument = `
    mutation assignTicket($input: AssignTicketInput!) {
  assignTicket(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useAssignTicketMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AssignTicketMutation, TError, AssignTicketMutationVariables, TContext>) => {
    
    return useMutation<AssignTicketMutation, TError, AssignTicketMutationVariables, TContext>(
      {
    mutationKey: ['assignTicket'],
    mutationFn: (variables?: AssignTicketMutationVariables) => fetcher<AssignTicketMutation, AssignTicketMutationVariables>(AssignTicketDocument, variables)(),
    ...options
  }
    )};


useAssignTicketMutation.fetcher = (variables: AssignTicketMutationVariables) => fetcher<AssignTicketMutation, AssignTicketMutationVariables>(AssignTicketDocument, variables);

export const ChangeTicketPriorityDocument = `
    mutation changeTicketPriority($input: ChangeTicketPriorityInput!) {
  changeTicketPriority(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useChangeTicketPriorityMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ChangeTicketPriorityMutation, TError, ChangeTicketPriorityMutationVariables, TContext>) => {
    
    return useMutation<ChangeTicketPriorityMutation, TError, ChangeTicketPriorityMutationVariables, TContext>(
      {
    mutationKey: ['changeTicketPriority'],
    mutationFn: (variables?: ChangeTicketPriorityMutationVariables) => fetcher<ChangeTicketPriorityMutation, ChangeTicketPriorityMutationVariables>(ChangeTicketPriorityDocument, variables)(),
    ...options
  }
    )};


useChangeTicketPriorityMutation.fetcher = (variables: ChangeTicketPriorityMutationVariables) => fetcher<ChangeTicketPriorityMutation, ChangeTicketPriorityMutationVariables>(ChangeTicketPriorityDocument, variables);

export const CreateNoteDocument = `
    mutation createNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useCreateNoteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateNoteMutation, TError, CreateNoteMutationVariables, TContext>) => {
    
    return useMutation<CreateNoteMutation, TError, CreateNoteMutationVariables, TContext>(
      {
    mutationKey: ['createNote'],
    mutationFn: (variables?: CreateNoteMutationVariables) => fetcher<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, variables)(),
    ...options
  }
    )};


useCreateNoteMutation.fetcher = (variables: CreateNoteMutationVariables) => fetcher<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, variables);

export const MarkTicketAsDoneDocument = `
    mutation markTicketAsDone($input: MarkTicketAsDoneInput!) {
  markTicketAsDone(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useMarkTicketAsDoneMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkTicketAsDoneMutation, TError, MarkTicketAsDoneMutationVariables, TContext>) => {
    
    return useMutation<MarkTicketAsDoneMutation, TError, MarkTicketAsDoneMutationVariables, TContext>(
      {
    mutationKey: ['markTicketAsDone'],
    mutationFn: (variables?: MarkTicketAsDoneMutationVariables) => fetcher<MarkTicketAsDoneMutation, MarkTicketAsDoneMutationVariables>(MarkTicketAsDoneDocument, variables)(),
    ...options
  }
    )};


useMarkTicketAsDoneMutation.fetcher = (variables: MarkTicketAsDoneMutationVariables) => fetcher<MarkTicketAsDoneMutation, MarkTicketAsDoneMutationVariables>(MarkTicketAsDoneDocument, variables);

export const MarkTicketAsOpenDocument = `
    mutation markTicketAsOpen($input: MarkTicketAsOpenInput!) {
  markTicketAsOpen(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useMarkTicketAsOpenMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkTicketAsOpenMutation, TError, MarkTicketAsOpenMutationVariables, TContext>) => {
    
    return useMutation<MarkTicketAsOpenMutation, TError, MarkTicketAsOpenMutationVariables, TContext>(
      {
    mutationKey: ['markTicketAsOpen'],
    mutationFn: (variables?: MarkTicketAsOpenMutationVariables) => fetcher<MarkTicketAsOpenMutation, MarkTicketAsOpenMutationVariables>(MarkTicketAsOpenDocument, variables)(),
    ...options
  }
    )};


useMarkTicketAsOpenMutation.fetcher = (variables: MarkTicketAsOpenMutationVariables) => fetcher<MarkTicketAsOpenMutation, MarkTicketAsOpenMutationVariables>(MarkTicketAsOpenDocument, variables);

export const SendChatDocument = `
    mutation sendChat($input: SendChatInput!) {
  sendChat(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useSendChatMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SendChatMutation, TError, SendChatMutationVariables, TContext>) => {
    
    return useMutation<SendChatMutation, TError, SendChatMutationVariables, TContext>(
      {
    mutationKey: ['sendChat'],
    mutationFn: (variables?: SendChatMutationVariables) => fetcher<SendChatMutation, SendChatMutationVariables>(SendChatDocument, variables)(),
    ...options
  }
    )};


useSendChatMutation.fetcher = (variables: SendChatMutationVariables) => fetcher<SendChatMutation, SendChatMutationVariables>(SendChatDocument, variables);

export const UnassignTicketDocument = `
    mutation unassignTicket($input: UnassignTicketInput!) {
  unassignTicket(input: $input) {
    ticket {
      id
    }
    userErrors {
      message
    }
  }
}
    `;

export const useUnassignTicketMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnassignTicketMutation, TError, UnassignTicketMutationVariables, TContext>) => {
    
    return useMutation<UnassignTicketMutation, TError, UnassignTicketMutationVariables, TContext>(
      {
    mutationKey: ['unassignTicket'],
    mutationFn: (variables?: UnassignTicketMutationVariables) => fetcher<UnassignTicketMutation, UnassignTicketMutationVariables>(UnassignTicketDocument, variables)(),
    ...options
  }
    )};


useUnassignTicketMutation.fetcher = (variables: UnassignTicketMutationVariables) => fetcher<UnassignTicketMutation, UnassignTicketMutationVariables>(UnassignTicketDocument, variables);

export const MyUserInfoDocument = `
    query myUserInfo {
  myUserInfo {
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;

export const useMyUserInfoQuery = <
      TData = MyUserInfoQuery,
      TError = unknown
    >(
      variables?: MyUserInfoQueryVariables,
      options?: Omit<UseQueryOptions<MyUserInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MyUserInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MyUserInfoQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['myUserInfo'] : ['myUserInfo', variables],
    queryFn: fetcher<MyUserInfoQuery, MyUserInfoQueryVariables>(MyUserInfoDocument, variables),
    ...options
  }
    )};

useMyUserInfoQuery.getKey = (variables?: MyUserInfoQueryVariables) => variables === undefined ? ['myUserInfo'] : ['myUserInfo', variables];

export const useInfiniteMyUserInfoQuery = <
      TData = InfiniteData<MyUserInfoQuery>,
      TError = unknown
    >(
      variables: MyUserInfoQueryVariables,
      options: Omit<UseInfiniteQueryOptions<MyUserInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<MyUserInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<MyUserInfoQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['myUserInfo.infinite'] : ['myUserInfo.infinite', variables],
      queryFn: (metaData) => fetcher<MyUserInfoQuery, MyUserInfoQueryVariables>(MyUserInfoDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteMyUserInfoQuery.getKey = (variables?: MyUserInfoQueryVariables) => variables === undefined ? ['myUserInfo.infinite'] : ['myUserInfo.infinite', variables];


useMyUserInfoQuery.fetcher = (variables?: MyUserInfoQueryVariables) => fetcher<MyUserInfoQuery, MyUserInfoQueryVariables>(MyUserInfoDocument, variables);

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
