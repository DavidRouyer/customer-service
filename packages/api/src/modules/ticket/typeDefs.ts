const typeDefs = /* GraphQL */ `
  enum TicketStatus {
    OPEN
    DONE
  }

  enum TicketStatusDetail {
    CREATED
    NEW_REPLY
    REPLIED
  }

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
    title: String
    status: TicketStatus!
    statusDetail: TicketStatusDetail
    statusChangedAt: DateTime
    statusChangedBy: User
    labels: [Label!]!
    priority: TicketPriority!
    timelineEntries(
      first: Int
      after: String
      last: Int
      before: String
    ): TimelineEntryConnection!
    assignedTo: User
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

  type AssignmentChangedEntry {
    oldAssignedTo: User
    newAssignedTo: User
  }

  type ChatEntry {
    text: String!
  }

  type LabelsChangedEntry {
    oldLabels: [Label!]!
    newLabels: [Label!]!
  }

  type NoteEntry {
    text: String!
    rawContent: String!
  }

  type PriorityChangedEntry {
    oldPriority: TicketPriority
    newPriority: TicketPriority
  }

  type StatusChangedEntry {
    oldStatus: TicketStatus
    newStatus: TicketStatus
  }

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
    customer: Customer!
    entry: Entry!
    ticketId: ID!
    createdAt: DateTime!
    customerCreatedBy: Customer
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
  Assign a ticket to a user.
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

  type AssignTicketPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

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

  type ChangeTicketPriorityPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input CreateNoteInput {
    """
    The Node ID of the ticket to which the note belongs.
    """
    ticketId: ID!
    text: String!
    rawContent: String!
  }

  type CreateNotePayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input CreateTicketInput {
    title: String!
    customerId: ID!
    labelIds: [ID!]
    priority: TicketPriority
  }

  type CreateTicketPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input MarkTicketAsDoneInput {
    """
    The Node ID of the ticket to mark as done.
    """
    ticketId: ID!
  }

  type MarkTicketAsDonePayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input MarkTicketAsOpenInput {
    """
    The Node ID of the ticket to mark as open.
    """
    ticketId: ID!
  }

  type MarkTicketAsOpenPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input SendChatInput {
    """
    The Node ID of the ticket to which the chat belongs.
    """
    ticketId: ID!
    text: String!
  }

  type SendChatPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input UnassignTicketInput {
    """
    The Node ID of the ticket to unassign.
    """
    ticketId: ID!
  }

  type UnassignTicketPayload {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  extend type Mutation {
    assignTicket(input: AssignTicketInput!): AssignTicketPayload
    changeTicketPriority(
      input: ChangeTicketPriorityInput!
    ): ChangeTicketPriorityPayload
    createNote(input: CreateNoteInput!): CreateNotePayload
    createTicket(input: CreateTicketInput!): CreateTicketPayload
    markTicketAsDone(input: MarkTicketAsDoneInput!): MarkTicketAsDonePayload
    markTicketAsOpen(input: MarkTicketAsOpenInput!): MarkTicketAsOpenPayload
    sendChat(input: SendChatInput!): SendChatPayload
    unassignTicket(input: UnassignTicketInput!): UnassignTicketPayload
  }
`;

export default typeDefs;
