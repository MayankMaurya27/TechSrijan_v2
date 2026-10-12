/**
 * ==============================================================================
 * TechSrijan'27 - Frontend API Client (Enterprise Layer)
 * Supports GCP Cloud Run and Local Reverse-Proxy Architecture
 * ==============================================================================
 */

import type {
  ApiResponse,
  SafeUser,
  AuthResponse,
  MeResponse,
  InventoryTier,
  ReservationResult,
  UserBookingResponse,
  BackendEvent,
  CampusAmbassador,
  Sponsor,
  PresignedPostResult,
  UserPointsProfile,
  PaymentRecord,
} from "./types";

export * from "./types";

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code = "API_ERROR", details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }
  // If running in browser on production domain, directly communicate with live backend
  if (typeof window !== "undefined" && window.location.hostname.includes("techsrijan.org")) {
    return "https://techsrijan-backend.onrender.com";
  }
  return "";
};

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("ts27_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    let data: ApiResponse<T>;
    try {
      data = await res.json();
    } catch {
      const statusMsg = !res.ok
        ? `Server responded with HTTP ${res.status} (${res.statusText || "Error"})`
        : "Failed to parse JSON response";
      throw new ApiError(statusMsg, `HTTP_${res.status}`);
    }

    if (!res.ok || !data.success) {
      const errorMessage =
        data.error?.message || `Request failed with status ${res.status}`;
      throw new ApiError(errorMessage, data.error?.code, data.error?.details);
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
      isMmmutStudent?: boolean;
      studentType?: "MMMUT" | "OUTSIDER";
      turnstileToken?: string;
    }) =>
      this.request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
          localStorage.setItem("ts27_user_profile", JSON.stringify(res.user));
        }
        return res;
      }),

    login: (body: {
      email?: string;
      identifier?: string;
      password: string;
      turnstileToken?: string;
    }) =>
      this.request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
          localStorage.setItem("ts27_user_profile", JSON.stringify(res.user));
        }
        return res;
      }),

    loginAdmin: (body: {
      identifier: string;
      password: string;
      turnstileToken?: string;
    }) =>
      this.request<AuthResponse>("/api/auth/admin-login", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
          localStorage.setItem("ts27_user_profile", JSON.stringify(res.user));
        }
        return res;
      }),

    oauthLogin: (body: {
      email: string;
      name?: string;
      image?: string | null;
      provider: "google" | "mmmut";
      rollNumber?: string | null;
    }) =>
      this.request<AuthResponse>("/api/auth/oauth", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => {
        if (typeof window !== "undefined" && res.token) {
          localStorage.setItem("ts27_token", res.token);
          localStorage.setItem("ts27_user_profile", JSON.stringify(res.user));
        }
        return res;
      }),

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ts27_token");
        localStorage.removeItem("ts27_user_profile");
      }
    },

    getMe: () => this.request<MeResponse>("/api/auth/me"),
  };

  // ── USER PROFILE & ONBOARDING ───────────────────────────────────────────────
  user = {
    onboard: (body: {
      bankAccountNumber?: string;
      bankIfsc?: string;
      collegeName?: string;
      city?: string;
      branch?: string;
      courseYear?: number;
    }) =>
      this.request<SafeUser>("/api/user/onboarding", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((user) => {
        if (typeof window !== "undefined" && user) {
          localStorage.setItem("ts27_user_profile", JSON.stringify(user));
        }
        return user;
      }),

    updateProfile: (body: {
      name?: string;
      mobile?: string;
      collegeName?: string;
      bankAccountNumber?: string;
      bankIfsc?: string;
      city?: string;
      branch?: string;
      courseYear?: number;
    }) =>
      this.request<SafeUser>("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      }).then((user) => {
        if (typeof window !== "undefined" && user) {
          localStorage.setItem("ts27_user_profile", JSON.stringify(user));
        }
        return user;
      }),

    getPoints: () => this.request<UserPointsProfile>("/api/user/points"),
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
      this.request<{
        bookingId: string;
        paymentId: string;
        status: string;
        utrNumber: string;
      }>("/api/stay/submit", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    getStatus: () => this.request<UserBookingResponse>("/api/stay/status"),
  };

  // ── TECHNICAL & CULTURAL EVENTS ─────────────────────────────────────────────
  events = {
    list: () => this.request<BackendEvent[]>("/api/events"),

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

  // ── CAMPUS AMBASSADOR ───────────────────────────────────────────────────────
  ambassador = {
    apply: (body: {
      fullName: string;
      email: string;
      phone: string;
      college: string;
      city: string;
      branch: string;
      courseYear: string;
      statement?: string;
    }) =>
      this.request<CampusAmbassador>("/api/ambassador/apply", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };

  // ── SPONSORS ────────────────────────────────────────────────────────────────
  sponsors = {
    list: () => this.request<Sponsor[]>("/api/sponsors"),

    inquire: (body: {
      company_name: string;
      contact_person: string;
      email: string;
      phone: string;
      proposed_budget_tier?: string;
      message?: string;
    }) =>
      this.request<{ success: boolean; message: string }>("/api/sponsors/inquiry", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };

  // ── CONTACT & TRANSMISSIONS ─────────────────────────────────────────────────
  contact = {
    submit: (body: {
      name: string;
      email: string;
      subject?: string;
      message: string;
    }) =>
      this.request<{ success: boolean; message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };

  // ── ZERO-TRUST STORAGE (CLOUDFLARE R2 PRESIGNED POST) ───────────────────────
  storage = {
    getPresignPolicy: (category: "stay" | "event", turnstileToken?: string) =>
      this.request<PresignedPostResult>("/api/storage/presign", {
        method: "POST",
        body: JSON.stringify({ category, turnstileToken }),
      }),

    uploadReceipt: async (
      file: File | Blob,
      policy: PresignedPostResult
    ): Promise<string> => {
      const formData = new FormData();
      Object.entries(policy.fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

      const res = await fetch(policy.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok && res.status !== 204 && res.status !== 200) {
        throw new ApiError(
          "Direct Cloudflare R2 upload rejected by edge policy.",
          "UPLOAD_REJECTED"
        );
      }

      return policy.publicUrl;
    },

    /**
     * Browser canvas downscaler:
     * Downscales phone camera photos (5-12MB) to 1920x1080 WebP (~180KB)
     * and uploads directly to Cloudflare R2.
     */
    compressAndUpload: async (
      file: File,
      category: "stay" | "event"
    ): Promise<string> => {
      const policy = await this.storage.getPresignPolicy(category);

      let blobToUpload: Blob = file;

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

  // ── ADMIN SUITE ─────────────────────────────────────────────────────────────
  admin = {
    payments: {
      list: (status?: string) =>
        this.request<any[]>(
          status ? `/api/admin/payments?status=${encodeURIComponent(status)}` : "/api/admin/payments"
        ),
      verify: (body: {
        paymentId: string;
        status: "VERIFIED" | "REJECTED";
        rejectionReason?: string;
      }) =>
        this.request<PaymentRecord>("/api/admin/verify-payment", {
          method: "POST",
          body: JSON.stringify(body),
        }),
    },

    stay: {
      listBookings: () => this.request<any[]>("/api/admin/stay/bookings"),
    },

    events: {
      list: () => this.request<BackendEvent[]>("/api/admin/events"),
      create: (body: any) =>
        this.request<BackendEvent>("/api/admin/events", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      update: (id: string, body: any) =>
        this.request<BackendEvent>(`/api/admin/events/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        }),
      delete: (id: string) =>
        this.request<{ success: boolean; message: string }>(`/api/admin/events/${id}`, {
          method: "DELETE",
        }),
      getParticipants: (id: string) =>
        this.request<any>(`/api/admin/events/${id}/participants`),
      markAttendance: (id: string, attendees: Array<{ registrationId: string; attended: boolean }>) =>
        this.request<any>(`/api/admin/events/${id}/attendance`, {
          method: "PATCH",
          body: JSON.stringify({ attendees }),
        }),
      getPodium: (id: string) => this.request<any>(`/api/admin/events/${id}/podium`),
      declarePodium: (id: string, podium: Array<{ position: 1 | 2 | 3; registrationId: string }>) =>
        this.request<any>(`/api/admin/events/${id}/podium`, {
          method: "POST",
          body: JSON.stringify({ podium }),
        }),
      updatePointsConfig: (id: string, body: any) =>
        this.request<BackendEvent>(`/api/admin/events/${id}/points-config`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
    },

    ambassadors: {
      list: () => this.request<CampusAmbassador[]>("/api/admin/ambassadors"),
      updateStatus: (id: string, status: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED") =>
        this.request<CampusAmbassador>(`/api/admin/ambassadors/${id}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        }),
    },

    sponsors: {
      list: () => this.request<Sponsor[]>("/api/admin/sponsors"),
      create: (body: any) =>
        this.request<Sponsor>("/api/admin/sponsors", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      update: (id: string, body: any) =>
        this.request<Sponsor>(`/api/admin/sponsors/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        }),
      delete: (id: string) =>
        this.request<{ success: boolean; message: string }>(`/api/admin/sponsors/${id}`, {
          method: "DELETE",
        }),
    },

    credentials: {
      list: () => this.request<any[]>("/api/admin/credentials"),
      create: (body: any) =>
        this.request<any>("/api/admin/credentials", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      update: (id: string, body: any) =>
        this.request<any>(`/api/admin/credentials/${id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      delete: (id: string) =>
        this.request<any>(`/api/admin/credentials/${id}`, {
          method: "DELETE",
        }),
    },

    checkIn: (body: { type: "STAY_GUEST" | "EVENT_ATTENDEE"; id: string }) =>
      this.request<{ type: string; record: any; message: string }>("/api/admin/check-in", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    settings: {
      get: () =>
        this.request<{ attendanceOpen: boolean; winnersOpen: boolean }>("/api/admin/settings"),
      update: (body: { attendanceOpen?: boolean; winnersOpen?: boolean }) =>
        this.request<{ attendanceOpen: boolean; winnersOpen: boolean }>("/api/admin/settings", {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
    },

    exportGateRosterUrl: () => "/api/admin/export-gate-roster",
  };
}

export const api = new ApiClient();
