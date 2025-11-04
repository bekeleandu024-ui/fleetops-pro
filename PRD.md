# Planning Guide

A real-time logistics & fleet management dispatch console that enables dispatchers to monitor active trips, track fleet positions, manage driver assignments, and respond to delivery exceptions with live ETA updates.

**Experience Qualities**:
1. **Professional** - Clean, data-dense interface that prioritizes information hierarchy and quick decision-making for operations teams
2. **Responsive** - Real-time updates and immediate visual feedback that reflects the dynamic nature of fleet operations
3. **Trustworthy** - Precise data presentation with clear status indicators that build confidence in mission-critical dispatch decisions

**Complexity Level**: Light Application (multiple features with basic state)
- Demonstrates core dispatch workflows including trip monitoring, fleet tracking, and exception management without requiring complex backend infrastructure, leveraging client-side state management to simulate real-time logistics operations

## Essential Features

### Live Trip Dashboard
- **Functionality**: Display active trips with real-time status, progress tracking, ETA predictions, and on-time risk indicators
- **Purpose**: Provides dispatchers with immediate visibility into all in-transit deliveries and enables proactive exception management
- **Trigger**: User opens application or switches to dashboard view
- **Progression**: Load trips data → Display trip cards with status indicators → Auto-refresh positions and ETAs → Highlight at-risk deliveries → Enable drill-down to trip details
- **Success criteria**: All active trips visible at a glance with color-coded status, ETA accuracy within simulated variance, risk alerts clearly visible

### Fleet Map View
- **Functionality**: Interactive map showing real-time positions of all assets (trucks/trailers) with route visualization and geofence zones
- **Purpose**: Spatial awareness of fleet distribution, route adherence monitoring, and geographical dispatch optimization
- **Trigger**: User clicks map tab or selects trip to view route
- **Progression**: Render map with asset markers → Plot delivery routes and stops → Show geofences for pickup/delivery locations → Update positions on telemetry refresh → Display asset details on marker click
- **Success criteria**: Map renders smoothly with all assets, routes are clearly visible, marker clustering works at zoom levels, click interactions are responsive

### Driver & Asset Assignment
- **Functionality**: Assign or reassign drivers and equipment to trips with rule validation (HOS compliance, equipment type, qualifications)
- **Purpose**: Optimize resource utilization while ensuring regulatory compliance and equipment compatibility
- **Trigger**: Dispatcher clicks assign/reassign button on trip card or new trip creation
- **Progression**: Open assignment dialog → Display available drivers filtered by constraints → Show asset/trailer availability → Validate selection against rules → Confirm assignment → Update trip status
- **Success criteria**: Only eligible drivers shown, constraint violations blocked with clear messages, assignments persist and update trip view

### Exception Management
- **Functionality**: Log and track delivery exceptions (delays, route deviations, equipment issues, customer problems) with resolution workflows
- **Purpose**: Document operational issues, trigger customer notifications, and maintain service quality metrics
- **Trigger**: Dispatcher clicks report exception on trip or system auto-detects anomaly (geofence violation, dwell time excess)
- **Progression**: Detect/report exception → Categorize by type → Add notes and resolution actions → Update ETA if needed → Notify stakeholders → Track to resolution
- **Success criteria**: Exceptions clearly marked on trips, filterable by type and severity, resolution status tracked, historical log maintained

### Analytics Dashboard
- **Functionality**: Key performance indicators including on-time delivery rate, average dwell time, trailer utilization, empty miles percentage
- **Purpose**: Data-driven decision making and performance monitoring against operational targets
- **Trigger**: User navigates to analytics view
- **Progression**: Load historical trip data → Calculate KPIs → Render charts and metrics → Enable time range filtering → Show trends and comparisons
- **Success criteria**: KPIs calculate correctly from trip data, charts are readable and interactive, target thresholds clearly indicated

## Edge Case Handling

- **No Active Trips** - Display empty state with suggestion to create sample trips or view historical data
- **GPS Signal Loss** - Show last known position with timestamp, indicate stale data with visual cue, resume updates when signal returns
- **Constraint Violations** - Block invalid assignments with specific error messages, suggest alternative drivers/assets when available
- **Concurrent Updates** - Handle optimistic UI updates, show conflict warnings if data changed by another user, allow refresh to reconcile
- **Invalid Data Entry** - Validate forms in real-time, prevent submission of incomplete/invalid data, preserve partial progress

## Design Direction

The design should evoke confidence and efficiency with a serious, professional aesthetic that prioritizes information density over decoration, using a minimal interface where every element serves operational decision-making in high-stakes logistics environments.

## Color Selection

