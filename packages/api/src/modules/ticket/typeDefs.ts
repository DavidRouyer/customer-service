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

  type Ticket implements Node {
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
    createdAt: DateTime!
    createdBy: User!
    updatedAt: DateTime
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

  type TimelineEntry implements Node {
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

  input TicketsFilter {
    statuses: [TicketStatus!]
    customerIds: [ID!]
    isAssigned: Boolean
  }

  type Query {
    ticket(id: ID!): Ticket
    tickets(
      filters: TicketsFilter
      first: Int
      after: String
      last: Int
      before: String
    ): TicketConnection!
  }

  input AssignTicketInput {
    """
    The Node ID of the ticket to assign.
    """
    ticketId: ID!
    userId: ID!
  }

  type AssignTicketOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input ChangeTicketPriorityInput {
    """
    The Node ID of the ticket to change the priority of.
    """
    ticketId: ID!
    priority: TicketPriority!
  }

  type ChangeTicketPriorityOutput {
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

  type CreateNoteOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input CreateTicketInput {
    title: String!
    customerId: ID!
    labelIds: [ID!]
    priority: TicketPriority
  }

  type CreateTicketOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input MarkTicketAsDoneInput {
    """
    The Node ID of the ticket to mark as done.
    """
    ticketId: ID!
  }

  type MarkTicketAsDoneOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input MarkTicketAsOpenInput {
    """
    The Node ID of the ticket to mark as open.
    """
    ticketId: ID!
  }

  type MarkTicketAsOpenOutput {
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

  type SendChatOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input UnassignTicketInput {
    """
    The Node ID of the ticket to unassign.
    """
    ticketId: ID!
  }

  type UnassignTicketOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  type Mutation {
    assignTicket(input: AssignTicketInput!): AssignTicketOutput
    changeTicketPriority(
      input: ChangeTicketPriorityInput!
    ): ChangeTicketPriorityOutput
    createNote(input: CreateNoteInput!): CreateNoteOutput
    createTicket(input: CreateTicketInput!): CreateTicketOutput
    markTicketAsDone(input: MarkTicketAsDoneInput!): MarkTicketAsDoneOutput
    markTicketAsOpen(input: MarkTicketAsOpenInput!): MarkTicketAsOpenOutput
    sendChat(input: SendChatInput!): SendChatOutput
    unassignTicket(input: UnassignTicketInput!): UnassignTicketOutput
  }
`;

export default typeDefs;
