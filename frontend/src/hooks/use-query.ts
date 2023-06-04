import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  ASTNode,
  ExecutionResult,
  Kind,
  OperationDefinitionNode,
} from 'graphql';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const executor = buildHTTPExecutor({
  endpoint: `${import.meta.env.VITE_ENDPOINT_URL}/graphql`,
});

const isOperationDefinition = (def: ASTNode): def is OperationDefinitionNode =>
  def.kind === Kind.OPERATION_DEFINITION;

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables | null
) {
  const shouldFetch = variables !== null;

  return useSWR(
    shouldFetch
      ? ([
          // This logic can be customized as desired
          document.definitions.find(isOperationDefinition)?.name,
          variables,
        ] as const)
      : null,
    async (_key: TypedDocumentNode<TResult, TVariables>) =>
      executor({
        document: document as any,
        variables: variables as any,
      }) as Promise<ExecutionResult<TResult>>
  );
}

export function useMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>
) {
  return useSWRMutation(
    document,
    async (document, { arg }: { arg: TVariables }) =>
      executor({
        document: document as any,
        variables: arg as any,
      }) as Promise<ExecutionResult<TResult>>
  );
}
