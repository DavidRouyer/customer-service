/* eslint-disable */
import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace CommonModule {
  interface DefinedFields {
    PageInfo: 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor';
    Node: 'id';
  };
  
  export type Node = Pick<Types.Node, DefinedFields['Node']>;
  export type PageInfo = Pick<Types.PageInfo, DefinedFields['PageInfo']>;
  
  export type Scalars = Pick<Types.Scalars, 'DateTime'>;
  export type DateTimeScalarConfig = Types.DateTimeScalarConfig;
  
  export type PageInfoResolvers = Pick<Types.PageInfoResolvers, DefinedFields['PageInfo'] | '__isTypeOf'>;
  export type NodeResolvers = Pick<Types.NodeResolvers, DefinedFields['Node']>;
  
  export interface Resolvers {
    PageInfo?: PageInfoResolvers;
    DateTime?: Types.Resolvers['DateTime'];
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    PageInfo?: {
      '*'?: gm.Middleware[];
      hasNextPage?: gm.Middleware[];
      hasPreviousPage?: gm.Middleware[];
      startCursor?: gm.Middleware[];
      endCursor?: gm.Middleware[];
    };
  };
}