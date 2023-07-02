import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';

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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
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
  avatarUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddMessageInput: AddMessageInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contact: ResolverTypeWrapper<Contact>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Json: ResolverTypeWrapper<Scalars['Json']['output']>;
  Message: ResolverTypeWrapper<Message>;
  MessageContentType: MessageContentType;
  MessageDirection: MessageDirection;
  MessageStatus: MessageStatus;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Ticket: ResolverTypeWrapper<Ticket>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddMessageInput: AddMessageInput;
  Boolean: Scalars['Boolean']['output'];
  Contact: Contact;
  Date: Scalars['Date']['output'];
  ID: Scalars['ID']['output'];
  Json: Scalars['Json']['output'];
  Message: Message;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Ticket: Ticket;
}>;

export type ContactResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']
> = ResolversObject<{
  avatarUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MessageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']
> = ResolversObject<{
  content?: Resolver<ResolversTypes['Json'], ParentType, ContextType>;
  contentType?: Resolver<
    ResolversTypes['MessageContentType'],
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  direction?: Resolver<
    ResolversTypes['MessageDirection'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Contact'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MessageStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  addMessage?: Resolver<
    ResolversTypes['ID'],
    ParentType,
    ContextType,
    RequireFields<MutationAddMessageArgs, 'message' | 'ticketId'>
  >;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  allMessages?: Resolver<
    Array<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<QueryAllMessagesArgs, 'ticketId'>
  >;
  allTickets?: Resolver<
    Array<ResolversTypes['Ticket']>,
    ParentType,
    ContextType
  >;
}>;

export type TicketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Ticket'] = ResolversParentTypes['Ticket']
> = ResolversObject<{
  contact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Contact?: ContactResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Json?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
}>;
