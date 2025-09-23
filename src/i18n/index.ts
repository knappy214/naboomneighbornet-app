// Simple i18n implementation without external dependencies
let currentLanguage: 'en' | 'af' = 'en';

// Translation keys
export const translations = {
  en: {
    // Common
    common: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      retry: 'Retry',
      refresh: 'Refresh',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      clear: 'Clear',
      select: 'Select',
      all: 'All',
      none: 'None',
      close: 'Close',
      open: 'Open',
      toggle: 'Toggle',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      theme: 'Theme',
      language: 'Language',
      dark: 'Dark',
      light: 'Light',
      system: 'System',
    },
    // Panic Menu
    panic: {
      title: 'Panic Menu',
      subtitle: 'Emergency Response System',
      submitIncident: 'Submit Panic Incident',
      submitIncidentDesc: 'Report an emergency situation',
      viewIncidents: 'View My Incidents',
      viewIncidentsDesc: 'Check status of your reports',
      manageContacts: 'Manage Emergency Contacts',
      manageContactsDesc: 'Update your emergency contacts',
      registerPush: 'Register Notifications',
      registerPushDesc: 'Enable push notifications',
      viewAlerts: 'View Patrol Alerts',
      viewAlertsDesc: 'See recent patrol alerts',
      viewResponders: 'View Responders',
      viewRespondersDesc: 'See available responders',
      vehicleTracking: 'Vehicle Tracking',
      vehicleTrackingDesc: 'Track patrol vehicles',
      waypoints: 'Patrol Waypoints',
      waypointsDesc: 'View patrol checkpoints',
      relaySubmit: 'Submit Relay Data',
      relaySubmitDesc: 'Submit offline relay data',
      streamUpdates: 'Live Updates',
      streamUpdatesDesc: 'Real-time incident updates',
    },
    // Incident Priority
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    },
    // Incident Status
    status: {
      open: 'Open',
      acknowledged: 'Acknowledged',
      resolved: 'Resolved',
      cancelled: 'Cancelled',
    },
    // Incident Source
    source: {
      app: 'Mobile App',
      expo: 'Expo Client',
      dashboard: 'Operations Dashboard',
      sms: 'SMS',
      ussd: 'USSD',
      relay: 'Relay',
    },
    // Form Fields
    form: {
      clientId: 'Client ID',
      latitude: 'Latitude',
      longitude: 'Longitude',
      description: 'Description',
      address: 'Address',
      priority: 'Priority',
      province: 'Province',
      context: 'Additional Context',
      phoneNumber: 'Phone Number',
      fullName: 'Full Name',
      relationship: 'Relationship',
      isActive: 'Active',
      platform: 'Platform',
      appVersion: 'App Version',
      token: 'Push Token',
      shift: 'Shift',
      minutes: 'Minutes',
      vehicle: 'Vehicle',
      frames: 'Data Frames',
    },
    // Messages
    messages: {
      error: 'Error',
      incidentSubmitted: 'Incident submitted successfully',
      incidentSubmittedError: 'Failed to submit incident',
      contactsUpdated: 'Emergency contacts updated',
      contactsUpdatedError: 'Failed to update contacts',
      pushRegistered: 'Push notifications registered',
      pushRegisteredError: 'Failed to register notifications',
      locationRequired: 'Location is required',
      descriptionRequired: 'Description is required',
      clientIdRequired: 'Client ID is required',
      phoneNumberRequired: 'Phone number is required',
      tokenRequired: 'Push token is required',
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      unauthorized: 'Unauthorized. Please login again.',
      forbidden: 'Access denied.',
      notFound: 'Resource not found.',
      validationError: 'Please check your input and try again.',
    },
  },
  af: {
    // Common
    common: {
      submit: 'Stuur',
      cancel: 'Kanselleer',
      save: 'Stoor',
      delete: 'Skrap',
      edit: 'Wysig',
      back: 'Terug',
      next: 'Volgende',
      done: 'Klaar',
      loading: 'Laai...',
      error: 'Fout',
      success: 'Sukses',
      warning: 'Waarskuwing',
      info: 'Inligting',
      confirm: 'Bevestig',
      yes: 'Ja',
      no: 'Nee',
      ok: 'OK',
      retry: 'Probeer Weer',
      refresh: 'Verfris',
      search: 'Soek',
      filter: 'Filter',
      sort: 'Sorteer',
      clear: 'Maak Skoon',
      select: 'Kies',
      all: 'Alles',
      none: 'Geen',
      close: 'Sluit',
      open: 'Maak Oop',
      toggle: 'Wissel',
      settings: 'Instellings',
      profile: 'Profiel',
      logout: 'Teken Uit',
      login: 'Teken In',
      register: 'Registreer',
      theme: 'Tema',
      language: 'Taal',
      dark: 'Donker',
      light: 'Lig',
      system: 'Stelsel',
    },
    // Panic Menu
    panic: {
      title: 'Paniek Kieslys',
      subtitle: 'Noodhulp Stelsel',
      submitIncident: 'Stuur Paniek Voorval',
      submitIncidentDesc: 'Rapporteer \'n noodsituasie',
      viewIncidents: 'Bekyk My Voorvalle',
      viewIncidentsDesc: 'Kyk status van jou verslae',
      manageContacts: 'Bestuur Noodkontakte',
      manageContactsDesc: 'Opdateer jou noodkontakte',
      registerPush: 'Registreer Kennisgewings',
      registerPushDesc: 'Aktiveer stoot kennisgewings',
      viewAlerts: 'Bekyk Patrollie Waarskuwings',
      viewAlertsDesc: 'Sien onlangse patrollie waarskuwings',
      viewResponders: 'Bekyk Reageerders',
      viewRespondersDesc: 'Sien beskikbare reageerders',
      vehicleTracking: 'Voertuig Opvolging',
      vehicleTrackingDesc: 'Volg patrollie voertuie',
      waypoints: 'Patrollie Kontrolepunte',
      waypointsDesc: 'Bekyk patrollie kontrolepunte',
      relaySubmit: 'Stuur Relais Data',
      relaySubmitDesc: 'Stuur aflyn relais data',
      streamUpdates: 'Lewendige Opdaterings',
      streamUpdatesDesc: 'Intydse voorval opdaterings',
    },
    // Incident Priority
    priority: {
      low: 'Laag',
      medium: 'Medium',
      high: 'Hoog',
      critical: 'Kritiek',
    },
    // Incident Status
    status: {
      open: 'Oop',
      acknowledged: 'Erken',
      resolved: 'Opgelos',
      cancelled: 'Gekanselleer',
    },
    // Incident Source
    source: {
      app: 'Mobiele App',
      expo: 'Expo Kliënt',
      dashboard: 'Bedryfs Paneel',
      sms: 'SMS',
      ussd: 'USSD',
      relay: 'Relais',
    },
    // Form Fields
    form: {
      clientId: 'Kliënt ID',
      latitude: 'Breedtegraad',
      longitude: 'Lengtegraad',
      description: 'Beskrywing',
      address: 'Adres',
      priority: 'Prioriteit',
      province: 'Provinsie',
      context: 'Addisionele Konteks',
      phoneNumber: 'Telefoon Nommer',
      fullName: 'Volle Naam',
      relationship: 'Verhouding',
      isActive: 'Aktief',
      platform: 'Platform',
      appVersion: 'App Weergawe',
      token: 'Stoot Token',
      shift: 'Skuif',
      minutes: 'Minute',
      vehicle: 'Voertuig',
      frames: 'Data Raamwerke',
    },
    // Messages
    messages: {
      error: 'Fout',
      incidentSubmitted: 'Voorval suksesvol gestuur',
      incidentSubmittedError: 'Kon nie voorval stuur nie',
      contactsUpdated: 'Noodkontakte opgedateer',
      contactsUpdatedError: 'Kon nie kontakte opdateer nie',
      pushRegistered: 'Stoot kennisgewings geregistreer',
      pushRegisteredError: 'Kon nie kennisgewings registreer nie',
      locationRequired: 'Ligging word vereis',
      descriptionRequired: 'Beskrywing word vereis',
      clientIdRequired: 'Kliënt ID word vereis',
      phoneNumberRequired: 'Telefoon nommer word vereis',
      tokenRequired: 'Stoot token word vereis',
      networkError: 'Netwerk fout. Gaan jou verbinding na.',
      serverError: 'Bediener fout. Probeer later weer.',
      unauthorized: 'Ongeoorloof. Teken asseblief weer in.',
      forbidden: 'Toegang geweier.',
      notFound: 'Hulpbron nie gevind nie.',
      validationError: 'Gaan jou invoer na en probeer weer.',
    },
  },
};

export const i18n = {
  locale: currentLanguage,
  language: currentLanguage,
  setLocale: (locale: 'en' | 'af') => {
    currentLanguage = locale;
    (i18n as any).locale = locale;
    (i18n as any).language = locale;
  },
  t: (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      return key;
    }
    
    // Simple parameter replacement
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value;
  },
};

export function currentLocale(): "en" | "af" { 
  return currentLanguage; 
}

export function acceptLanguageHeader(): string {
  return currentLanguage;
}

// Helper hook for translations
export function useTranslation() {
  return {
    t: i18n.t,
    locale: currentLanguage,
    setLocale: i18n.setLocale,
  };
}
