import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { TripCard } from '@/components/TripCard'
import { KPIDashboard } from '@/components/KPIDashboard'
import { FleetMap } from '@/components/FleetMap'
import { AssignmentDialog } from '@/components/AssignmentDialog'
import { ExceptionDialog } from '@/components/ExceptionDialog'
import { ListBullets, MapTrifold, ChartBar, Truck, WarningCircle } from '@phosphor-icons/react'
import type { Trip, Driver, Asset, Trailer, ExceptionType, KPIMetrics } from '@/lib/types'
import { getMockTrips, getMockDrivers, getMockAssets, getMockTrailers, getMockKPIs } from '@/lib/mockData'

function App() {
  const [trips, setTrips] = useKV<Trip[]>('fleet-trips', getMockTrips())
  const [drivers, setDrivers] = useKV<Driver[]>('fleet-drivers', getMockDrivers())
  const [assets, setAssets] = useKV<Asset[]>('fleet-assets', getMockAssets())
  const [trailers, setTrailers] = useKV<Trailer[]>('fleet-trailers', getMockTrailers())
  const [kpis] = useKV<KPIMetrics>('fleet-kpis', getMockKPIs())
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedTrip, setSelectedTrip] = useState<string>()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false)
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)

  const safeTrips = trips || []
  const safeDrivers = drivers || []
  const safeAssets = assets || []
  const safeTrailers = trailers || []
  const safeKpis: KPIMetrics = kpis || getMockKPIs()

  const handleAssignTrip = (tripId: string) => {
    const trip = safeTrips.find(t => t.id === tripId)
    if (trip) {
      setCurrentTrip(trip)
      setAssignDialogOpen(true)
    }
  }

  const handleConfirmAssignment = (tripId: string, driverId: string, assetId: string, trailerId: string) => {
    setTrips((currentTrips) => {
      const allTrips = currentTrips || []
      const driver = safeDrivers.find(d => d.id === driverId)
      const asset = safeAssets.find(a => a.id === assetId)
      const trailer = safeTrailers.find(t => t.id === trailerId)

      return allTrips.map(trip =>
        trip.id === tripId
          ? { ...trip, driver, asset, trailer, status: 'dispatched' as const }
          : trip
      )
    })

    setDrivers((currentDrivers) => {
      const allDrivers = currentDrivers || []
      return allDrivers.map(d =>
        d.id === driverId ? { ...d, status: 'assigned' as const } : d
      )
    })

    setAssets((currentAssets) => {
      const allAssets = currentAssets || []
      return allAssets.map(a =>
        a.id === assetId ? { ...a, status: 'assigned' as const } : a
      )
    })

    setTrailers((currentTrailers) => {
      const allTrailers = currentTrailers || []
      return allTrailers.map(t =>
        t.id === trailerId ? { ...t, status: 'assigned' as const } : t
      )
    })

    toast.success('Resources assigned successfully', {
      description: `Trip ${tripId} has been assigned`,
    })
  }

  const handleReportException = (tripId: string) => {
    const trip = safeTrips.find(t => t.id === tripId)
    if (trip) {
      setCurrentTrip(trip)
      setExceptionDialogOpen(true)
    }
  }

  const handleConfirmException = (
    tripId: string,
    type: ExceptionType,
    severity: 'low' | 'medium' | 'high',
    description: string
  ) => {
    setTrips((currentTrips) => {
      const allTrips = currentTrips || []
      return allTrips.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              exceptions: [
                ...trip.exceptions,
                {
                  id: `exc-${Date.now()}`,
                  tripId,
                  type,
                  severity,
                  description,
                  reportedAt: new Date().toISOString(),
                },
              ],
              onTimeRisk: severity === 'high' ? 'high' as const : trip.onTimeRisk,
            }
          : trip
      )
    })

    toast.warning('Exception reported', {
      description: `${type} exception logged for trip ${tripId}`,
    })
  }

  const activeTrips = safeTrips.filter(t =>
    ['dispatched', 'at_pickup', 'departed_pickup', 'in_transit', 'at_delivery'].includes(t.status)
  )

  const atRiskTrips = activeTrips.filter(t => t.onTimeRisk === 'high' || t.onTimeRisk === 'medium')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Truck size={28} className="text-primary-foreground" weight="fill" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FleetCommand</h1>
                <p className="text-sm text-muted-foreground">Logistics & Fleet Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Active Trips</div>
                <div className="text-2xl font-bold">{activeTrips.length}</div>
              </div>
              {atRiskTrips.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <WarningCircle size={16} weight="fill" />
                  {atRiskTrips.length} At Risk
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <ListBullets size={18} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapTrifold size={18} />
              Fleet Map
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartBar size={18} />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Trips</h2>
                <p className="text-muted-foreground">Monitor and manage ongoing deliveries</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTrips(getMockTrips())
                    setDrivers(getMockDrivers())
                    setAssets(getMockAssets())
                    setTrailers(getMockTrailers())
                    toast.info('Data refreshed')
                  }}
                >
                  Refresh Data
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safeTrips.map(trip => (
                <div key={trip.id}>
                  <TripCard
                    trip={trip}
                    onAssign={handleAssignTrip}
                  />
                  {trip.driver && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleReportException(trip.id)}
                    >
                      <WarningCircle size={16} className="mr-2" />
                      Report Exception
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Fleet Map</h2>
              <p className="text-muted-foreground">Real-time fleet positions and routes</p>
            </div>
            <FleetMap
              trips={safeTrips}
              selectedTrip={selectedTrip}
              onTripSelect={setSelectedTrip}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Key performance indicators and metrics</p>
            </div>
            <KPIDashboard metrics={safeKpis} />
          </TabsContent>
        </Tabs>
      </main>

      {currentTrip && (
        <>
          <AssignmentDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            trip={currentTrip}
            drivers={safeDrivers}
            assets={safeAssets}
            trailers={safeTrailers}
            onConfirm={handleConfirmAssignment}
          />
          <ExceptionDialog
            open={exceptionDialogOpen}
            onOpenChange={setExceptionDialogOpen}
            trip={currentTrip}
            onReport={handleConfirmException}
          />
        </>
      )}

      <Toaster />
    </div>
  )
}

export default App
