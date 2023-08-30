'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { api } from '~/utils/api';

export const useSetupTicketList = () => {
  const { addTicket, addMessage, setActiveTicket } = useTicket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const ticketId = parseInt((params.id as unknown as string) ?? '');

  const { data: ticketsData } = api.ticket.all.useQuery();
  const { data: messagesData } = api.message.all.useQuery(
    {
      ticketId: ticketId ?? '',
    },
    {
      enabled: !!ticketId,
    }
  );

  // TODO: refactor
  useEffect(() => {
    if (!ticketsData) return;

    (ticketsData ?? []).forEach((ticket) => addTicket({ ...ticket }));
    if (ticketId) {
      setActiveTicket(ticketId);
    } else {
      const firstTicketIdFromList = ticketsData?.[0]?.id;
      if (!firstTicketIdFromList) return;

      router.replace(
        `/tickets/${firstTicketIdFromList}${searchParams.toString()}`
      );
    }
  }, [
    ticketsData,
    ticketId,
    addMessage,
    addTicket,
    router,
    searchParams,
    setActiveTicket,
  ]);

  useEffect(() => {
    if (!messagesData || !ticketId) return;

    (messagesData ?? []).forEach((message) => addMessage(ticketId, message));
  }, [messagesData, addMessage, ticketId]);
};
