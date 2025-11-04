import type { Trip, Driver, Asset, Trailer, Location, Exception, KPIMetrics } from './types'

const locations: Location[] = [
  { id: 'loc1', name: 'Chicago Distribution Center', address: '1500 W Fulton St', city: 'Chicago', state: 'IL', lat: 41.8868, lon: -87.6564 },
  { id: 'loc2', name: 'Detroit Warehouse', address: '2800 E Grand Blvd', city: 'Detroit', state: 'MI', lat: 42.3681, lon: -83.0758 },
  { id: 'loc3', name: 'Indianapolis Hub', address: '4701 W Washington St', city: 'Indianapolis', state: 'IN', lat: 39.7742, lon: -86.2384 },
  { id: 'loc4', name: 'Columbus Depot', address: '1234 Alum Creek Dr', city: 'Columbus', state: 'OH', lat: 39.9848, lon: -82.9853 },
  { id: 'loc5', name: 'Milwaukee Plant', address: '800 W Capitol Dr', city: 'Milwaukee', state: 'WI', lat: 43.0642, lon: -87.9673 },
  { id: 'loc6', name: 'Cleveland Facility', address: '3100 Chester Ave', city: 'Cleveland', state: 'OH', lat: 41.5051, lon: -81.6934 },
]

const drivers: Driver[] = [
  { id: 'drv1', name: 'John Martinez', cdlNo: 'CDL-IL-8829', status: 'assigned', hosRemaining: 8.5, phone: '312-555-0101', avatar: 'JM' },
  { id: 'drv2', name: 'Sarah Chen', cdlNo: 'CDL-MI-4432', status: 'assigned', hosRemaining: 6.2, phone: '313-555-0202', avatar: 'SC' },
  { id: 'drv3', name: 'Michael Johnson', cdlNo: 'CDL-IN-7651', status: 'available', hosRemaining: 11.0, phone: '317-555-0303', avatar: 'MJ' },
  { id: 'drv4', name: 'Emily Davis', cdlNo: 'CDL-OH-3345', status: 'assigned', hosRemaining: 4.8, phone: '614-555-0404', avatar: 'ED' },
  { id: 'drv5', name: 'Robert Wilson', cdlNo: 'CDL-WI-9982', status: 'available', hosRemaining: 9.5, phone: '414-555-0505', avatar: 'RW' },
  { id: 'drv6', name: 'Lisa Thompson', cdlNo: 'CDL-OH-2276', status: 'off_duty', hosRemaining: 0, phone: '216-555-0606', avatar: 'LT' },
]

const assets: Asset[] = [
  { id: 'ast1', unitNo: 'T-1842', type: 'tractor', make: 'Freightliner', model: 'Cascadia', status: 'assigned', location: { lat: 41.8868, lon: -87.6564 }, odometer: 145230 },
  { id: 'ast2', unitNo: 'T-1895', type: 'tractor', make: 'Volvo', model: 'VNL 760', status: 'assigned', location: { lat: 42.3681, lon: -83.0758 }, odometer: 98450 },
  { id: 'ast3', unitNo: 'T-2003', type: 'tractor', make: 'Kenworth', model: 'T680', status: 'available', location: { lat: 39.7742, lon: -86.2384 }, odometer: 67890 },
  { id: 'ast4', unitNo: 'T-2156', type: 'tractor', make: 'Peterbilt', model: '579', status: 'assigned', location: { lat: 39.9848, lon: -82.9853 }, odometer: 112340 },
  { id: 'ast5', unitNo: 'T-2298', type: 'tractor', make: 'Freightliner', model: 'Cascadia', status: 'available', location: { lat: 43.0642, lon: -87.9673 }, odometer: 54120 },
]

const trailers: Trailer[] = [
  { id: 'trl1', trailerNo: 'TR-5432', type: 'dry', status: 'assigned' },
  { id: 'trl2', trailerNo: 'TR-5489', type: 'reefer', status: 'assigned' },
  { id: 'trl3', trailerNo: 'TR-5501', type: 'dry', status: 'available' },
  { id: 'trl4', trailerNo: 'TR-5623', type: 'flatbed', status: 'assigned' },
  { id: 'trl5', trailerNo: 'TR-5778', type: 'reefer', status: 'available' },
]

