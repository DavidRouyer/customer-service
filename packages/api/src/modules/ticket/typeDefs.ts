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

  type TicketEdge {
    cursor: String!
    node: Ticket!
  }

  type TicketConnection {
    edges: [TicketEdge!]!
    pageInfo: PageInfo!
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

  type TicketEdge {
    cursor: String!
    node: Ticket!
  }

  type TimelineEntry implements Node {
    id: ID!
    customer: Customer!
    entry: Entry!
    ticketId: ID!
    createdAt: DateTime!
    customerCreatedBy: Customer
    userCreatedBy: User
  }

  type TimelineEntryConnection {
    edges: [TimelineEntryEdge!]!
    pageInfo: PageInfo!
  }

  type TimelineEntryEdge {
    cursor: String!
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
    id: ID!
    userId: ID!
  }

  type AssignTicketOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input ChangeTicketPriorityInput {
    id: ID!
    priority: TicketPriority!
  }

  type ChangeTicketPriorityOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input CreateNoteInput {
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
    id: ID!
  }

  type MarkTicketAsDoneOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input MarkTicketAsOpenInput {
    id: ID!
  }

  type MarkTicketAsOpenOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input SendChatInput {
    ticketId: ID!
    text: String!
  }

  type SendChatOutput {
    ticket: Ticket
    userErrors: [MutationError!]
  }

  input UnassignTicketInput {
    id: ID!
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