Complementary (opposite colors) - Deep blue for primary actions and trust signals complemented by warm amber for alerts and attention, creating clear visual separation between stable operations and items requiring intervention.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Conveys reliability, authority, and calm focus appropriate for mission-critical operations
- **Secondary Colors**: Neutral Gray (oklch(0.96 0 0)) for backgrounds, Medium Gray (oklch(0.60 0 0)) for supporting elements and deemphasized content
- **Accent Color**: Warm Amber (oklch(0.70 0.15 60)) - Attention-grabbing highlight for alerts, exceptions, and risk indicators that demand immediate dispatcher attention
- **Foreground/Background Pairings**:
  - Background White (oklch(1 0 0)): Dark Gray text (oklch(0.20 0 0)) - Ratio 14.1:1 ✓
  - Card Light Gray (oklch(0.98 0 0)): Dark Gray text (oklch(0.20 0 0)) - Ratio 13.2:1 ✓
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Secondary Gray (oklch(0.96 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 10.5:1 ✓
  - Accent Amber (oklch(0.70 0.15 60)): Dark text (oklch(0.15 0 0)) - Ratio 9.2:1 ✓
  - Muted Gray (oklch(0.94 0 0)): Medium Gray text (oklch(0.45 0 0)) - Ratio 5.1:1 ✓

## Font Selection

Clean, highly legible sans-serif typography that maintains readability in data-dense displays and supports quick scanning of critical operational information across varying screen sizes and lighting conditions.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing - Main dashboard headings
  - H2 (Section Headers): Inter Semibold/24px/normal spacing - Tab titles and major sections  
  - H3 (Card Titles): Inter Medium/18px/normal spacing - Trip IDs and asset identifiers
  - H4 (Labels): Inter Medium/14px/wide spacing/uppercase - Status labels and categories
  - Body (Data): Inter Regular/15px/relaxed line height - Primary content and descriptions
  - Small (Metadata): Inter Regular/13px/tight spacing - Timestamps, secondary info
  - Mono (IDs): JetBrains Mono/14px - Order numbers, VINs, tracking codes

## Animations

Subtle, purposeful animations that communicate state transitions and guide attention to data updates without creating visual noise in an already information-rich operational environment.

- **Purposeful Meaning**: Motion reinforces the real-time nature of logistics operations - pulsing indicators for active trips, smooth position transitions on maps, and gentle highlights for new exceptions create a living dashboard that feels connected to actual fleet movement
- **Hierarchy of Movement**: Reserve animation for critical updates (new exceptions, ETA changes, status transitions) while keeping static data calm - map markers animate on position updates, trip cards pulse when approaching delivery windows, alert badges bounce once on appearance

## Component Selection

- **Components**:
  - Card with hover states for trip summaries showing status, ETA, progress
  - Tabs for switching between Dashboard, Map, Fleet, Analytics views
  - Badge for status indicators (on-time, at-risk, delayed, completed) with semantic colors
  - Dialog for assignment workflows and exception reporting forms
  - Table for driver/asset listings with sortable columns and row actions
  - Select and Combobox for filtering trips by status, driver, customer
  - Progress indicators for trip completion percentage
  - Tooltip for displaying full details on hover (asset specs, driver qualifications)
  - Alert for system notifications and constraint violation warnings
  - Separator for visual grouping in dense layouts
  - Avatar for driver profile pictures in assignments
  - ScrollArea for long lists without breaking layout

- **Customizations**:
  - Custom map component using canvas or SVG for fleet positions and routes
  - Trip timeline visualization showing pickup, transit, and delivery phases
  - Gauge charts for KPI metrics with target threshold indicators
  - Real-time clock component showing current time in fleet timezone

- **States**:
  - Buttons: Default blue, hover darker with subtle lift, active pressed state, disabled muted gray
  - Trip cards: Default white, hover slight elevation, selected blue border, at-risk amber accent
  - Status badges: Solid color fill with white text, subtle pulse animation for in-transit
  - Form inputs: Gray border default, blue focus ring, red border for validation errors

- **Icon Selection**:
  - Truck (asset/fleet), MapPin (location), Clock (ETA), WarningCircle (exceptions)
  - CheckCircle (completed), XCircle (failed), ArrowsClockwise (in-transit)
  - User (driver), Package (cargo), GasPump (fuel), Wrench (maintenance)
  - ChartBar (analytics), ListBullets (trips), MapTrifold (map view)

- **Spacing**:
  - Card padding: p-6 for breathing room around content
  - Section gaps: gap-8 between major sections, gap-4 within related groups
  - Grid layouts: gap-6 for trip cards, gap-4 for data rows
  - Margins: mb-8 for page sections, mb-4 for subsections, mb-2 for tight groupings

- **Mobile**:
  - Stack tabs vertically, collapse to dropdown on small screens
  - Trip cards full-width single column below 768px
  - Map view becomes full-screen modal on mobile with fixed action bar
  - Table converts to stacked card layout with key fields visible
  - Bottom navigation bar for primary views on mobile devices
  - Reduce padding to p-4 on cards, increase tap targets to 44px minimum
