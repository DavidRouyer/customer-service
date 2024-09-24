/* eslint-disable */
import type { TicketStatusDetail } from '@cs/kyaku/models';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Context } from '../graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An ISO-8601 encoded UTC date string. */
  DateTime: { input: any; output: any; }
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

/** Represents a ticket assignment change in the timeline. */
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

/** Represents a chat in the timeline. */
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

export enum DoneTicketStatusDetail {
  DoneAutomaticallySet = 'DONE_AUTOMATICALLY_SET',
  DoneManuallySet = 'DONE_MANUALLY_SET',
  Ignored = 'IGNORED'
}

/** A union of all possible entries that can appear in a timeline. */
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

/** Represents a label change in the timeline. */
export type LabelsChangedEntry = {
  __typename?: 'LabelsChangedEntry';
  newLabels: Array<Label>;
  oldLabels: Array<Label>;
};

/** Input type of MarkTicketAsDone. */
export type MarkTicketAsDoneInput = {
  statusDetail?: InputMaybe<DoneTicketStatusDetail>;
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

/** Input type of MarkTicketAsTodo. */
export type MarkTicketAsTodoInput = {
  statusDetail?: InputMaybe<TodoTicketStatusDetail>;
  /** The Node ID of the ticket to mark as todo. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of MarkTicketAsTodo. */
export type MarkTicketAsTodoPayload = {
  __typename?: 'MarkTicketAsTodoPayload';
  /** The ticket with the new status. */
  ticket?: Maybe<Ticket>;
  /** Errors when marking the ticket as todo. */
  userErrors?: Maybe<Array<MutationError>>;
};

/** The mutation root of Kyaku's GraphQL interface. */
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
  /** Mark a ticket as todo. */
  markTicketAsTodo?: Maybe<MarkTicketAsTodoPayload>;
  /** Remove labels to a ticket. */
  removeLabels?: Maybe<RemoveLabelsPayload>;
  /** Create a chat for a ticket. */
  sendChat?: Maybe<SendChatPayload>;
  snoozeTicket?: Maybe<SnoozeTicketPayload>;
  /** Unarchive a label type. */
  unarchiveLabelType?: Maybe<UnarchiveLabelTypePayload>;
  /** Unassign a ticket. */
  unassignTicket?: Maybe<UnassignTicketPayload>;
  /** Update a label type. */
  updateLabelType?: Maybe<UpdateLabelTypePayload>;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationAddLabelsArgs = {
  input: AddLabelsInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationArchiveLabelTypeArgs = {
  input: ArchiveLabelTypeInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationAssignTicketArgs = {
  input: AssignTicketInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationChangeTicketPriorityArgs = {
  input: ChangeTicketPriorityInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationCreateLabelTypeArgs = {
  input: CreateLabelTypeInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationCreateTicketArgs = {
  input: CreateTicketInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationMarkTicketAsDoneArgs = {
  input: MarkTicketAsDoneInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationMarkTicketAsTodoArgs = {
  input: MarkTicketAsTodoInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationRemoveLabelsArgs = {
  input: RemoveLabelsInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationSendChatArgs = {
  input: SendChatInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationSnoozeTicketArgs = {
  input: SnoozeTicketInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationUnarchiveLabelTypeArgs = {
  input: UnarchiveLabelTypeInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
export type MutationUnassignTicketArgs = {
  input: UnassignTicketInput;
};


/** The mutation root of Kyaku's GraphQL interface. */
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

/** Represents a note in the timeline. */
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

/** Represents a priority change in the timeline. */
export type PriorityChangedEntry = {
  __typename?: 'PriorityChangedEntry';
  newPriority?: Maybe<TicketPriority>;
  oldPriority?: Maybe<TicketPriority>;
};

/** The query root of Kyaku's GraphQL interface. */
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


/** The query root of Kyaku's GraphQL interface. */
export type QueryCustomerArgs = {
  customerId: Scalars['ID']['input'];
};


/** The query root of Kyaku's GraphQL interface. */
export type QueryLabelTypeArgs = {
  labelTypeId: Scalars['ID']['input'];
};


/** The query root of Kyaku's GraphQL interface. */
export type QueryLabelTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<LabelTypeFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** The query root of Kyaku's GraphQL interface. */
export type QueryTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


/** The query root of Kyaku's GraphQL interface. */
export type QueryTicketsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TicketFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** The query root of Kyaku's GraphQL interface. */
export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};


/** The query root of Kyaku's GraphQL interface. */
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

/** Input type of SendChat. */
export type SnoozeTicketInput = {
  statusDetail?: InputMaybe<SnoozeTicketStatusDetail>;
  /** The Node ID of the ticket to snooze. */
  ticketId: Scalars['ID']['input'];
};

/** Return type of SnoozeTicket. */
export type SnoozeTicketPayload = {
  __typename?: 'SnoozeTicketPayload';
  /** The ticket with the new status. */
  ticket?: Maybe<Ticket>;
  /** Errors when snoozing the ticket. */
  userErrors?: Maybe<Array<MutationError>>;
};

export enum SnoozeTicketStatusDetail {
  WaitingForCustomer = 'WAITING_FOR_CUSTOMER',
  WaitingForDuration = 'WAITING_FOR_DURATION'
}

/** Represents a status change in the timeline. */
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
  Snoozed = 'SNOOZED',
  Todo = 'TODO'
}

export { TicketStatusDetail };

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

export enum TodoTicketStatusDetail {
  CloseTheLoop = 'CLOSE_THE_LOOP',
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  NewReply = 'NEW_REPLY'
}

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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  Entry: ( AssignmentChangedEntry ) | ( ChatEntry ) | ( LabelsChangedEntry ) | ( NoteEntry ) | ( PriorityChangedEntry ) | ( StatusChangedEntry );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Node: ( Customer ) | ( Label ) | ( LabelType ) | ( Omit<Ticket, 'customer' | 'timelineEntries'> & { customer: _RefType['Customer'], timelineEntries: _RefType['TimelineEntryConnection'] } ) | ( Omit<TimelineEntry, 'customer' | 'customerCreatedBy' | 'entry'> & { customer: _RefType['Customer'], customerCreatedBy?: Maybe<_RefType['Customer']>, entry: _RefType['Entry'] } ) | ( User );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddLabelsInput: AddLabelsInput;
  AddLabelsPayload: ResolverTypeWrapper<AddLabelsPayload>;
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  ArchiveLabelTypePayload: ResolverTypeWrapper<ArchiveLabelTypePayload>;
  AssignTicketInput: AssignTicketInput;
  AssignTicketPayload: ResolverTypeWrapper<Omit<AssignTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  AssignmentChangedEntry: ResolverTypeWrapper<AssignmentChangedEntry>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChangeTicketPriorityInput: ChangeTicketPriorityInput;
  ChangeTicketPriorityPayload: ResolverTypeWrapper<Omit<ChangeTicketPriorityPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  ChatEntry: ResolverTypeWrapper<ChatEntry>;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypePayload: ResolverTypeWrapper<CreateLabelTypePayload>;
  CreateNoteInput: CreateNoteInput;
  CreateNotePayload: ResolverTypeWrapper<Omit<CreateNotePayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  CreateTicketInput: CreateTicketInput;
  CreateTicketPayload: ResolverTypeWrapper<Omit<CreateTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  Customer: ResolverTypeWrapper<Customer>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DoneTicketStatusDetail: DoneTicketStatusDetail;
  Entry: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Entry']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Label: ResolverTypeWrapper<Label>;
  LabelType: ResolverTypeWrapper<LabelType>;
  LabelTypeConnection: ResolverTypeWrapper<LabelTypeConnection>;
  LabelTypeEdge: ResolverTypeWrapper<LabelTypeEdge>;
  LabelTypeFilters: LabelTypeFilters;
  LabelsChangedEntry: ResolverTypeWrapper<LabelsChangedEntry>;
  MarkTicketAsDoneInput: MarkTicketAsDoneInput;
  MarkTicketAsDonePayload: ResolverTypeWrapper<Omit<MarkTicketAsDonePayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  MarkTicketAsTodoInput: MarkTicketAsTodoInput;
  MarkTicketAsTodoPayload: ResolverTypeWrapper<Omit<MarkTicketAsTodoPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationError: ResolverTypeWrapper<MutationError>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NoteEntry: ResolverTypeWrapper<NoteEntry>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PriorityChangedEntry: ResolverTypeWrapper<PriorityChangedEntry>;
  Query: ResolverTypeWrapper<{}>;
  RemoveLabelsInput: RemoveLabelsInput;
  RemoveLabelsPayload: ResolverTypeWrapper<RemoveLabelsPayload>;
  SendChatInput: SendChatInput;
  SendChatPayload: ResolverTypeWrapper<Omit<SendChatPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  SnoozeTicketInput: SnoozeTicketInput;
  SnoozeTicketPayload: ResolverTypeWrapper<Omit<SnoozeTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  SnoozeTicketStatusDetail: SnoozeTicketStatusDetail;
  StatusChangedEntry: ResolverTypeWrapper<StatusChangedEntry>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Ticket: ResolverTypeWrapper<Omit<Ticket, 'customer' | 'timelineEntries'> & { customer: ResolversTypes['Customer'], timelineEntries: ResolversTypes['TimelineEntryConnection'] }>;
  TicketConnection: ResolverTypeWrapper<Omit<TicketConnection, 'edges'> & { edges: Array<ResolversTypes['TicketEdge']> }>;
  TicketEdge: ResolverTypeWrapper<Omit<TicketEdge, 'node'> & { node: ResolversTypes['Ticket'] }>;
  TicketFilters: TicketFilters;
  TicketPriority: TicketPriority;
  TicketStatus: TicketStatus;
  TicketStatusDetail: TicketStatusDetail;
  TimelineEntry: ResolverTypeWrapper<Omit<TimelineEntry, 'customer' | 'customerCreatedBy' | 'entry'> & { customer: ResolversTypes['Customer'], customerCreatedBy?: Maybe<ResolversTypes['Customer']>, entry: ResolversTypes['Entry'] }>;
  TimelineEntryConnection: ResolverTypeWrapper<Omit<TimelineEntryConnection, 'edges'> & { edges: Array<ResolversTypes['TimelineEntryEdge']> }>;
  TimelineEntryEdge: ResolverTypeWrapper<Omit<TimelineEntryEdge, 'node'> & { node: ResolversTypes['TimelineEntry'] }>;
  TodoTicketStatusDetail: TodoTicketStatusDetail;
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UnarchiveLabelTypePayload: ResolverTypeWrapper<UnarchiveLabelTypePayload>;
  UnassignTicketInput: UnassignTicketInput;
  UnassignTicketPayload: ResolverTypeWrapper<Omit<UnassignTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversTypes['Ticket']> }>;
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  UpdateLabelTypePayload: ResolverTypeWrapper<UpdateLabelTypePayload>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddLabelsInput: AddLabelsInput;
  AddLabelsPayload: AddLabelsPayload;
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  ArchiveLabelTypePayload: ArchiveLabelTypePayload;
  AssignTicketInput: AssignTicketInput;
  AssignTicketPayload: Omit<AssignTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  AssignmentChangedEntry: AssignmentChangedEntry;
  Boolean: Scalars['Boolean']['output'];
  ChangeTicketPriorityInput: ChangeTicketPriorityInput;
  ChangeTicketPriorityPayload: Omit<ChangeTicketPriorityPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  ChatEntry: ChatEntry;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypePayload: CreateLabelTypePayload;
  CreateNoteInput: CreateNoteInput;
  CreateNotePayload: Omit<CreateNotePayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  CreateTicketInput: CreateTicketInput;
  CreateTicketPayload: Omit<CreateTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  Customer: Customer;
  DateTime: Scalars['DateTime']['output'];
  Entry: ResolversUnionTypes<ResolversParentTypes>['Entry'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Label: Label;
  LabelType: LabelType;
  LabelTypeConnection: LabelTypeConnection;
  LabelTypeEdge: LabelTypeEdge;
  LabelTypeFilters: LabelTypeFilters;
  LabelsChangedEntry: LabelsChangedEntry;
  MarkTicketAsDoneInput: MarkTicketAsDoneInput;
  MarkTicketAsDonePayload: Omit<MarkTicketAsDonePayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  MarkTicketAsTodoInput: MarkTicketAsTodoInput;
  MarkTicketAsTodoPayload: Omit<MarkTicketAsTodoPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  Mutation: {};
  MutationError: MutationError;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NoteEntry: NoteEntry;
  PageInfo: PageInfo;
  PriorityChangedEntry: PriorityChangedEntry;
  Query: {};
  RemoveLabelsInput: RemoveLabelsInput;
  RemoveLabelsPayload: RemoveLabelsPayload;
  SendChatInput: SendChatInput;
  SendChatPayload: Omit<SendChatPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  SnoozeTicketInput: SnoozeTicketInput;
  SnoozeTicketPayload: Omit<SnoozeTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  StatusChangedEntry: StatusChangedEntry;
  String: Scalars['String']['output'];
  Ticket: Omit<Ticket, 'customer' | 'timelineEntries'> & { customer: ResolversParentTypes['Customer'], timelineEntries: ResolversParentTypes['TimelineEntryConnection'] };
  TicketConnection: Omit<TicketConnection, 'edges'> & { edges: Array<ResolversParentTypes['TicketEdge']> };
  TicketEdge: Omit<TicketEdge, 'node'> & { node: ResolversParentTypes['Ticket'] };
  TicketFilters: TicketFilters;
  TimelineEntry: Omit<TimelineEntry, 'customer' | 'customerCreatedBy' | 'entry'> & { customer: ResolversParentTypes['Customer'], customerCreatedBy?: Maybe<ResolversParentTypes['Customer']>, entry: ResolversParentTypes['Entry'] };
  TimelineEntryConnection: Omit<TimelineEntryConnection, 'edges'> & { edges: Array<ResolversParentTypes['TimelineEntryEdge']> };
  TimelineEntryEdge: Omit<TimelineEntryEdge, 'node'> & { node: ResolversParentTypes['TimelineEntry'] };
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UnarchiveLabelTypePayload: UnarchiveLabelTypePayload;
  UnassignTicketInput: UnassignTicketInput;
  UnassignTicketPayload: Omit<UnassignTicketPayload, 'ticket'> & { ticket?: Maybe<ResolversParentTypes['Ticket']> };
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  UpdateLabelTypePayload: UpdateLabelTypePayload;
  User: User;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
};

export type AddLabelsPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddLabelsPayload'] = ResolversParentTypes['AddLabelsPayload']> = {
  labels?: Resolver<Maybe<Array<ResolversTypes['Label']>>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArchiveLabelTypePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArchiveLabelTypePayload'] = ResolversParentTypes['ArchiveLabelTypePayload']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssignTicketPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AssignTicketPayload'] = ResolversParentTypes['AssignTicketPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssignmentChangedEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AssignmentChangedEntry'] = ResolversParentTypes['AssignmentChangedEntry']> = {
  newAssignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  oldAssignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChangeTicketPriorityPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeTicketPriorityPayload'] = ResolversParentTypes['ChangeTicketPriorityPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChatEntry'] = ResolversParentTypes['ChatEntry']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLabelTypePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateLabelTypePayload'] = ResolversParentTypes['CreateLabelTypePayload']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNotePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNotePayload'] = ResolversParentTypes['CreateNotePayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTicketPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateTicketPayload'] = ResolversParentTypes['CreateTicketPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = {
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Entry'] = ResolversParentTypes['Entry']> = {
  __resolveType: TypeResolveFn<'AssignmentChangedEntry' | 'ChatEntry' | 'LabelsChangedEntry' | 'NoteEntry' | 'PriorityChangedEntry' | 'StatusChangedEntry', ParentType, ContextType>;
};

export type LabelResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = {
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labelType?: Resolver<ResolversTypes['LabelType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LabelType'] = ResolversParentTypes['LabelType']> = {
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelTypeConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LabelTypeConnection'] = ResolversParentTypes['LabelTypeConnection']> = {
  edges?: Resolver<Array<ResolversTypes['LabelTypeEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelTypeEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LabelTypeEdge'] = ResolversParentTypes['LabelTypeEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['LabelType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelsChangedEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LabelsChangedEntry'] = ResolversParentTypes['LabelsChangedEntry']> = {
  newLabels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  oldLabels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkTicketAsDonePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarkTicketAsDonePayload'] = ResolversParentTypes['MarkTicketAsDonePayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkTicketAsTodoPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarkTicketAsTodoPayload'] = ResolversParentTypes['MarkTicketAsTodoPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addLabels?: Resolver<Maybe<ResolversTypes['AddLabelsPayload']>, ParentType, ContextType, RequireFields<MutationAddLabelsArgs, 'input'>>;
  archiveLabelType?: Resolver<Maybe<ResolversTypes['ArchiveLabelTypePayload']>, ParentType, ContextType, RequireFields<MutationArchiveLabelTypeArgs, 'input'>>;
  assignTicket?: Resolver<Maybe<ResolversTypes['AssignTicketPayload']>, ParentType, ContextType, RequireFields<MutationAssignTicketArgs, 'input'>>;
  changeTicketPriority?: Resolver<Maybe<ResolversTypes['ChangeTicketPriorityPayload']>, ParentType, ContextType, RequireFields<MutationChangeTicketPriorityArgs, 'input'>>;
  createLabelType?: Resolver<Maybe<ResolversTypes['CreateLabelTypePayload']>, ParentType, ContextType, RequireFields<MutationCreateLabelTypeArgs, 'input'>>;
  createNote?: Resolver<Maybe<ResolversTypes['CreateNotePayload']>, ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'input'>>;
  createTicket?: Resolver<Maybe<ResolversTypes['CreateTicketPayload']>, ParentType, ContextType, RequireFields<MutationCreateTicketArgs, 'input'>>;
  markTicketAsDone?: Resolver<Maybe<ResolversTypes['MarkTicketAsDonePayload']>, ParentType, ContextType, RequireFields<MutationMarkTicketAsDoneArgs, 'input'>>;
  markTicketAsTodo?: Resolver<Maybe<ResolversTypes['MarkTicketAsTodoPayload']>, ParentType, ContextType, RequireFields<MutationMarkTicketAsTodoArgs, 'input'>>;
  removeLabels?: Resolver<Maybe<ResolversTypes['RemoveLabelsPayload']>, ParentType, ContextType, RequireFields<MutationRemoveLabelsArgs, 'input'>>;
  sendChat?: Resolver<Maybe<ResolversTypes['SendChatPayload']>, ParentType, ContextType, RequireFields<MutationSendChatArgs, 'input'>>;
  snoozeTicket?: Resolver<Maybe<ResolversTypes['SnoozeTicketPayload']>, ParentType, ContextType, RequireFields<MutationSnoozeTicketArgs, 'input'>>;
  unarchiveLabelType?: Resolver<Maybe<ResolversTypes['UnarchiveLabelTypePayload']>, ParentType, ContextType, RequireFields<MutationUnarchiveLabelTypeArgs, 'input'>>;
  unassignTicket?: Resolver<Maybe<ResolversTypes['UnassignTicketPayload']>, ParentType, ContextType, RequireFields<MutationUnassignTicketArgs, 'input'>>;
  updateLabelType?: Resolver<Maybe<ResolversTypes['UpdateLabelTypePayload']>, ParentType, ContextType, RequireFields<MutationUpdateLabelTypeArgs, 'input'>>;
};

export type MutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MutationError'] = ResolversParentTypes['MutationError']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Customer' | 'Label' | 'LabelType' | 'Ticket' | 'TimelineEntry' | 'User', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NoteEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NoteEntry'] = ResolversParentTypes['NoteEntry']> = {
  rawContent?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PriorityChangedEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PriorityChangedEntry'] = ResolversParentTypes['PriorityChangedEntry']> = {
  newPriority?: Resolver<Maybe<ResolversTypes['TicketPriority']>, ParentType, ContextType>;
  oldPriority?: Resolver<Maybe<ResolversTypes['TicketPriority']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'customerId'>>;
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<QueryLabelTypeArgs, 'labelTypeId'>>;
  labelTypes?: Resolver<ResolversTypes['LabelTypeConnection'], ParentType, ContextType, Partial<QueryLabelTypesArgs>>;
  myUserInfo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<QueryTicketArgs, 'ticketId'>>;
  tickets?: Resolver<ResolversTypes['TicketConnection'], ParentType, ContextType, Partial<QueryTicketsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userId'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type RemoveLabelsPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveLabelsPayload'] = ResolversParentTypes['RemoveLabelsPayload']> = {
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendChatPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SendChatPayload'] = ResolversParentTypes['SendChatPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SnoozeTicketPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SnoozeTicketPayload'] = ResolversParentTypes['SnoozeTicketPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatusChangedEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StatusChangedEntry'] = ResolversParentTypes['StatusChangedEntry']> = {
  newStatus?: Resolver<Maybe<ResolversTypes['TicketStatus']>, ParentType, ContextType>;
  oldStatus?: Resolver<Maybe<ResolversTypes['TicketStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TicketResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Ticket'] = ResolversParentTypes['Ticket']> = {
  assignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['TicketPriority'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TicketStatus'], ParentType, ContextType>;
  statusChangedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  statusChangedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  statusDetail?: Resolver<Maybe<ResolversTypes['TicketStatusDetail']>, ParentType, ContextType>;
  timelineEntries?: Resolver<ResolversTypes['TimelineEntryConnection'], ParentType, ContextType, Partial<TicketTimelineEntriesArgs>>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TicketConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TicketConnection'] = ResolversParentTypes['TicketConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TicketEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TicketEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TicketEdge'] = ResolversParentTypes['TicketEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Ticket'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TicketStatusDetailResolvers = EnumResolverSignature<{ CLOSE_THE_LOOP?: any, CREATED?: any, DONE_AUTOMATICALLY_SET?: any, DONE_MANUALLY_SET?: any, IGNORED?: any, IN_PROGRESS?: any, NEW_REPLY?: any, WAITING_FOR_CUSTOMER?: any, WAITING_FOR_DURATION?: any }, ResolversTypes['TicketStatusDetail']>;

export type TimelineEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TimelineEntry'] = ResolversParentTypes['TimelineEntry']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>;
  customerCreatedBy?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  entry?: Resolver<ResolversTypes['Entry'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ticketId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userCreatedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimelineEntryConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TimelineEntryConnection'] = ResolversParentTypes['TimelineEntryConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TimelineEntryEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimelineEntryEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TimelineEntryEdge'] = ResolversParentTypes['TimelineEntryEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TimelineEntry'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnarchiveLabelTypePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnarchiveLabelTypePayload'] = ResolversParentTypes['UnarchiveLabelTypePayload']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnassignTicketPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnassignTicketPayload'] = ResolversParentTypes['UnassignTicketPayload']> = {
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateLabelTypePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateLabelTypePayload'] = ResolversParentTypes['UpdateLabelTypePayload']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AddLabelsPayload?: AddLabelsPayloadResolvers<ContextType>;
  ArchiveLabelTypePayload?: ArchiveLabelTypePayloadResolvers<ContextType>;
  AssignTicketPayload?: AssignTicketPayloadResolvers<ContextType>;
  AssignmentChangedEntry?: AssignmentChangedEntryResolvers<ContextType>;
  ChangeTicketPriorityPayload?: ChangeTicketPriorityPayloadResolvers<ContextType>;
  ChatEntry?: ChatEntryResolvers<ContextType>;
  CreateLabelTypePayload?: CreateLabelTypePayloadResolvers<ContextType>;
  CreateNotePayload?: CreateNotePayloadResolvers<ContextType>;
  CreateTicketPayload?: CreateTicketPayloadResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Entry?: EntryResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  LabelType?: LabelTypeResolvers<ContextType>;
  LabelTypeConnection?: LabelTypeConnectionResolvers<ContextType>;
  LabelTypeEdge?: LabelTypeEdgeResolvers<ContextType>;
  LabelsChangedEntry?: LabelsChangedEntryResolvers<ContextType>;
  MarkTicketAsDonePayload?: MarkTicketAsDonePayloadResolvers<ContextType>;
  MarkTicketAsTodoPayload?: MarkTicketAsTodoPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationError?: MutationErrorResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NoteEntry?: NoteEntryResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PriorityChangedEntry?: PriorityChangedEntryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemoveLabelsPayload?: RemoveLabelsPayloadResolvers<ContextType>;
  SendChatPayload?: SendChatPayloadResolvers<ContextType>;
  SnoozeTicketPayload?: SnoozeTicketPayloadResolvers<ContextType>;
  StatusChangedEntry?: StatusChangedEntryResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
  TicketConnection?: TicketConnectionResolvers<ContextType>;
  TicketEdge?: TicketEdgeResolvers<ContextType>;
  TicketStatusDetail?: TicketStatusDetailResolvers;
  TimelineEntry?: TimelineEntryResolvers<ContextType>;
  TimelineEntryConnection?: TimelineEntryConnectionResolvers<ContextType>;
  TimelineEntryEdge?: TimelineEntryEdgeResolvers<ContextType>;
  UnarchiveLabelTypePayload?: UnarchiveLabelTypePayloadResolvers<ContextType>;
  UnassignTicketPayload?: UnassignTicketPayloadResolvers<ContextType>;
  UpdateLabelTypePayload?: UpdateLabelTypePayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
};

