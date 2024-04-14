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

export type LabelTypesQueryVariables = Exact<{
  filters?: InputMaybe<LabelTypeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type LabelTypesQuery = { __typename?: 'Query', labelTypes: { __typename?: 'LabelTypeConnection', edges: Array<{ __typename?: 'LabelTypeEdge', cursor: string, node: { __typename?: 'LabelType', id: string, name: string, icon?: string | null } }> } };



export const LabelTypesDocument = `
    query labelTypes($filters: LabelTypeFilter, $first: Int, $last: Int, $before: String, $after: String) {
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
