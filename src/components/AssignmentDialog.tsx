import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CheckCircle, WarningCircle, Truck, User } from '@phosphor-icons/react'
import type { Driver, Asset, Trailer, Trip } from '@/lib/types'
import { formatHOS } from '@/lib/formatters'

interface AssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip
  drivers: Driver[]
  assets: Asset[]
  trailers: Trailer[]
  onConfirm: (tripId: string, driverId: string, assetId: string, trailerId: string) => void
}

export function AssignmentDialog({
  open,
  onOpenChange,
  trip,
  drivers,
  assets,
  trailers,
  onConfirm,
}: AssignmentDialogProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState<string>('')
  const [selectedTrailer, setSelectedTrailer] = useState<string>('')

  const availableDrivers = drivers.filter(d => d.status === 'available' || d.status === 'assigned')
  const availableAssets = assets.filter(a => a.status === 'available')
  const availableTrailers = trailers.filter(t => t.status === 'available')

  const handleConfirm = () => {
    if (selectedDriver && selectedAsset && selectedTrailer) {
      onConfirm(trip.id, selectedDriver, selectedAsset, selectedTrailer)
      onOpenChange(false)
      setSelectedDriver('')
      setSelectedAsset('')
      setSelectedTrailer('')
    }
  }

  const isValidAssignment = () => {
    if (!selectedDriver) return { valid: false, message: 'Select a driver' }
    const driver = drivers.find(d => d.id === selectedDriver)
    if (driver && driver.hosRemaining < 4) {
      return { valid: false, message: 'Insufficient HOS remaining' }
    }
    if (!selectedAsset) return { valid: false, message: 'Select an asset' }
    if (!selectedTrailer) return { valid: false, message: 'Select a trailer' }
    return { valid: true, message: 'Assignment valid' }
  }

  const validation = isValidAssignment()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Resources to Trip</DialogTitle>
          <DialogDescription>
            Trip {trip.orderRef} - {trip.customer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User size={16} />
              Select Driver
            </h3>
            <div className="grid gap-3">
              {availableDrivers.map((driver) => (
                <Card
                  key={driver.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedDriver === driver.id
                      ? 'ring-2 ring-primary bg-blue-50'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedDriver(driver.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {driver.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{driver.cdlNo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <Badge variant={driver.hosRemaining >= 8 ? 'default' : 'secondary'}>
                          {formatHOS(driver.hosRemaining)} HOS
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{driver.phone}</div>
                    </div>
                    {selectedDriver === driver.id && (
                      <CheckCircle size={24} className="text-primary" weight="fill" />
                    )}
                  </div>
                  {driver.hosRemaining < 4 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                      <WarningCircle size={14} weight="fill" />
                      <span>Low HOS - may not complete trip</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Truck size={16} />
              Select Asset
            </h3>
            <div className="grid gap-3">
              {availableAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedAsset === asset.id
                      ? 'ring-2 ring-primary bg-blue-50'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedAsset(asset.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium font-mono">{asset.unitNo}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.make} {asset.model}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{asset.type}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {asset.odometer.toLocaleString()} mi
                      </div>
                    </div>
                    {selectedAsset === asset.id && (
                      <CheckCircle size={24} className="text-primary" weight="fill" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Truck size={16} />
              Select Trailer
            </h3>
            <div className="grid gap-3">
              {availableTrailers.map((trailer) => (
                <Card
                  key={trailer.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTrailer === trailer.id
                      ? 'ring-2 ring-primary bg-blue-50'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedTrailer(trailer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium font-mono">{trailer.trailerNo}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {trailer.type}
                      </Badge>
                      {selectedTrailer === trailer.id && (
                        <CheckCircle size={24} className="text-primary" weight="fill" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {!validation.valid && selectedDriver && selectedAsset && selectedTrailer && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <WarningCircle size={20} weight="fill" />
              <span className="text-sm font-medium">{validation.message}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!validation.valid}>
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
