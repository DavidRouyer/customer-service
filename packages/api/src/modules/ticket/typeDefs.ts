const typeDefs = /* GraphQL */ `
  """
  Possible statuses a ticket may have.
  """
  enum TicketStatus {
    OPEN
    DONE
  }

  """
  Possible status details a ticket may have.
  """
  enum TicketStatusDetail {
    CREATED
    NEW_REPLY
    REPLIED
  }

  """
  Possible priorities a ticket may have.
  """
  enum TicketPriority {
    CRITICAL
    HIGH
    MEDIUM
    LOW
  }

  """
  A ticket is a place to discuss ideas, enhancements, tasks and bugs.
  """
  type Ticket implements Node {
    """
    The Node ID of the Ticket object.
    """
    id: ID!
    """
    The title of the ticket.
    """
    title: String
    """
    The status of the ticket.
    """
    status: TicketStatus!
    """
    The status detail of the ticket.
    """
    statusDetail: TicketStatusDetail
    """
    The date and time when the ticket status was last changed.
    """
    statusChangedAt: DateTime
    """
    The user who last changed the ticket status.
    """
    statusChangedBy: User
    """
    The labels of the ticket.
    """
    labels: [Label!]!
    """
    The priority of the ticket.
    """
    priority: TicketPriority!
    """
    The timeline entries of the ticket.
    """
    timelineEntries(
      first: Int
      after: String
      last: Int
      before: String
    ): TimelineEntryConnection!
    """
    The user to whom the ticket is assigned.
    """
    assignedTo: User
    """
    The customer who is affected to the ticket.
    """
    customer: Customer!
    """
    Identifies the date and time when the ticket was created.
    """
    createdAt: DateTime!
    """
    The user who created the ticket.
    """
    createdBy: User!
    """
    Identifies the date and time when the ticket was last updated.
    """
    updatedAt: DateTime
    """
    The user who last updated the ticket.
    """
    updatedBy: User
  }

  """
  A list of tickets.
  """
  type TicketConnection {
    """
    A list of edges.
    """
    edges: [TicketEdge!]!
    """
    Information to aid in pagination.
    """
    pageInfo: PageInfo!
  }

  """
  Represents a ticket.
  """
  type TicketEdge {
    """
    A cursor for use in pagination.
    """
    cursor: String!
    """
    The item at the end of the edge.
    """
    node: Ticket!
  }

  """
  Represents a ticket assignment change in the timeline.
  """
  type AssignmentChangedEntry {
    oldAssignedTo: User
    newAssignedTo: User
  }

  """
  Represents a chat in the timeline.
  """
  type ChatEntry {
    text: String!
  }

  """
  Represents a label change in the timeline.
  """
  type LabelsChangedEntry {
    oldLabels: [Label!]!
    newLabels: [Label!]!
  }

  """
  Represents a note in the timeline.
  """
  type NoteEntry {
    text: String!
    rawContent: String!
  }

  """
  Represents a priority change in the timeline.
  """
  type PriorityChangedEntry {
    oldPriority: TicketPriority
    newPriority: TicketPriority
  }

  """
  Represents a status change in the timeline.
  """
  type StatusChangedEntry {
    oldStatus: TicketStatus
    newStatus: TicketStatus
  }

  """
  A union of all possible entries that can appear in a timeline.
  """
  union Entry =
    | AssignmentChangedEntry
    | ChatEntry
    | LabelsChangedEntry
    | NoteEntry
    | PriorityChangedEntry
    | StatusChangedEntry

  """
  An entry of the timeline.
  """
  type TimelineEntry implements Node {
    """
    The Node ID of the TimelineEntry object.
    """
    id: ID!
    """
    The customer who is affected to the timeline entry.
    """
    customer: Customer!
    """
    The entry content.
    """
    entry: Entry!
    """
    The Node ID of the ticket to which the timeline entry belongs.
    """
    ticketId: ID!
    """
    Identifies the date and time when the timeline entry was created.
    """
    createdAt: DateTime!
    """
    The customer who created the timeline entry.
    """
    customerCreatedBy: Customer
    """
    The user who created the timeline entry.
    """
    userCreatedBy: User
  }

  """
  A list of timeline entries.
  """
  type TimelineEntryConnection {
    """
    A list of edges.
    """
    edges: [TimelineEntryEdge!]!
    """
    Information to aid in pagination.
    """
    pageInfo: PageInfo!
  }

  """
  Represents a timeline entry.
  """
  type TimelineEntryEdge {
    """
    A cursor for use in pagination.
    """
    cursor: String!
    """
    The item at the end of the edge.
    """
    node: TimelineEntry!
  }

  """
  Ways in which to filter lists of tickets.
  """
  input TicketFilters {
    statuses: [TicketStatus!]
    customerIds: [ID!]
    isAssigned: Boolean
  }

  extend type Query {
    """
    Fetches a ticket given its ID.
    """
    ticket(ticketId: ID!): Ticket

    """
    Fetches a list of tickets.
    """
    tickets(
      filters: TicketFilters
      first: Int
      after: String
      last: Int
      before: String
    ): TicketConnection!
  }

  """
  Input type of AssignTicket.
  """
  input AssignTicketInput {
    """
    The Node ID of the ticket to assign.
    """
    ticketId: ID!
    """
    The Node ID of the user to assign the ticket to.
    """
    userId: ID!
  }

  """
  Return type of AssignTicket.
  """
  type AssignTicketPayload {
    """
    The assigned ticket.
    """
    ticket: Ticket
    """
    Errors when assigning the ticket.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of ChangeTicketPriority.
  """
  input ChangeTicketPriorityInput {
    """
    The Node ID of the ticket to change the priority of.
    """
    ticketId: ID!
    """
    The new priority of the ticket.
    """
    priority: TicketPriority!
  }

  """
  Input type of ChangeTicketPriority.
  """
  type ChangeTicketPriorityPayload {
    """
    The ticket with the new priority.
    """
    ticket: Ticket
    """
    Errors when changing the priority of the ticket.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of CreateNote.
  """
  input CreateNoteInput {
    """
    The Node ID of the ticket to which the note belongs.
    """
    ticketId: ID!
    """
    The content of the note.
    """
    text: String!
    rawContent: String!
  }

  """
  Return type of CreateNote.
  """
  type CreateNotePayload {
    """
    The ticket with the new note.
    """
    ticket: Ticket
    """
    Errors when creating the note.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of CreateTicket.
  """
  input CreateTicketInput {
    """
    The title of the ticket.
    """
    title: String!
    """
    The Node ID of the customer who is affected to the ticket.
    """
    customerId: ID!
    """
    The IDs of the labels to add to the ticket.
    """
    labelIds: [ID!]
    """
    The priority of the ticket.
    """
    priority: TicketPriority
  }

  """
  Return type of CreateTicket.
  """
  type CreateTicketPayload {
    """
    The new ticket.
    """
    ticket: Ticket
    """
    Errors when creating the ticket.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of MarkTicketAsDone.
  """
  input MarkTicketAsDoneInput {
    """
    The Node ID of the ticket to mark as done.
    """
    ticketId: ID!
  }

  """
  Return type of MarkTicketAsDone.
  """
  type MarkTicketAsDonePayload {
    """
    The ticket with the new status.
    """
    ticket: Ticket
    """
    Errors when marking the ticket as done.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of MarkTicketAsOpen.
  """
  input MarkTicketAsOpenInput {
    """
    The Node ID of the ticket to mark as open.
    """
    ticketId: ID!
  }

  """
  Return type of MarkTicketAsOpen.
  """
  type MarkTicketAsOpenPayload {
    """
    The ticket with the new status.
    """
    ticket: Ticket
    """
    Errors when marking the ticket as open.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of SendChat.
  """
  input SendChatInput {
    """
    The Node ID of the ticket to which the chat belongs.
    """
    ticketId: ID!
    """
    The content of the chat.
    """
    text: String!
  }

  """
  Return type of SendChat.
  """
  type SendChatPayload {
    """
    The ticket with the new chat.
    """
    ticket: Ticket
    """
    Errors when creating the chat.
    """
    userErrors: [MutationError!]
  }

  """
  Input type of UnassignTicket.
  """
  input UnassignTicketInput {
    """
    The Node ID of the ticket to unassign.
    """
    ticketId: ID!
  }

  """
  Return type of UnassignTicket.
  """
  type UnassignTicketPayload {
    """
    The unassigned ticket.
    """
    ticket: Ticket
    """
    Errors when unassigning the ticket.
    """
    userErrors: [MutationError!]
  }

  extend type Mutation {
    """
    Assign a ticket to a user.
    """
    assignTicket(
      """
      Parameters for AssignTicket.
      """
      input: AssignTicketInput!
    ): AssignTicketPayload

    """
    Change the priority of a ticket.
    """
    changeTicketPriority(
      """
      Parameters for ChangeTicketPriority.
      """
      input: ChangeTicketPriorityInput!
    ): ChangeTicketPriorityPayload

    """
    Create a note for a ticket.
    """
    createNote(
      """
      Parameters for CreateNote.
      """
      input: CreateNoteInput!
    ): CreateNotePayload

    """
    Create a ticket.
    """
    createTicket(
      """
      Parameters for CreateTicket.
      """
      input: CreateTicketInput!
    ): CreateTicketPayload

    """
    Mark a ticket as done.
    """
    markTicketAsDone(
      """
      Parameters for MarkTicketAsDone.
      """
      input: MarkTicketAsDoneInput!
    ): MarkTicketAsDonePayload

    """
    Mark a ticket as open.
    """
    markTicketAsOpen(
      """
      Parameters for MarkTicketAsOpen.
      """
      input: MarkTicketAsOpenInput!
    ): MarkTicketAsOpenPayload

    """
    Create a chat for a ticket.
    """
    sendChat(
      """
      Parameters for SendChat.
      """
      input: SendChatInput!
    ): SendChatPayload

    """
    Unassign a ticket.
    """
    unassignTicket(
      """
      Parameters for UnassignTicket.
      """
      input: UnassignTicketInput!
    ): UnassignTicketPayload
  }
`;

export default typeDefs;
