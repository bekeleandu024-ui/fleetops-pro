import type { TripStatus, ExceptionType } from './types'

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculateETA(etaString: string): string {
  const eta = new Date(etaString)
  const now = new Date()
  const diff = eta.getTime() - now.getTime()
  
  if (diff < 0) return 'Overdue'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function getTripStatusLabel(status: TripStatus): string {
  const labels: Record<TripStatus, string> = {
    planned: 'Planned',
    dispatched: 'Dispatched',
    at_pickup: 'At Pickup',
    departed_pickup: 'Departed',
    in_transit: 'In Transit',
    at_delivery: 'At Delivery',
    delivered: 'Delivered',
    closed: 'Closed',
  }
  return labels[status]
}

export function getTripStatusColor(status: TripStatus): string {
  const colors: Record<TripStatus, string> = {
    planned: 'bg-secondary text-secondary-foreground',
    dispatched: 'bg-blue-100 text-blue-800',
    at_pickup: 'bg-purple-100 text-purple-800',
    departed_pickup: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-primary text-primary-foreground',
    at_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-success text-success-foreground',
    closed: 'bg-muted text-muted-foreground',
  }
  return colors[status]
}

export function getRiskColor(risk: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-success',
    medium: 'text-accent',
    high: 'text-destructive',
  }
  return colors[risk]
}

export function getRiskBadgeColor(risk: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  }
  return colors[risk]
}

export function getExceptionTypeLabel(type: ExceptionType): string {
  const labels: Record<ExceptionType, string> = {
    delay: 'Delay',
    route_deviation: 'Route Deviation',
    equipment_issue: 'Equipment Issue',
    customer_issue: 'Customer Issue',
    weather: 'Weather',
    accident: 'Accident',
    dwell_long: 'Extended Dwell',
  }
  return labels[type]
}

export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  }
  return colors[severity]
}

export function calculateProgress(completed: number, planned: number): number {
  return Math.round((completed / planned) * 100)
}

export function formatDistance(miles: number): string {
  return `${miles.toLocaleString()} mi`
}

export function formatHOS(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}
