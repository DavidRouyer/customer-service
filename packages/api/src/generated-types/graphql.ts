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

export type ArchiveLabelTypeInput = {
  id: Scalars['ID']['input'];
};

export type CreateLabelTypeInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
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

export type LabelTypeFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
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

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  labelType?: Maybe<LabelType>;
  labelTypes: LabelTypeConnection;
  users: Array<User>;
};


export type QueryLabelTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabelTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<LabelTypeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  Node: ( LabelType );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateLabelTypeInput: CreateLabelTypeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LabelType: ResolverTypeWrapper<LabelType>;
  LabelTypeConnection: ResolverTypeWrapper<LabelTypeConnection>;
  LabelTypeEdge: ResolverTypeWrapper<LabelTypeEdge>;
  LabelTypeFilter: LabelTypeFilter;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ArchiveLabelTypeInput: ArchiveLabelTypeInput;
  Boolean: Scalars['Boolean']['output'];
  CreateLabelTypeInput: CreateLabelTypeInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LabelType: LabelType;
  LabelTypeConnection: LabelTypeConnection;
  LabelTypeEdge: LabelTypeEdge;
  LabelTypeFilter: LabelTypeFilter;
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PageInfo;
  Query: {};
  String: Scalars['String']['output'];
  UnarchiveLabelTypeInput: UnarchiveLabelTypeInput;
  UpdateLabelTypeInput: UpdateLabelTypeInput;
  User: User;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

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

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  archiveLabelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<MutationArchiveLabelTypeArgs, 'input'>>;
  createLabelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<MutationCreateLabelTypeArgs, 'input'>>;
  unarchiveLabelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<MutationUnarchiveLabelTypeArgs, 'input'>>;
  updateLabelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<MutationUpdateLabelTypeArgs, 'input'>>;
};

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'LabelType', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  labelType?: Resolver<Maybe<ResolversTypes['LabelType']>, ParentType, ContextType, RequireFields<QueryLabelTypeArgs, 'id'>>;
  labelTypes?: Resolver<ResolversTypes['LabelTypeConnection'], ParentType, ContextType, Partial<QueryLabelTypesArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailVerified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  DateTime?: GraphQLScalarType;
  LabelType?: LabelTypeResolvers<ContextType>;
  LabelTypeConnection?: LabelTypeConnectionResolvers<ContextType>;
  LabelTypeEdge?: LabelTypeEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

