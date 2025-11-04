import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, Package, TrendUp, Truck, User } from '@phosphor-icons/react'
import type { KPIMetrics } from '@/lib/types'

interface KPIDashboardProps {
  metrics: KPIMetrics
}

export function KPIDashboard({ metrics }: KPIDashboardProps) {
  const kpis = [
    {
      label: 'On-Time Delivery',
      value: `${metrics.onTimeDeliveryRate.toFixed(1)}%`,
      target: 95,
      icon: CheckCircle,
      color: metrics.onTimeDeliveryRate >= 95 ? 'text-success' : 'text-amber-600',
      bgColor: metrics.onTimeDeliveryRate >= 95 ? 'bg-green-50' : 'bg-amber-50',
    },
    {
      label: 'Avg Dwell Time',
      value: `${metrics.avgDwellTime} min`,
      target: 75,
      icon: Clock,
      color: metrics.avgDwellTime <= 75 ? 'text-success' : 'text-amber-600',
      bgColor: metrics.avgDwellTime <= 75 ? 'bg-green-50' : 'bg-amber-50',
    },
    {
      label: 'Trailer Utilization',
      value: `${metrics.trailerUtilization.toFixed(1)}%`,
      target: 80,
      icon: Package,
      color: metrics.trailerUtilization >= 80 ? 'text-success' : 'text-amber-600',
      bgColor: metrics.trailerUtilization >= 80 ? 'bg-green-50' : 'bg-amber-50',
    },
    {
      label: 'Empty Miles',
      value: `${metrics.emptyMilesPercent.toFixed(1)}%`,
      target: 15,
      icon: TrendUp,
      color: metrics.emptyMilesPercent <= 15 ? 'text-success' : 'text-amber-600',
      bgColor: metrics.emptyMilesPercent <= 15 ? 'bg-green-50' : 'bg-amber-50',
    },
  ]

  const resources = [
    {
      label: 'Active Trips',
      value: metrics.activeTrips,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Available Drivers',
      value: metrics.availableDrivers,
      icon: User,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Available Assets',
      value: metrics.availableAssets,
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Performance KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon size={20} className={kpi.color} weight="fill" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Target: {kpi.label === 'Avg Dwell Time' ? '≤' : '≥'} {kpi.target}{kpi.label.includes('%') || kpi.label === 'Empty Miles' ? '%' : ' min'}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Resource Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <Card key={resource.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${resource.bgColor}`}>
                    <Icon size={24} className={resource.color} weight="fill" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{resource.value}</div>
                    <div className="text-sm text-muted-foreground">{resource.label}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
