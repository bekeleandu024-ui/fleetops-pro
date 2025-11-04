import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Truck, FlagCheckered, Package } from '@phosphor-icons/react'
import type { Trip } from '@/lib/types'
import { getTripStatusColor, getTripStatusLabel } from '@/lib/formatters'

interface FleetMapProps {
  trips: Trip[]
  selectedTrip?: string
  onTripSelect?: (tripId: string) => void
}

export function FleetMap({ trips, selectedTrip, onTripSelect }: FleetMapProps) {
  const activeTrips = trips.filter(t => 
    ['in_transit', 'at_pickup', 'departed_pickup', 'at_delivery'].includes(t.status)
  )

  const bounds = activeTrips.reduce(
    (acc, trip) => {
      const lats = [trip.currentLocation.lat, ...trip.stops.map(s => s.location.lat)]
      const lons = [trip.currentLocation.lon, ...trip.stops.map(s => s.location.lon)]
      return {
        minLat: Math.min(acc.minLat, ...lats),
        maxLat: Math.max(acc.maxLat, ...lats),
        minLon: Math.min(acc.minLon, ...lons),
        maxLon: Math.max(acc.maxLon, ...lons),
      }
    },
    { minLat: 90, maxLat: -90, minLon: 180, maxLon: -180 }
  )

  const centerLat = (bounds.minLat + bounds.maxLat) / 2
  const centerLon = (bounds.minLon + bounds.maxLon) / 2
  const spanLat = bounds.maxLat - bounds.minLat
  const spanLon = bounds.maxLon - bounds.minLon

  const normalizeX = (lon: number) => ((lon - centerLon) / spanLon) * 70 + 50
  const normalizeY = (lat: number) => ((centerLat - lat) / spanLat) * 70 + 50

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg overflow-hidden border-2 border-border">
          <svg className="w-full h-full">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>

            {activeTrips.map((trip) => {
              const completedStops = trip.stops.filter(s => s.status === 'completed')
              const nextStop = trip.stops.find(s => s.status !== 'completed')

              return (
                <g key={trip.id}>
                  {completedStops.map((stop, idx) => {
                    const x = normalizeX(stop.location.lon)
                    const y = normalizeY(stop.location.lat)
                    const nextStopInRoute = trip.stops[idx + 1]

                    return (
                      <g key={stop.id}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="6"
                          fill="#22c55e"
                          stroke="white"
                          strokeWidth="2"
                          filter="url(#shadow)"
                        />
                        {nextStopInRoute && (
                          <line
                            x1={`${x}%`}
                            y1={`${y}%`}
                            x2={`${normalizeX(nextStopInRoute.location.lon)}%`}
                            y2={`${normalizeY(nextStopInRoute.location.lat)}%`}
                            stroke="#94a3b8"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            opacity="0.5"
                          />
                        )}
                      </g>
                    )
                  })}

                  {nextStop && (
                    <>
                      <line
                        x1={`${normalizeX(trip.currentLocation.lon)}%`}
                        y1={`${normalizeY(trip.currentLocation.lat)}%`}
                        x2={`${normalizeX(nextStop.location.lon)}%`}
                        y2={`${normalizeY(nextStop.location.lat)}%`}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        opacity="0.6"
                      />
                      <circle
                        cx={`${normalizeX(nextStop.location.lon)}%`}
                        cy={`${normalizeY(nextStop.location.lat)}%`}
                        r="8"
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                        filter="url(#shadow)"
                      />
                    </>
                  )}

                  <g
                    onClick={() => onTripSelect?.(trip.id)}
                    className="cursor-pointer"
                    style={{ pointerEvents: 'all' }}
                  >
                    <circle
                      cx={`${normalizeX(trip.currentLocation.lon)}%`}
                      cy={`${normalizeY(trip.currentLocation.lat)}%`}
                      r={selectedTrip === trip.id ? "14" : "10"}
                      fill="#3b82f6"
                      stroke={selectedTrip === trip.id ? "#1e40af" : "white"}
                      strokeWidth={selectedTrip === trip.id ? "3" : "2"}
                      filter="url(#shadow)"
                    />
                    <text
                      x={`${normalizeX(trip.currentLocation.lon)}%`}
                      y={`${normalizeY(trip.currentLocation.lat)}%`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      T
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>

          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
              <span>Active Truck</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              <span>Completed Stop</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></div>
              <span>Next Stop</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTrips.map((trip) => {
          const nextStop = trip.stops.find(s => s.status !== 'completed')
          return (
            <Card
              key={trip.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedTrip === trip.id
                  ? 'ring-2 ring-primary shadow-md'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onTripSelect?.(trip.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-primary" weight="fill" />
                  <span className="font-mono font-semibold">{trip.orderRef}</span>
                </div>
                <Badge className={getTripStatusColor(trip.status)} variant="secondary">
                  {getTripStatusLabel(trip.status)}
                </Badge>
              </div>

              {trip.driver && (
                <div className="text-sm mb-2">
                  <span className="text-muted-foreground">Driver: </span>
                  <span className="font-medium">{trip.driver.name}</span>
                </div>
              )}

              {nextStop && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-amber-600 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-medium">{nextStop.location.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {nextStop.location.city}, {nextStop.location.state}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
