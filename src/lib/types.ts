export type TripStatus = 'planned' | 'dispatched' | 'at_pickup' | 'departed_pickup' | 'in_transit' | 'at_delivery' | 'delivered' | 'closed'

export type ExceptionType = 'delay' | 'route_deviation' | 'equipment_issue' | 'customer_issue' | 'weather' | 'accident' | 'dwell_long'

export type AssetType = 'tractor' | 'straight'

export type TrailerType = 'dry' | 'reefer' | 'flatbed'

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  lat: number
  lon: number
}

export interface Driver {
  id: string
  name: string
  cdlNo: string
  status: 'available' | 'assigned' | 'off_duty'
  hosRemaining: number
  lastLocation?: { lat: number; lon: number }
  phone: string
  avatar?: string
}

export interface Asset {
  id: string
  unitNo: string
  type: AssetType
  make: string
  model: string
  status: 'available' | 'assigned' | 'maintenance'
  location: { lat: number; lon: number }
  odometer: number
}

export interface Trailer {
  id: string
  trailerNo: string
  type: TrailerType
  status: 'available' | 'assigned' | 'maintenance'
  location?: { lat: number; lon: number }
}

export interface Stop {
  id: string
  seq: number
  location: Location
  type: 'PU' | 'DO'
  appointmentStart: string
  appointmentEnd: string
  actualArrival?: string
  actualDeparture?: string
  status: 'pending' | 'arrived' | 'completed'
}

export interface Trip {
  id: string
  orderRef: string
  status: TripStatus
  driver?: Driver
  asset?: Asset
  trailer?: Trailer
  stops: Stop[]
  currentLocation: { lat: number; lon: number }
  eta: string
  onTimeRisk: 'low' | 'medium' | 'high'
  milesPlanned: number
  milesCompleted: number
  customer: string
  commodity: string
  exceptions: Exception[]
  createdAt: string
}

export interface Exception {
  id: string
  tripId: string
  type: ExceptionType
  severity: 'low' | 'medium' | 'high'
  description: string
  reportedAt: string
  resolvedAt?: string
  notes?: string
}

export interface KPIMetrics {
  onTimeDeliveryRate: number
  avgDwellTime: number
  trailerUtilization: number
  emptyMilesPercent: number
  activeTrips: number
  availableDrivers: number
  availableAssets: number
}
