import { FC } from 'react';

export const AgentList: FC = () => {
  // TODO: Fetch agents from API
  return (
    <ul className="flex flex-col gap-y-1">
      {/*[].map((agent) => (
        <li key={agent.id}>
          <Link href={`/tickets/1?filter=${agent.name}`}>{agent.name}</Link>
        </li>
      ))*/}
    </ul>
  );
};

AgentList.displayName = 'AgentList';
