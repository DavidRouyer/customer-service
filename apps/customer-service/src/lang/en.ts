const translations = {
  date: '{{val, datetime}}',
  info_panel: {
    activity: 'Activity',
    contact_information: 'Contact information',
    conversations: 'Conversations',
  },
  layout: {
    open_sidebar: 'Open sidebar',
    reports: 'Reports',
    settings: 'Settings',
    team: 'Team',
    tickets: {
      all_tickets: 'All tickets',
      my_tickets: 'My tickets',
      tickets: 'Tickets',
      unassigned_tickets: 'Unassigned tickets',
    },
    your_profile: 'Your profile',
  },
  text_editor: {
    add_emoticons: 'Add emoticons',
    attach_files: 'Attach files',
    placeholder: 'Type your message here...',
    send: 'Send',
  },
  ticket: {
    opened_on: 'Opened on',
    resolved_on: 'Resolved on',
    statuses: {
      open: 'Open',
      resolved: 'Resolved',
    },
  },
  user: {
    email: 'Email address',
    phone: 'Phone',
    platform: 'Platform',
  },
} as const;

export default translations;