function generateTrips(): Trip[] {
  const now = new Date()
  
  return [
    {
      id: 'trip001',
      orderRef: 'ORD-2024-0482',
      status: 'in_transit',
      driver: drivers[0],
      asset: assets[0],
      trailer: trailers[0],
      stops: [
        {
          id: 'stp1',
          seq: 1,
          location: locations[0],
          type: 'PU',
          appointmentStart: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          actualArrival: new Date(now.getTime() - 3.5 * 60 * 60 * 1000).toISOString(),
          actualDeparture: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
        },
        {
          id: 'stp2',
          seq: 2,
          location: locations[1],
          type: 'DO',
          appointmentStart: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      ],
      currentLocation: { lat: 42.1, lon: -86.3 },
      eta: new Date(now.getTime() + 1.2 * 60 * 60 * 1000).toISOString(),
      onTimeRisk: 'low',
      milesPlanned: 283,
      milesCompleted: 185,
      customer: 'Midwest Manufacturing Co.',
      commodity: 'Industrial Equipment',
      exceptions: [],
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'trip002',
      orderRef: 'ORD-2024-0495',
      status: 'at_pickup',
      driver: drivers[1],
      asset: assets[1],
      trailer: trailers[1],
      stops: [
        {
          id: 'stp3',
          seq: 1,
          location: locations[4],
          type: 'PU',
          appointmentStart: new Date(now.getTime() - 0.5 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 0.5 * 60 * 60 * 1000).toISOString(),
          actualArrival: new Date(now.getTime() - 0.3 * 60 * 60 * 1000).toISOString(),
          status: 'arrived',
        },
        {
          id: 'stp4',
          seq: 2,
          location: locations[5],
          type: 'DO',
          appointmentStart: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      ],
      currentLocation: { lat: 43.0642, lon: -87.9673 },
      eta: new Date(now.getTime() + 4.5 * 60 * 60 * 1000).toISOString(),
      onTimeRisk: 'medium',
      milesPlanned: 412,
      milesCompleted: 0,
      customer: 'Fresh Foods Distribution',
      commodity: 'Refrigerated Goods',
      exceptions: [
        {
          id: 'exc1',
          tripId: 'trip002',
          type: 'dwell_long',
          severity: 'medium',
          description: 'Extended dwell time at pickup location - loading delay',
          reportedAt: new Date(now.getTime() - 0.2 * 60 * 60 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'trip003',
      orderRef: 'ORD-2024-0501',
      status: 'in_transit',
      driver: drivers[3],
      asset: assets[3],
      trailer: trailers[3],
      stops: [
        {
          id: 'stp5',
          seq: 1,
          location: locations[2],
          type: 'PU',
          appointmentStart: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
          actualArrival: new Date(now.getTime() - 5.5 * 60 * 60 * 1000).toISOString(),
          actualDeparture: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
        },
        {
          id: 'stp6',
          seq: 2,
          location: locations[3],
          type: 'DO',
          appointmentStart: new Date(now.getTime() - 0.5 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 0.5 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      ],
      currentLocation: { lat: 39.88, lon: -85.12 },
      eta: new Date(now.getTime() + 0.8 * 60 * 60 * 1000).toISOString(),
      onTimeRisk: 'high',
      milesPlanned: 176,
      milesCompleted: 142,
      customer: 'BuildRight Construction',
      commodity: 'Steel Beams',
      exceptions: [
        {
          id: 'exc2',
          tripId: 'trip003',
          type: 'delay',
          severity: 'high',
          description: 'Traffic delay on I-70 due to construction',
          reportedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'trip004',
      orderRef: 'ORD-2024-0489',
      status: 'dispatched',
      driver: undefined,
      asset: undefined,
      trailer: undefined,
      stops: [
        {
          id: 'stp7',
          seq: 1,
          location: locations[0],
          type: 'PU',
          appointmentStart: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        {
          id: 'stp8',
          seq: 2,
          location: locations[2],
          type: 'DO',
          appointmentStart: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
          appointmentEnd: new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      ],
      currentLocation: locations[0],
      eta: new Date(now.getTime() + 6.5 * 60 * 60 * 1000).toISOString(),
      onTimeRisk: 'low',
      milesPlanned: 185,
      milesCompleted: 0,
      customer: 'Global Retail Corp',
      commodity: 'Consumer Electronics',
      exceptions: [],
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

export function getMockTrips(): Trip[] {
  return generateTrips()
}

export function getMockDrivers(): Driver[] {
  return drivers
}

export function getMockAssets(): Asset[] {
  return assets
}

export function getMockTrailers(): Trailer[] {
  return trailers
}

export function getMockKPIs(): KPIMetrics {
  return {
    onTimeDeliveryRate: 94.2,
    avgDwellTime: 68,
    trailerUtilization: 87.5,
    emptyMilesPercent: 12.3,
    activeTrips: 4,
    availableDrivers: 2,
    availableAssets: 2,
  }
}

export { locations }
