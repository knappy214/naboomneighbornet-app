import { config } from '../config/environment';
import { acceptLanguageHeader } from '../i18n';
import { api } from '../lib/wagtailApi';

const API_BASE = config.apiBase;

// Types for API requests and responses
export interface IncidentSubmission {
  client_id?: string;
  lat?: number;
  lng?: number;
  description?: string;
  source?: string;
  address?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical' | 1 | 2 | 3 | 4;
  province?: string;
  context?: Record<string, any>;
  event_description?: string;
}

export interface IncidentResponse {
  id: number;
  reference: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  description?: string;
  source?: string;
  address?: string;
  province?: string;
  context?: Record<string, any>;
  events?: IncidentEvent[];
}

export interface IncidentEvent {
  id: number;
  kind: string;
  description: string;
  created_at: string;
}

export interface EmergencyContact {
  phone_number: string;
  full_name?: string;
  relationship?: string;
  priority?: number;
  is_active?: boolean;
}

export interface ContactsBulkUpsertRequest {
  client_id: string;
  contacts: EmergencyContact[];
}

export interface ContactsBulkUpsertResponse {
  created: number;
  updated: number;
}

export interface PushRegistrationRequest {
  token: string;
  client_id?: string;
  platform?: 'android' | 'ios' | 'web' | 'unknown';
  app_version?: string;
}

export interface PushRegistrationResponse {
  success: boolean;
  message?: string;
}

export interface PatrolAlert {
  id: number;
  kind: string;
  details: string;
  created_at: string;
  shift_id?: string;
  waypoint?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    province: string;
  };
}

export interface Responder {
  id: number;
  name: string;
  phone_number?: string;
  province?: string;
  is_active: boolean;
}

export interface Waypoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  province: string;
}

export interface VehiclePosition {
  id: number;
  latitude: number;
  longitude: number;
  speed_kph?: number;
  heading_deg?: number;
  last_seen: string;
}

export interface VehicleTrack {
  vehicle_id: string;
  positions: {
    latitude: number;
    longitude: number;
    timestamp: string;
    speed_kph?: number;
    heading_deg?: number;
  }[];
}

export interface RelayFrame {
  incident_reference?: string;
  data: Record<string, any>;
  timestamp?: string;
}

export interface RelaySubmitRequest {
  frames: RelayFrame[];
}

// Base HTTP client with proper headers
const createHttpClient = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': acceptLanguageHeader(),
  };

  return {
    async request<T>(url: string, options: RequestInit = {}): Promise<T> {
      const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  };
};

const http = createHttpClient();

