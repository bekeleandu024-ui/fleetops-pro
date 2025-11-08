import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Truck, FlagCheckered, Package, ArrowsOut, ArrowsIn, X, Clock, Path, WarningCircle } from '@phosphor-icons/react'
import type { Trip } from '@/lib/types'
import { getTripStatusColor, getTripStatusLabel } from '@/lib/formatters'

interface FleetMapProps {
  trips: Trip[]
  selectedTrip?: string
  onTripSelect?: (tripId: string) => void
}

interface TooltipData {
  x: number
  y: number
  content: React.ReactNode
}

export function FleetMap({ trips, selectedTrip, onTripSelect }: FleetMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const activeTrips = trips.filter(t => 
    ['dispatched', 'in_transit', 'at_pickup', 'departed_pickup', 'at_delivery'].includes(t.status)
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
  const spanLat = bounds.maxLat - bounds.minLat || 1
  const spanLon = bounds.maxLon - bounds.minLon || 1

  const normalizeX = (lon: number) => ((lon - centerLon) / spanLon) * 65 + 50
  const normalizeY = (lat: number) => ((centerLat - lat) / spanLat) * 65 + 50

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.3, 5))
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.3, 0.5))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false)
      window.addEventListener('mouseup', handleGlobalMouseUp)
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  const showTripTooltip = (trip: Trip, e: React.MouseEvent) => {
    const rect = mapRef.current?.getBoundingClientRect()
    if (!rect) return

    const nextStop = trip.stops.find(s => s.status !== 'completed')
    const completedStops = trip.stops.filter(s => s.status === 'completed').length
    
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Truck size={16} weight="fill" className="text-primary" />
            <span className="font-mono font-bold">{trip.orderRef}</span>
          </div>
          {trip.driver && (
            <div className="text-sm">
              <span className="text-muted-foreground">Driver:</span> {trip.driver.name}
            </div>
          )}
          {trip.asset && (
            <div className="text-sm">
              <span className="text-muted-foreground">Unit:</span> {trip.asset.unitNo}
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Progress:</span> {completedStops}/{trip.stops.length} stops
          </div>
          {nextStop && (
            <div className="text-sm">
              <span className="text-muted-foreground">Next:</span> {nextStop.location.city}, {nextStop.location.state}
            </div>
          )}
          {trip.onTimeRisk !== 'low' && (
            <Badge variant="destructive" className="text-xs">
              {trip.onTimeRisk === 'high' ? 'High Risk' : 'Medium Risk'}
            </Badge>
          )}
        </div>
      ),
    })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      default: return '#3b82f6'
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        <div 
          ref={mapRef}
          className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <motion.div
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <svg className="w-full h-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.4" />
                </filter>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" opacity="0.6" />
                </marker>
              </defs>

              {activeTrips.map((trip) => {
                const completedStops = trip.stops.filter(s => s.status === 'completed')
                const nextStop = trip.stops.find(s => s.status !== 'completed')
                const isSelected = selectedTrip === trip.id
                const isHovered = hoveredTrip === trip.id
                const tripColor = getRiskColor(trip.onTimeRisk)

                return (
                  <g key={trip.id} opacity={isSelected ? 1 : isHovered ? 0.9 : 0.7}>
                    {trip.stops.slice(0, -1).map((stop, idx) => {
                      const nextStopInRoute = trip.stops[idx + 1]
                      const x1 = normalizeX(stop.location.lon)
                      const y1 = normalizeY(stop.location.lat)
                      const x2 = normalizeX(nextStopInRoute.location.lon)
                      const y2 = normalizeY(nextStopInRoute.location.lat)
                      
                      return (
                        <g key={stop.id}>
                          <motion.line
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke={stop.status === 'completed' ? '#10b981' : '#64748b'}
                            strokeWidth={isSelected ? '3' : '2'}
                            strokeDasharray={stop.status === 'completed' ? '0' : '8,4'}
                            opacity={stop.status === 'completed' ? 0.6 : 0.3}
                            markerEnd={stop.status !== 'completed' ? 'url(#arrowhead)' : undefined}
                          />
                        </g>
                      )
                    })}

                    {completedStops.map((stop) => {
                      const x = normalizeX(stop.location.lon)
                      const y = normalizeY(stop.location.lat)

                      return (
                        <g key={stop.id}>
                          <motion.circle
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="8"
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            filter="url(#shadow)"
                          />
                          <text
                            x={`${x}%`}
                            y={`${y}%`}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            ✓
                          </text>
                        </g>
                      )
                    })}

                    {nextStop && (
                      <g>
                        <motion.line
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          x1={`${normalizeX(trip.currentLocation.lon)}%`}
                          y1={`${normalizeY(trip.currentLocation.lat)}%`}
                          x2={`${normalizeX(nextStop.location.lon)}%`}
                          y2={`${normalizeY(nextStop.location.lat)}%`}
                          stroke={tripColor}
                          strokeWidth={isSelected ? '4' : '3'}
                          opacity="0.7"
                          filter="url(#glow)"
                          markerEnd="url(#arrowhead)"
                        />
                        
                        <motion.circle
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          cx={`${normalizeX(nextStop.location.lon)}%`}
                          cy={`${normalizeY(nextStop.location.lat)}%`}
                          r={isSelected ? '12' : '10'}
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          filter="url(#shadow)"
                        />
                        <motion.circle
                          animate={{ r: isSelected ? ['12', '18', '12'] : ['10', '16', '10'], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          cx={`${normalizeX(nextStop.location.lon)}%`}
                          cy={`${normalizeY(nextStop.location.lat)}%`}
                          r="10"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                        />
                        <text
                          x={`${normalizeX(nextStop.location.lon)}%`}
                          y={`${normalizeY(nextStop.location.lat)}%`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          📍
                        </text>
                      </g>
                    )}

                    <g
                      onClick={() => onTripSelect?.(trip.id)}
                      onMouseEnter={(e) => {
                        setHoveredTrip(trip.id)
                        showTripTooltip(trip, e as any)
                      }}
                      onMouseLeave={() => {
                        setHoveredTrip(null)
                        hideTooltip()
                      }}
                      style={{ cursor: 'pointer', pointerEvents: 'all' }}
                    >
                      <motion.circle
                        animate={{ 
                          scale: isSelected ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 1, repeat: isSelected ? Infinity : 0 }}
                        cx={`${normalizeX(trip.currentLocation.lon)}%`}
                        cy={`${normalizeY(trip.currentLocation.lat)}%`}
                        r={isSelected || isHovered ? '18' : '14'}
                        fill={tripColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '3' : '2.5'}
                        filter="url(#glow)"
                      />
                      {(isSelected || isHovered) && (
                        <motion.circle
                          initial={{ r: 18, opacity: 0.6 }}
                          animate={{ r: 30, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          cx={`${normalizeX(trip.currentLocation.lon)}%`}
                          cy={`${normalizeY(trip.currentLocation.lat)}%`}
                          fill="none"
                          stroke={tripColor}
                          strokeWidth="2"
                        />
                      )}
                      <text
                        x={`${normalizeX(trip.currentLocation.lon)}%`}
                        y={`${normalizeY(trip.currentLocation.lat)}%`}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize={isSelected || isHovered ? '14' : '12'}
                        fontWeight="bold"
                      >
                        🚛
                      </text>
                    </g>
                  </g>
                )
              })}
            </svg>
          </motion.div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Card className="p-3 bg-slate-950/80 backdrop-blur-sm border-slate-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
                  <span>High Risk</span>
                </div>
                <div className="h-px bg-slate-600 my-2"></div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>
                  <span>Next Stop</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              className="bg-slate-950/80 backdrop-blur-sm border-slate-700 hover:bg-slate-800"
            >
              <ArrowsOut size={20} className="text-slate-200" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              className="bg-slate-950/80 backdrop-blur-sm border-slate-700 hover:bg-slate-800"
            >
              <ArrowsIn size={20} className="text-slate-200" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleResetView}
              className="bg-slate-950/80 backdrop-blur-sm border-slate-700 hover:bg-slate-800"
            >
              <X size={20} className="text-slate-200" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4">
            <Card className="p-3 bg-slate-950/80 backdrop-blur-sm border-slate-700">
              <div className="text-slate-200 space-y-1">
                <div className="text-2xl font-bold">{activeTrips.length}</div>
                <div className="text-xs text-slate-400">Active Trips</div>
              </div>
            </Card>
          </div>

          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none z-50"
                style={{
                  left: tooltip.x + 15,
                  top: tooltip.y + 15,
                }}
              >
                <Card className="p-3 bg-slate-950/95 backdrop-blur-sm border-slate-700 shadow-2xl max-w-xs">
                  <div className="text-slate-200 text-sm">{tooltip.content}</div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {selectedTrip && (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-white">
          {(() => {
            const trip = activeTrips.find(t => t.id === selectedTrip)
            if (!trip) return null

            const nextStop = trip.stops.find(s => s.status !== 'completed')
            const completedStops = trip.stops.filter(s => s.status === 'completed')
            const progress = (completedStops.length / trip.stops.length) * 100

            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Truck size={24} className="text-primary" weight="fill" />
                      <h3 className="text-xl font-bold font-mono">{trip.orderRef}</h3>
                      <Badge className={getTripStatusColor(trip.status)}>
                        {getTripStatusLabel(trip.status)}
                      </Badge>
                      {trip.onTimeRisk !== 'low' && (
                        <Badge variant="destructive" className="gap-1">
                          <WarningCircle size={14} weight="fill" />
                          {trip.onTimeRisk === 'high' ? 'High Risk' : 'At Risk'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{trip.customer}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTripSelect?.('')}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trip.driver && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Driver</div>
                      <div className="font-medium">{trip.driver.name}</div>
                      <div className="text-xs text-muted-foreground">{trip.driver.phone}</div>
                    </div>
                  )}
                  {trip.asset && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Asset</div>
                      <div className="font-medium">{trip.asset.unitNo}</div>
                      <div className="text-xs text-muted-foreground">
                        {trip.asset.make} {trip.asset.model}
                      </div>
                    </div>
                  )}
                  {trip.trailer && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Trailer</div>
                      <div className="font-medium">{trip.trailer.trailerNo}</div>
                      <div className="text-xs text-muted-foreground capitalize">{trip.trailer.type}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Path size={16} weight="bold" />
                      <span className="font-medium">Route Progress</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {completedStops.length} of {trip.stops.length} stops
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-blue-600"
                    />
                  </div>
                </div>

                {nextStop && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-amber-600 mt-0.5" weight="fill" />
                      <div className="flex-1">
                        <div className="font-medium mb-1">Next Stop</div>
                        <div className="text-sm">{nextStop.location.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {nextStop.location.city}, {nextStop.location.state}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock size={14} />
                          <span>
                            {new Date(nextStop.appointmentStart).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(nextStop.appointmentEnd).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {trip.exceptions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <WarningCircle size={16} weight="fill" className="text-destructive" />
                      Active Exceptions
                    </div>
                    {trip.exceptions.map(exception => (
                      <div key={exception.id} className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm">
                        <div className="font-medium capitalize">{exception.type.replace('_', ' ')}</div>
                        <div className="text-muted-foreground">{exception.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </Card>
      )}
    </div>
  )
}
