import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { graphql } from '@/gql/gql';
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

  const { data: ticketsData } = useQuery({
    queryKey: ['allTickets'],
    queryFn: () =>
      request(`${import.meta.env.VITE_ENDPOINT_URL}/graphql`, AllTicketsQuery),
  });
  const { data: messagesData } = useQuery({
    queryKey: ['allMessages', ticketId],
    queryFn: () =>
      request(
        `${import.meta.env.VITE_ENDPOINT_URL}/graphql`,
        AllMessagesQuery,
        {
          ticketId: ticketId ?? '',
        }
      ),
    enabled: !!ticketId,
  });

  // TODO: refactor
  useEffect(() => {
    if (!ticketsData) return;

    (ticketsData.allTickets ?? []).forEach((ticket) =>
      addTicket({ ...ticket, createdAt: new Date(ticket.createdAt) })
    );
    if (ticketId) {
      setActiveTicket(ticketId);
    } else {
      const firstTicketIdFromList = ticketsData?.allTickets[0]?.id;
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

    (messagesData.allMessages ?? []).forEach((message) =>
      addMessage(ticketId, message)
    );
  }, [messagesData, addMessage, ticketId]);
};
