/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from './context';
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
  DateTime: { input: any; output: any; }
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
  createLabelType?: Maybe<CreateLabelTypeOutput>;
  removeLabels?: Maybe<RemoveLabelsOutput>;
  unarchiveLabelType?: Maybe<UnarchiveLabelTypeOutput>;
  updateLabelType?: Maybe<UpdateLabelTypeOutput>;
};


export type MutationAddLabelsArgs = {
  input: AddLabelsInput;
};


export type MutationArchiveLabelTypeArgs = {
  input: ArchiveLabelTypeInput;
};


export type MutationCreateLabelTypeArgs = {
  input: CreateLabelTypeInput;
};


export type MutationRemoveLabelsArgs = {
  input: RemoveLabelsInput;
};


export type MutationUnarchiveLabelTypeArgs = {
  input: UnarchiveLabelTypeInput;
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
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  Entry: ( AssignmentChangedEntry ) | ( ChatEntry ) | ( LabelsChangedEntry ) | ( NoteEntry ) | ( PriorityChangedEntry ) | ( StatusChangedEntry );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  Node: ( Customer ) | ( Label ) | ( LabelType ) | ( Ticket ) | ( Omit<TimelineEntry, 'entry'> & { entry: RefType['Entry'] } ) | ( User );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddLabelsInput: AddLabelsInput;
  AddLabelsOutput: ResolverTypeWrapper<AddLabelsOutput>;
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  ArchiveLabelTypeOutput: ResolverTypeWrapper<ArchiveLabelTypeOutput>;
  AssignmentChangedEntry: ResolverTypeWrapper<AssignmentChangedEntry>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChatEntry: ResolverTypeWrapper<ChatEntry>;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypeOutput: ResolverTypeWrapper<CreateLabelTypeOutput>;
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
  Mutation: ResolverTypeWrapper<{}>;
  MutationError: ResolverTypeWrapper<MutationError>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NoteEntry: ResolverTypeWrapper<NoteEntry>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PriorityChangedEntry: ResolverTypeWrapper<PriorityChangedEntry>;
  Query: ResolverTypeWrapper<{}>;
  RemoveLabelsInput: RemoveLabelsInput;
  RemoveLabelsOutput: ResolverTypeWrapper<RemoveLabelsOutput>;
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
  UnarchiveLabelTypeOutput: ResolverTypeWrapper<UnarchiveLabelTypeOutput>;
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  UpdateLabelTypeOutput: ResolverTypeWrapper<UpdateLabelTypeOutput>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddLabelsInput: AddLabelsInput;
  AddLabelsOutput: AddLabelsOutput;
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  ArchiveLabelTypeOutput: ArchiveLabelTypeOutput;
  AssignmentChangedEntry: AssignmentChangedEntry;
  Boolean: Scalars['Boolean']['output'];
  ChatEntry: ChatEntry;
  CreateLabelTypeInput: CreateLabelTypeInput;
  CreateLabelTypeOutput: CreateLabelTypeOutput;
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
  Mutation: {};
  MutationError: MutationError;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NoteEntry: NoteEntry;
  PageInfo: PageInfo;
  PriorityChangedEntry: PriorityChangedEntry;
  Query: {};
  RemoveLabelsInput: RemoveLabelsInput;
  RemoveLabelsOutput: RemoveLabelsOutput;
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
  UnarchiveLabelTypeOutput: UnarchiveLabelTypeOutput;
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  UpdateLabelTypeOutput: UpdateLabelTypeOutput;
  User: User;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
};

