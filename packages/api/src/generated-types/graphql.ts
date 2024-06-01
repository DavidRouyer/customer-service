/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type AddLabelsInput = {
  labelTypeIds: Array<Scalars['ID']['input']>;
  ticketId: Scalars['ID']['input'];
};

export type AddLabelsPayload = {
  __typename?: 'AddLabelsPayload';
  labels?: Maybe<Array<Label>>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type ArchiveLabelTypeInput = {
  labelTypeId: Scalars['ID']['input'];
};

export type ArchiveLabelTypePayload = {
  __typename?: 'ArchiveLabelTypePayload';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

/** Assign a ticket to a user. */
export type AssignTicketInput = {
  /** The Node ID of the ticket to assign. */
  ticketId: Scalars['ID']['input'];
  /** The Node ID of the user to assign the ticket to. */
  userId: Scalars['ID']['input'];
};

export type AssignTicketPayload = {
  __typename?: 'AssignTicketPayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type AssignmentChangedEntry = {
  __typename?: 'AssignmentChangedEntry';
  newAssignedTo?: Maybe<User>;
  oldAssignedTo?: Maybe<User>;
};

export type ChangeTicketPriorityInput = {
  /** The new priority of the ticket. */
  priority: TicketPriority;
  /** The Node ID of the ticket to change the priority of. */
  ticketId: Scalars['ID']['input'];
};

export type ChangeTicketPriorityPayload = {
  __typename?: 'ChangeTicketPriorityPayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type ChatEntry = {
  __typename?: 'ChatEntry';
  text: Scalars['String']['output'];
};

export type CreateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateLabelTypePayload = {
  __typename?: 'CreateLabelTypePayload';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type CreateNoteInput = {
  rawContent: Scalars['String']['input'];
  text: Scalars['String']['input'];
  /** The Node ID of the ticket to which the note belongs. */
  ticketId: Scalars['ID']['input'];
};

export type CreateNotePayload = {
  __typename?: 'CreateNotePayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type CreateTicketInput = {
  customerId: Scalars['ID']['input'];
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  priority?: InputMaybe<TicketPriority>;
  title: Scalars['String']['input'];
};

export type CreateTicketPayload = {
  __typename?: 'CreateTicketPayload';
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

export type LabelTypesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LabelsChangedEntry = {
  __typename?: 'LabelsChangedEntry';
  newLabels: Array<Label>;
  oldLabels: Array<Label>;
};

export type MarkTicketAsDoneInput = {
  /** The Node ID of the ticket to mark as done. */
  ticketId: Scalars['ID']['input'];
};

export type MarkTicketAsDonePayload = {
  __typename?: 'MarkTicketAsDonePayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type MarkTicketAsOpenInput = {
  /** The Node ID of the ticket to mark as open. */
  ticketId: Scalars['ID']['input'];
};

export type MarkTicketAsOpenPayload = {
  __typename?: 'MarkTicketAsOpenPayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addLabels?: Maybe<AddLabelsPayload>;
  archiveLabelType?: Maybe<ArchiveLabelTypePayload>;
  assignTicket?: Maybe<AssignTicketPayload>;
  changeTicketPriority?: Maybe<ChangeTicketPriorityPayload>;
  createLabelType?: Maybe<CreateLabelTypePayload>;
  createNote?: Maybe<CreateNotePayload>;
  createTicket?: Maybe<CreateTicketPayload>;
  markTicketAsDone?: Maybe<MarkTicketAsDonePayload>;
  markTicketAsOpen?: Maybe<MarkTicketAsOpenPayload>;
  removeLabels?: Maybe<RemoveLabelsPayload>;
  sendChat?: Maybe<SendChatPayload>;
  unarchiveLabelType?: Maybe<UnarchiveLabelTypePayload>;
  unassignTicket?: Maybe<UnassignTicketPayload>;
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

export type MutationError = {
  __typename?: 'MutationError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
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
  filters?: InputMaybe<LabelTypesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type QueryTicketsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TicketsFilter>;
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

export type RemoveLabelsInput = {
  labelIds: Array<Scalars['ID']['input']>;
  ticketId: Scalars['ID']['input'];
};

export type RemoveLabelsPayload = {
  __typename?: 'RemoveLabelsPayload';
  userErrors?: Maybe<Array<MutationError>>;
};

export type SendChatInput = {
  text: Scalars['String']['input'];
  /** The Node ID of the ticket to which the chat belongs. */
  ticketId: Scalars['ID']['input'];
};

export type SendChatPayload = {
  __typename?: 'SendChatPayload';
  ticket?: Maybe<Ticket>;
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

export type UnarchiveLabelTypeInput = {
  labelTypeId: Scalars['ID']['input'];
};

export type UnarchiveLabelTypePayload = {
  __typename?: 'UnarchiveLabelTypePayload';
  labelType?: Maybe<LabelType>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type UnassignTicketInput = {
  /** The Node ID of the ticket to unassign. */
  ticketId: Scalars['ID']['input'];
};

export type UnassignTicketPayload = {
  __typename?: 'UnassignTicketPayload';
  ticket?: Maybe<Ticket>;
  userErrors?: Maybe<Array<MutationError>>;
};

export type UpdateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLabelTypePayload = {
  __typename?: 'UpdateLabelTypePayload';
  labelType?: Maybe<LabelType>;
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
  Node: ( Customer ) | ( Label ) | ( LabelType ) | ( Ticket ) | ( Omit<TimelineEntry, 'entry'> & { entry: _RefType['Entry'] } ) | ( User );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddLabelsInput: AddLabelsInput;
  AddLabelsPayload: ResolverTypeWrapper<AddLabelsPayload>;
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  ArchiveLabelTypePayload: ResolverTypeWrapper<ArchiveLabelTypePayload>;
  AssignTicketInput: AssignTicketInput;
  AssignTicketPayload: ResolverTypeWrapper<AssignTicketPayload>;
  AssignmentChangedEntry: ResolverTypeWrapper<AssignmentChangedEntry>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChangeTicketPriorityInput: ChangeTicketPriorityInput;
  ChangeTicketPriorityPayload: ResolverTypeWrapper<ChangeTicketPriorityPayload>;
  ChatEntry: ResolverTypeWrapper<ChatEntry>;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypePayload: ResolverTypeWrapper<CreateLabelTypePayload>;
  CreateNoteInput: CreateNoteInput;
  CreateNotePayload: ResolverTypeWrapper<CreateNotePayload>;
  CreateTicketInput: CreateTicketInput;
  CreateTicketPayload: ResolverTypeWrapper<CreateTicketPayload>;
  Customer: ResolverTypeWrapper<Customer>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Entry: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Entry']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Label: ResolverTypeWrapper<Label>;
  LabelType: ResolverTypeWrapper<LabelType>;
  LabelTypeConnection: ResolverTypeWrapper<LabelTypeConnection>;
  LabelTypeEdge: ResolverTypeWrapper<LabelTypeEdge>;
  LabelTypesFilter: LabelTypesFilter;
  LabelsChangedEntry: ResolverTypeWrapper<LabelsChangedEntry>;
  MarkTicketAsDoneInput: MarkTicketAsDoneInput;
  MarkTicketAsDonePayload: ResolverTypeWrapper<MarkTicketAsDonePayload>;
  MarkTicketAsOpenInput: MarkTicketAsOpenInput;
  MarkTicketAsOpenPayload: ResolverTypeWrapper<MarkTicketAsOpenPayload>;
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
  SendChatPayload: ResolverTypeWrapper<SendChatPayload>;
  StatusChangedEntry: ResolverTypeWrapper<StatusChangedEntry>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Ticket: ResolverTypeWrapper<Ticket>;
  TicketConnection: ResolverTypeWrapper<TicketConnection>;
  TicketEdge: ResolverTypeWrapper<TicketEdge>;
  TicketPriority: TicketPriority;
  TicketStatus: TicketStatus;
  TicketStatusDetail: TicketStatusDetail;
  TicketsFilter: TicketsFilter;
  TimelineEntry: ResolverTypeWrapper<Omit<TimelineEntry, 'entry'> & { entry: ResolversTypes['Entry'] }>;
  TimelineEntryConnection: ResolverTypeWrapper<TimelineEntryConnection>;
  TimelineEntryEdge: ResolverTypeWrapper<TimelineEntryEdge>;
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UnarchiveLabelTypePayload: ResolverTypeWrapper<UnarchiveLabelTypePayload>;
  UnassignTicketInput: UnassignTicketInput;
  UnassignTicketPayload: ResolverTypeWrapper<UnassignTicketPayload>;
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
  AssignTicketPayload: AssignTicketPayload;
  AssignmentChangedEntry: AssignmentChangedEntry;
  Boolean: Scalars['Boolean']['output'];
  ChangeTicketPriorityInput: ChangeTicketPriorityInput;
  ChangeTicketPriorityPayload: ChangeTicketPriorityPayload;
  ChatEntry: ChatEntry;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypePayload: CreateLabelTypePayload;
  CreateNoteInput: CreateNoteInput;
  CreateNotePayload: CreateNotePayload;
  CreateTicketInput: CreateTicketInput;
  CreateTicketPayload: CreateTicketPayload;
  Customer: Customer;
  DateTime: Scalars['DateTime']['output'];
  Entry: ResolversUnionTypes<ResolversParentTypes>['Entry'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Label: Label;
  LabelType: LabelType;
  LabelTypeConnection: LabelTypeConnection;
  LabelTypeEdge: LabelTypeEdge;
  LabelTypesFilter: LabelTypesFilter;
  LabelsChangedEntry: LabelsChangedEntry;
  MarkTicketAsDoneInput: MarkTicketAsDoneInput;
  MarkTicketAsDonePayload: MarkTicketAsDonePayload;
  MarkTicketAsOpenInput: MarkTicketAsOpenInput;
  MarkTicketAsOpenPayload: MarkTicketAsOpenPayload;
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
  SendChatPayload: SendChatPayload;
  StatusChangedEntry: StatusChangedEntry;
  String: Scalars['String']['output'];
  Ticket: Ticket;
  TicketConnection: TicketConnection;
  TicketEdge: TicketEdge;
  TicketsFilter: TicketsFilter;
  TimelineEntry: Omit<TimelineEntry, 'entry'> & { entry: ResolversParentTypes['Entry'] };
  TimelineEntryConnection: TimelineEntryConnection;
  TimelineEntryEdge: TimelineEntryEdge;
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UnarchiveLabelTypePayload: UnarchiveLabelTypePayload;
  UnassignTicketInput: UnassignTicketInput;
  UnassignTicketPayload: UnassignTicketPayload;
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

export type MarkTicketAsOpenPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MarkTicketAsOpenPayload'] = ResolversParentTypes['MarkTicketAsOpenPayload']> = {
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
  markTicketAsOpen?: Resolver<Maybe<ResolversTypes['MarkTicketAsOpenPayload']>, ParentType, ContextType, RequireFields<MutationMarkTicketAsOpenArgs, 'input'>>;
  removeLabels?: Resolver<Maybe<ResolversTypes['RemoveLabelsPayload']>, ParentType, ContextType, RequireFields<MutationRemoveLabelsArgs, 'input'>>;
  sendChat?: Resolver<Maybe<ResolversTypes['SendChatPayload']>, ParentType, ContextType, RequireFields<MutationSendChatArgs, 'input'>>;
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
  MarkTicketAsOpenPayload?: MarkTicketAsOpenPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationError?: MutationErrorResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NoteEntry?: NoteEntryResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PriorityChangedEntry?: PriorityChangedEntryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemoveLabelsPayload?: RemoveLabelsPayloadResolvers<ContextType>;
  SendChatPayload?: SendChatPayloadResolvers<ContextType>;
  StatusChangedEntry?: StatusChangedEntryResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
  TicketConnection?: TicketConnectionResolvers<ContextType>;
  TicketEdge?: TicketEdgeResolvers<ContextType>;
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

