import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { graphql } from '@/gql/gql';
import { useGraphQL } from '@/hooks/use-query';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const AllTicketsQuery = graphql(/* GraphQL */ `
  query allTickets {
    allTickets {
      id
      createdAt
      contact {
        id
        avatarUrl
        name
      }
      content
    }
  }
`);

export const AllMessagesQuery = graphql(/* GraphQL */ `
  query allMessages($ticketId: ID!) {
    allMessages(ticketId: $ticketId) {
      id
      createdAt
      content
      contentType
      direction
      status
      sender {
        id
        avatarUrl
        name
      }
    }
  }
`);

export const useSetupTicketList = () => {
  const { addTicket, addMessage, setActiveTicket } = useTicket();
  const { ticketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const { data: ticketsData } = useGraphQL(AllTicketsQuery);
  const { data: messagesData } = useGraphQL(
    AllMessagesQuery,
    ticketId ? { ticketId } : null
  );

  // TODO: refactor
  useEffect(() => {
    if (!ticketsData) return;

    (ticketsData.data?.allTickets ?? []).forEach((ticket) =>
      addTicket({ ...ticket, createdAt: new Date(ticket.createdAt) })
    );
    if (ticketId) {
      setActiveTicket(ticketId);
    } else {
      const firstTicketIdFromList = ticketsData?.data?.allTickets[0]?.id;
      if (!firstTicketIdFromList) return;

      navigate(`/tickets/${firstTicketIdFromList}${search}`, {
        replace: true,
      });
    }
  }, [
    ticketsData,
    ticketId,
    addTicket,
    setActiveTicket,
    navigate,
    search,
    addMessage,
  ]);

  useEffect(() => {
    if (!messagesData || !ticketId) return;

    (messagesData.data?.allMessages ?? []).forEach((message) =>
      addMessage(ticketId, message)
    );
  }, [messagesData, addMessage, ticketId]);
};
