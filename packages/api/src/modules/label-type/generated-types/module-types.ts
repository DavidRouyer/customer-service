/* eslint-disable */
import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace LabelTypeModule {
  interface DefinedFields {
    LabelType: 'id' | 'name' | 'icon' | 'archivedAt' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy';
    LabelTypeConnection: 'edges' | 'pageInfo';
    LabelTypeEdge: 'cursor' | 'node';
    Query: 'labelTypes';
  };
  
  export type LabelType = Pick<Types.LabelType, DefinedFields['LabelType']>;
  export type DateTime = Types.DateTime;
  export type User = Types.User;
  export type Node = Types.Node;
  export type LabelTypeConnection = Pick<Types.LabelTypeConnection, DefinedFields['LabelTypeConnection']>;
  export type LabelTypeEdge = Pick<Types.LabelTypeEdge, DefinedFields['LabelTypeEdge']>;
  export type PageInfo = Types.PageInfo;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  
  export type LabelTypeResolvers = Pick<Types.LabelTypeResolvers, DefinedFields['LabelType'] | '__isTypeOf'>;
  export type LabelTypeConnectionResolvers = Pick<Types.LabelTypeConnectionResolvers, DefinedFields['LabelTypeConnection'] | '__isTypeOf'>;
  export type LabelTypeEdgeResolvers = Pick<Types.LabelTypeEdgeResolvers, DefinedFields['LabelTypeEdge'] | '__isTypeOf'>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  
  export interface Resolvers {
    LabelType?: LabelTypeResolvers;
    LabelTypeConnection?: LabelTypeConnectionResolvers;
    LabelTypeEdge?: LabelTypeEdgeResolvers;
    Query?: QueryResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    LabelType?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      name?: gm.Middleware[];
      icon?: gm.Middleware[];
      archivedAt?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      createdBy?: gm.Middleware[];
      updatedAt?: gm.Middleware[];
      updatedBy?: gm.Middleware[];
    };
    LabelTypeConnection?: {
      '*'?: gm.Middleware[];
      edges?: gm.Middleware[];
      pageInfo?: gm.Middleware[];
    };
    LabelTypeEdge?: {
      '*'?: gm.Middleware[];
      cursor?: gm.Middleware[];
      node?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      labelTypes?: gm.Middleware[];
    };
  };
}