export type AddLabelsOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddLabelsOutput'] = ResolversParentTypes['AddLabelsOutput']> = {
  labels?: Resolver<Maybe<Array<ResolversTypes['Label']>>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArchiveLabelTypeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArchiveLabelTypeOutput'] = ResolversParentTypes['ArchiveLabelTypeOutput']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssignmentChangedEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AssignmentChangedEntry'] = ResolversParentTypes['AssignmentChangedEntry']> = {
  newAssignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  oldAssignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatEntryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChatEntry'] = ResolversParentTypes['ChatEntry']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLabelTypeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateLabelTypeOutput'] = ResolversParentTypes['CreateLabelTypeOutput']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
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

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addLabels?: Resolver<Maybe<ResolversTypes['AddLabelsOutput']>, ParentType, ContextType, RequireFields<MutationAddLabelsArgs, 'input'>>;
  archiveLabelType?: Resolver<Maybe<ResolversTypes['ArchiveLabelTypeOutput']>, ParentType, ContextType, RequireFields<MutationArchiveLabelTypeArgs, 'input'>>;
  createLabelType?: Resolver<Maybe<ResolversTypes['CreateLabelTypeOutput']>, ParentType, ContextType, RequireFields<MutationCreateLabelTypeArgs, 'input'>>;
  removeLabels?: Resolver<Maybe<ResolversTypes['RemoveLabelsOutput']>, ParentType, ContextType, RequireFields<MutationRemoveLabelsArgs, 'input'>>;
  unarchiveLabelType?: Resolver<Maybe<ResolversTypes['UnarchiveLabelTypeOutput']>, ParentType, ContextType, RequireFields<MutationUnarchiveLabelTypeArgs, 'input'>>;
  updateLabelType?: Resolver<Maybe<ResolversTypes['UpdateLabelTypeOutput']>, ParentType, ContextType, RequireFields<MutationUpdateLabelTypeArgs, 'input'>>;
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
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<QueryLabelTypeArgs, 'id'>>;
  labelTypes?: Resolver<ResolversTypes['LabelTypeConnection'], ParentType, ContextType, Partial<QueryLabelTypesArgs>>;
  ticket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<QueryTicketArgs, 'id'>>;
  tickets?: Resolver<ResolversTypes['TicketConnection'], ParentType, ContextType, Partial<QueryTicketsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type RemoveLabelsOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveLabelsOutput'] = ResolversParentTypes['RemoveLabelsOutput']> = {
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

export type UnarchiveLabelTypeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnarchiveLabelTypeOutput'] = ResolversParentTypes['UnarchiveLabelTypeOutput']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType>;
  userErrors?: Resolver<Maybe<Array<ResolversTypes['MutationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateLabelTypeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateLabelTypeOutput'] = ResolversParentTypes['UpdateLabelTypeOutput']> = {
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
  AddLabelsOutput?: AddLabelsOutputResolvers<ContextType>;
  ArchiveLabelTypeOutput?: ArchiveLabelTypeOutputResolvers<ContextType>;
  AssignmentChangedEntry?: AssignmentChangedEntryResolvers<ContextType>;
  ChatEntry?: ChatEntryResolvers<ContextType>;
  CreateLabelTypeOutput?: CreateLabelTypeOutputResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Entry?: EntryResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  LabelType?: LabelTypeResolvers<ContextType>;
  LabelTypeConnection?: LabelTypeConnectionResolvers<ContextType>;
  LabelTypeEdge?: LabelTypeEdgeResolvers<ContextType>;
  LabelsChangedEntry?: LabelsChangedEntryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationError?: MutationErrorResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NoteEntry?: NoteEntryResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PriorityChangedEntry?: PriorityChangedEntryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemoveLabelsOutput?: RemoveLabelsOutputResolvers<ContextType>;
  StatusChangedEntry?: StatusChangedEntryResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
  TicketConnection?: TicketConnectionResolvers<ContextType>;
  TicketEdge?: TicketEdgeResolvers<ContextType>;
  TimelineEntry?: TimelineEntryResolvers<ContextType>;
  TimelineEntryConnection?: TimelineEntryConnectionResolvers<ContextType>;
  TimelineEntryEdge?: TimelineEntryEdgeResolvers<ContextType>;
  UnarchiveLabelTypeOutput?: UnarchiveLabelTypeOutputResolvers<ContextType>;
  UpdateLabelTypeOutput?: UpdateLabelTypeOutputResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
};

