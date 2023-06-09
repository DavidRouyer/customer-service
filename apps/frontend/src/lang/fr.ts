const translations = {
  date: '{{val, datetime}}',
  info_panel: {
    activity: 'Activité',
    contact_information: 'Informations de contact',
    conversations: 'Conversations',
  },
  layout: {
    open_sidebar: 'Ouvrir la barre latérale',
    reports: 'Rapports',
    settings: 'Paramètres',
    team: 'Équipe',
    tickets: {
      all_tickets: 'Tous les tickets',
      my_tickets: 'Mes tickets',
      tickets: 'Tickets',
      unassigned_tickets: 'Tickets non assignés',
    },
    your_profile: 'Votre profil',
  },
  text_editor: {
    add_emoticons: 'Ajouter des émoticônes',
    attach_files: 'Joindre des fichiers',
    placeholder: 'Écrivez votre réponse ici ...',
    send: 'Envoyer',
  },
  ticket: {
    opened_on: 'Ouvert le',
    resolved_on: 'Résolu le',
    statuses: {
      open: 'Ouvert',
      resolved: 'Résolu',
    },
  },
  user: {
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    platform: 'Plateforme',
  },
} as const;

export default translations;
