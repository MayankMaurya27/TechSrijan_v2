/**
 * ==============================================================================
 * TechSrijan'27 - Shared API Models & Response Types
 * Synchronized with TechSrijan Backend schemas & Drizzle models
 * ==============================================================================
 */

export type Role = "STUDENT" | "COORDINATOR" | "ADMIN" | "SUPER_ADMIN" | "BOSS";
export type ClubIdentifier = "TSC" | "RC" | "IEEE" | "SAE" | "RESO";
export type Gender = "boys" | "girls";
export type UserGender = "MALE" | "FEMALE" | "OTHER";

export type StayStatus =
  | "PENDING_SUBMISSION"
  | "PENDING_VERIFICATION"
  | "CONFIRMED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type PaymentCategory = "STAY" | "EVENT";
export type PaymentStatus = "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
export type TeamStatus = "FORMING" | "LOCKED" | "DISBANDED";
export type RegistrationStatus = "CONFIRMED" | "PENDING_PAYMENT" | "CANCELLED";
export type EventCategory = "TECHNICAL" | "ROBOTICS" | "GAMING" | "MANAGEMENT" | "WORKSHOP";

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

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  mobile: string;
  collegeName: string;
  gender: UserGender;
  role: Role;
  club?: ClubIdentifier | null;
  isMmmutStudent: boolean;
  userType?: "MMMUT" | "EXTERNAL";
  rollNumber?: string | null;
  city?: string | null;
  branch?: string | null;
  courseYear?: number | null;
  bankAccountNumber?: string | null;
  bankIfsc?: string | null;
  isOnboarded: boolean;
  totalPoints: number;
  emailVerified?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

export interface StayGuest {
  id: string;
  bookingId: string;
  fullName: string;
  gender: Gender;
  mobile: string;
  collegeName: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  checkedInBy?: string | null;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  category: PaymentCategory;
  referenceId: string;
  utrNumber: string;
  amount: number;
  receiptUrl: string;
  status: PaymentStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StayBooking {
  id: string;
  userId: string;
  numPeople: number;
  boysCount: number;
  girlsCount: number;
  overallStatus: StayStatus;
  expiresAt?: string | null;
  amountCalculated: number;
  paymentReference?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserBookingResponse {
  booking: StayBooking;
  guests: StayGuest[];
  payment: PaymentRecord | null;
  tier?: string;
  assignedWing?: string;
  status?: string;
  guestCount?: number;
}

export interface EventRegistrationItem {
  id?: string;
  registrationId: string;
  status: RegistrationStatus;
  attended: boolean;
  createdAt: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  teamId?: string | null;
  teamName?: string | null;
  teamCode?: string | null;
  teamStatus?: TeamStatus | null;
  teamRole?: "LEADER" | "MEMBER" | null;
  event?: {
    id: string;
    title: string;
    slug?: string;
    category?: string;
    participationType?: "SOLO" | "SQUAD";
  };
  team?: {
    id: string;
    name: string;
    joinCode?: string;
    code?: string;
    members?: Array<{
      id: string;
      name: string;
      email: string;
      role?: "LEADER" | "MEMBER";
    }>;
  };
}

export interface PointsLedgerItem {
  id: string;
  source: "ATTENDANCE" | "VICTORY" | "ADJUSTMENT";
  position?: number | null;
  points: number;
  notes?: string | null;
  createdAt: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
}

export interface UserPointsProfile {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  history: PointsLedgerItem[];
}

export interface MeResponse {
  profile: SafeUser;
  user?: SafeUser;
  stayBooking: UserBookingResponse | null;
  eventRegistrations: EventRegistrationItem[];
  pointsProfile: UserPointsProfile;
}


export interface InventoryTier {
  gender: Gender;
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

export interface BackendEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  organizingClub: ClubIdentifier;
  venue?: string | null;
  prizePool: number;
  minTeamSize: number;
  maxTeamSize: number;
  registrationFee: number;
  maxCapacity?: number | null;
  currentRegistrations: number;
  isOpen: boolean;
  attendanceOpen?: boolean;
  winnersOpen?: boolean;
  rulesText?: string | null;
  participationPoints: number;
  firstPlacePoints: number;
  secondPlacePoints: number;
  thirdPlacePoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampusAmbassador {
  id: string;
  operativeCode: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  city: string;
  branch: string;
  courseYear: string;
  statement?: string | null;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED";
  referralCount: number;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  category: "TITLE" | "POWERED_BY" | "ASSOCIATE" | "MEDIA" | "PARTNER";
  logoUrl?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface PresignedPostResult {
  uploadUrl: string;
  fields: Record<string, string>;
  fileKey: string;
  publicUrl: string;
}
