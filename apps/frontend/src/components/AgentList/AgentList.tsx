import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { agentListState } from '~/stores/agentList';

export const AgentList: FC = () => {
  const agentList = useRecoilValue(agentListState);
  return (
    <ul className="flex flex-col gap-y-1">
      {agentList.map((agent) => (
        <li key={agent.id}>
          <NavLink to={`/tickets/1?filter=${agent.name}`}>{agent.name}</NavLink>
        </li>
      ))}
    </ul>
  );
};

AgentList.displayName = 'AgentList';