// Panic API functions
export const panicApi = {
  // Submit a panic incident
  async submitIncident(data: IncidentSubmission): Promise<IncidentResponse> {
    return http.request<IncidentResponse>('/panic/api/submit/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Bulk upsert emergency contacts
  async bulkUpsertContacts(data: ContactsBulkUpsertRequest): Promise<ContactsBulkUpsertResponse> {
    return http.request<ContactsBulkUpsertResponse>('/panic/api/contacts/bulk_upsert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Register push token
  async registerPushToken(data: PushRegistrationRequest): Promise<PushRegistrationResponse> {
    return http.request<PushRegistrationResponse>('/panic/api/push/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get incidents (with optional filters)
  async getIncidents(params: {
    status?: string;
    province?: string;
    limit?: number;
  } = {}): Promise<{ results: IncidentResponse[] }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.province) searchParams.append('province', params.province);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/panic/api/incidents/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: IncidentResponse[] }>(url);
  },

  // Get patrol alerts
  async getPatrolAlerts(params: {
    shift?: string;
    limit?: number;
  } = {}): Promise<{ results: PatrolAlert[] }> {
    const searchParams = new URLSearchParams();
    if (params.shift) searchParams.append('shift', params.shift);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/panic/api/alerts/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: PatrolAlert[] }>(url);
  },

  // Get responders (using Wagtail API endpoint as per PANIC.md)
  async getResponders(params: {
    province?: string;
  } = {}): Promise<{ results: Responder[] }> {
    const searchParams = new URLSearchParams();
    if (params.province) searchParams.append('province', params.province);
    
    const queryString = searchParams.toString();
    const path = `/responders/${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 [PANIC API] Making request to:', path);
    
    // Use JWT-enabled API with auto-refresh
    const response = await api.get<any>(path);
    
    console.log('🔍 [PANIC API] Raw response from server:', response);
    console.log('🔍 [PANIC API] Response type:', typeof response);
    console.log('🔍 [PANIC API] Response keys:', response ? Object.keys(response) : 'null/undefined');
    
    // Handle different response structures
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // Direct array response
        console.log('🔍 [PANIC API] Response is direct array, wrapping in results');
        return { results: response };
      } else if (response.results) {
        // Standard { results: [...] } structure
        console.log('🔍 [PANIC API] Response has results property');
        return response;
      } else if (response.items) {
        // Wagtail API structure: { meta: {...}, items: [...] }
        console.log('🔍 [PANIC API] Response has items property (Wagtail API), mapping to results');
        return { results: response.items };
      } else if (response.data) {
        // Alternative { data: [...] } structure
        console.log('🔍 [PANIC API] Response has data property, mapping to results');
        return { results: response.data };
      } else {
        // Single object response, wrap in array
        console.log('🔍 [PANIC API] Response is single object, wrapping in array');
        return { results: [response] };
      }
    }
    
    // Fallback for unexpected response
    console.warn('🔍 [PANIC API] Unexpected response structure, returning empty results');
    return { results: [] };
  },

  // Get waypoints
  async getWaypoints(params: {
    province?: string;
  } = {}): Promise<{ results: Waypoint[] }> {
    const searchParams = new URLSearchParams();
    if (params.province) searchParams.append('province', params.province);
    
    const queryString = searchParams.toString();
    const url = `/panic/api/waypoints/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: Waypoint[] }>(url);
  },


  // Get live vehicle positions
  async getLiveVehicles(): Promise<{ type: 'FeatureCollection'; features: any[] }> {
    return http.request<{ type: 'FeatureCollection'; features: any[] }>('/panic/api/vehicle/live');
  },

  // Get vehicle tracks
  async getVehicleTracks(params: {
    minutes?: number;
    vehicle?: string;
  } = {}): Promise<{ results: VehicleTrack[] }> {
    const searchParams = new URLSearchParams();
    if (params.minutes) searchParams.append('minutes', params.minutes.toString());
    if (params.vehicle) searchParams.append('vehicle', params.vehicle);
    
    const queryString = searchParams.toString();
    const url = `/panic/api/vehicle/tracks/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: VehicleTrack[] }>(url);
  },

  // Submit relay data
  async submitRelayData(data: RelaySubmitRequest): Promise<{ success: boolean; message?: string }> {
    return http.request<{ success: boolean; message?: string }>('/panic/api/relay_submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Acknowledge incident (requires authentication)
  async acknowledgeIncident(incidentId: number): Promise<{ success: boolean; message?: string }> {
    return http.request<{ success: boolean; message?: string }>(`/panic/api/incidents/${incidentId}/ack`, {
      method: 'POST',
    });
  },

  // Resolve incident (requires authentication)
  async resolveIncident(incidentId: number): Promise<{ success: boolean; message?: string }> {
    return http.request<{ success: boolean; message?: string }>(`/panic/api/incidents/${incidentId}/resolve`, {
      method: 'POST',
    });
  },
};

// Wagtail API functions (require JWT authentication)
export const wagtailApi = {
  // Get incidents via Wagtail API
  async getIncidents(params: {
    status?: string;
    province?: string;
    limit?: number;
  } = {}): Promise<{ results: IncidentResponse[]; meta: any }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.province) searchParams.append('province', params.province);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/api/v2/panic/incidents/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: IncidentResponse[]; meta: any }>(url);
  },

  // Get single incident
  async getIncident(incidentId: number): Promise<IncidentResponse> {
    return http.request<IncidentResponse>(`/api/v2/panic/incidents/${incidentId}/`);
  },

  // Get responders via Wagtail API
  async getResponders(params: {
    province?: string;
  } = {}): Promise<{ results: Responder[] }> {
    const searchParams = new URLSearchParams();
    if (params.province) searchParams.append('province', params.province);
    
    const queryString = searchParams.toString();
    const url = `/api/v2/panic/responders/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: Responder[] }>(url);
  },

  // Get patrol alerts via Wagtail API
  async getPatrolAlerts(params: {
    shift?: string;
    limit?: number;
  } = {}): Promise<{ results: PatrolAlert[] }> {
    const searchParams = new URLSearchParams();
    if (params.shift) searchParams.append('shift', params.shift);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/api/v2/panic/alerts/${queryString ? `?${queryString}` : ''}`;
    
    return http.request<{ results: PatrolAlert[] }>(url);
  },

  // Get single patrol alert
  async getPatrolAlert(alertId: number): Promise<PatrolAlert> {
    return http.request<PatrolAlert>(`/api/v2/panic/alerts/${alertId}/`);
  },
};
