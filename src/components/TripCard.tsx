import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Truck, MapPin, Clock, WarningCircle, User, Package } from '@phosphor-icons/react'
import type { Trip } from '@/lib/types'
import { 
  getTripStatusLabel, 
  getTripStatusColor, 
  getRiskBadgeColor, 
  calculateETA, 
  formatTime,
  calculateProgress,
  formatDistance
} from '@/lib/formatters'

interface TripCardProps {
  trip: Trip
  onAssign?: (tripId: string) => void
  onViewDetails?: (tripId: string) => void
}

export function TripCard({ trip, onAssign, onViewDetails }: TripCardProps) {
  const progress = calculateProgress(trip.milesCompleted, trip.milesPlanned)
  const nextStop = trip.stops.find(s => s.status !== 'completed')
  const hasExceptions = trip.exceptions.length > 0

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg font-mono">{trip.orderRef}</h3>
            <Badge className={getTripStatusColor(trip.status)}>
              {getTripStatusLabel(trip.status)}
            </Badge>
            {hasExceptions && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <WarningCircle className="mr-1" size={14} weight="fill" />
                {trip.exceptions.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package size={16} />
            <span>{trip.customer}</span>
          </div>
        </div>
        <Badge className={getRiskBadgeColor(trip.onTimeRisk)}>
          {trip.onTimeRisk.toUpperCase()} RISK
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {trip.driver ? (
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {trip.driver.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{trip.driver.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{trip.asset?.unitNo || 'Unassigned'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">HOS Remaining</div>
              <div className="text-sm font-semibold">{trip.driver.hosRemaining.toFixed(1)}h</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <User size={16} />
            <span className="text-sm font-medium">No driver assigned</span>
            {onAssign && (
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto"
                onClick={() => onAssign(trip.id)}
              >
                Assign
              </Button>
            )}
          </div>
        )}

        {nextStop && (
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-primary mt-0.5" weight="fill" />
            <div className="flex-1">
              <div className="text-sm font-medium">{nextStop.location.name}</div>
              <div className="text-xs text-muted-foreground">
                {nextStop.location.city}, {nextStop.location.state}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {nextStop.type === 'PU' ? 'Pickup' : 'Delivery'}: {formatTime(nextStop.appointmentStart)} - {formatTime(nextStop.appointmentEnd)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Clock size={16} />
                {calculateETA(trip.eta)}
              </div>
              <div className="text-xs text-muted-foreground">ETA</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{formatDistance(trip.milesCompleted)} / {formatDistance(trip.milesPlanned)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {onViewDetails && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4"
          onClick={() => onViewDetails(trip.id)}
        >
          View Details
        </Button>
      )}
    </Card>
  )
}
