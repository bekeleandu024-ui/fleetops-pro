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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ExceptionType, Trip } from '@/lib/types'
import { getExceptionTypeLabel } from '@/lib/formatters'

interface ExceptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip
  onReport: (tripId: string, type: ExceptionType, severity: 'low' | 'medium' | 'high', description: string) => void
}

const exceptionTypes: ExceptionType[] = [
  'delay',
  'route_deviation',
  'equipment_issue',
  'customer_issue',
  'weather',
  'accident',
  'dwell_long',
]

export function ExceptionDialog({ open, onOpenChange, trip, onReport }: ExceptionDialogProps) {
  const [type, setType] = useState<ExceptionType>('delay')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium')
  const [description, setDescription] = useState('')

  const handleReport = () => {
    if (description.trim()) {
      onReport(trip.id, type, severity, description)
      onOpenChange(false)
      setDescription('')
      setType('delay')
      setSeverity('medium')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Exception</DialogTitle>
          <DialogDescription>
            Trip {trip.orderRef} - {trip.customer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="exception-type">Exception Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ExceptionType)}>
              <SelectTrigger id="exception-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exceptionTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getExceptionTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as 'low' | 'medium' | 'high')}>
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the exception and any actions taken..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReport} disabled={!description.trim()}>
            Report Exception
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
