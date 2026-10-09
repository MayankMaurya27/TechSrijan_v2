/**
 * ==============================================================================
 * TechSrijan'27 - Frontend API Client (Enterprise Layer)
 * Supports GCP Cloud Run and Local Reverse-Proxy Architecture
 * ==============================================================================
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    traceId?: string;
  };
}

export interface InventoryTier {
  gender: "boys" | "girls";
  totalCapacity: number;
  reservedCount: number;
  confirmedCount: number;
  availableBeds: number;
  isSoldOut: boolean;
  updatedAt: string;
}

export interface ReservationResult {
  bookingId: string;
  paymentReference: string;
  bedCount: number;
  amount: number;
  expiresAt: string;
  upiUri: string;
  qrDataUrl: string;
}

export interface PresignedPostResult {
  uploadUrl: string;
  fields: Record<string, string>;
  fileKey: string;
  publicUrl: string;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("ts27_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      error: { code: "PARSE_ERROR", message: "Failed to parse JSON response" },
    }));

    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || `Request failed with status ${res.status}`);
    }

    return data.data as T;
  }

  // ── AUTHENTICATION ──────────────────────────────────────────────────────────
  auth = {
    register: (body: {
      email: string;
      password: string;
      name: string;
      mobile: string;
      collegeName: string;
      gender: "MALE" | "FEMALE" | "OTHER";
      rollNumber?: string;
      turnstileToken?: string;
    }) =>
      this.request<{ token: string; user: any }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
        }
        return res;
      }),

    login: (body: { email: string; password: string; turnstileToken?: string }) =>
      this.request<{ token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
        }
        return res;
      }),

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ts27_token");
      }
    },

    getMe: () => this.request<{ profile: any; stayBooking: any; eventRegistrations: any[] }>("/api/auth/me"),
  };

  // ── ACCOMMODATION & BED RESERVATION (LOCKING) ────────────────────────────────
  stay = {
    getInventory: () => this.request<InventoryTier[]>("/api/stay/inventory"),

    reserve: (body: {
      gender: "boys" | "girls";
      guests: Array<{
        fullName: string;
        gender: "boys" | "girls";
        mobile: string;
        collegeName: string;
      }>;
      turnstileToken?: string;
    }) =>
      this.request<ReservationResult>("/api/stay/reserve", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    submitPayment: (body: {
      bookingId: string;
      utrNumber: string;
      amount: number;
      receiptUrl: string;
    }) =>
      this.request<{ bookingId: string; paymentId: string; status: string; utrNumber: string }>(
        "/api/stay/submit",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      ),

    getStatus: () => this.request<{ booking: any; guests: any[]; payment: any | null }>("/api/stay/status"),
  };

  // ── TECHNICAL & CULTURAL EVENTS ─────────────────────────────────────────────
  events = {
    list: () => this.request<any[]>("/api/events"),

    registerSolo: (eventId: string) =>
      this.request<any>("/api/events/register", {
        method: "POST",
        body: JSON.stringify({ eventId }),
      }),

    createSquad: (eventId: string, teamName: string) =>
      this.request<any>("/api/events/team/create", {
        method: "POST",
        body: JSON.stringify({ eventId, teamName }),
      }),

    joinSquad: (teamCode: string) =>
      this.request<any>("/api/events/team/join", {
        method: "POST",
        body: JSON.stringify({ teamCode }),
      }),
  };

  // ── ZERO-TRUST STORAGE (CLOUDFLARE R2 PRESIGNED POST) ───────────────────────
  storage = {
    getPresignPolicy: (category: "stay" | "event") =>
      this.request<PresignedPostResult>("/api/storage/presign", {
        method: "POST",
        body: JSON.stringify({ category }),
      }),

    uploadReceipt: async (file: File | Blob, policy: PresignedPostResult): Promise<string> => {
      const formData = new FormData();
      Object.entries(policy.fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

      const res = await fetch(policy.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok && res.status !== 204 && res.status !== 200) {
        throw new Error("Direct Cloudflare R2 upload rejected by edge policy.");
      }

      return policy.publicUrl;
    },

    /**
     * Browser canvas downscaler:
     * Downscales phone camera photos (5-12MB) to 1920x1080 WebP (~180KB)
     * and uploads directly to R2.
     */
    compressAndUpload: async (file: File, category: "stay" | "event"): Promise<string> => {
      const policy = await this.storage.getPresignPolicy(category);

      let blobToUpload: Blob = file;

      // Downscale if in browser environment
      if (typeof window !== "undefined") {
        try {
          blobToUpload = await new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.onload = () => {
              URL.revokeObjectURL(objectUrl);
              const maxDim = 1920;
              let { width, height } = img;
              if (width > maxDim || height > maxDim) {
                const ratio = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
              }
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((b) => resolve(b || file), "image/webp", 0.8);
              } else {
                resolve(file);
              }
            };
            img.onerror = () => resolve(file);
            img.src = objectUrl;
          });
        } catch {
          blobToUpload = file;
        }
      }

      return await this.storage.uploadReceipt(blobToUpload, policy);
    },
  };
}

export const api = new ApiClient();
