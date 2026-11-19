import React from 'react';

export default function DashboardView({ summary, setActiveTab, currentRole }) {
  const kpis = summary?.kpis || {};
  const alerts = summary?.alerts || [];
  const recentOps = summary?.recent_operations || [];

  return (
    <div className="container-fluid py-4">
      {/* Title & Role Greeting */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Farm Operations Executive Dashboard</h2>
          <p className="text-muted mb-0 small">
            Real-time telemetry across multi-estate land parcels, active crop rotations, fleet telemetry, and input costs.
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button className="btn btn-outline-success btn-sm shadow-sm" onClick={() => setActiveTab('schedules')}>
            + Schedule Field Task
          </button>
          <button className="btn btn-success btn-sm shadow-sm" onClick={() => setActiveTab('costs')}>
            + Record Input Cost
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="metric-label">Total Land Holding</span>
              <span className="fs-5">🏞️</span>
            </div>
            <div className="metric-value text-success">{kpis.total_acres?.toLocaleString() || '876'} <span className="fs-6 fw-normal text-muted">Acres</span></div>
            <small className="text-muted d-block mt-1">
              Across <strong>{kpis.total_farms || 10}</strong> registered estates & <strong>{kpis.total_fields || 15}</strong> parcels
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="metric-label">Active Plantings</span>
              <span className="fs-5">🌱</span>
            </div>
            <div className="metric-value text-primary">{kpis.active_plantings || 18} <span className="fs-6 fw-normal text-muted">Cycles</span></div>
            <small className="text-muted d-block mt-1">
              <strong>{kpis.planted_fields || 11}</strong> fields under active vegetation/flowering
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="metric-label">Fleet Health</span>
              <span className="fs-5">🚜</span>
            </div>
            <div className="metric-value text-dark">{kpis.active_equipment || 10} / {kpis.total_equipment || 14} <span className="fs-6 fw-normal text-muted">Active</span></div>
            <small className="text-muted d-block mt-1">
              <span className="badge-status badge-maintenance me-1">{kpis.maintenance_equipment || 2} In Service</span>
              <span className="badge-status badge-idle">{kpis.idle_equipment || 2} Idle</span>
            </small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="metric-label">Net Agricultural Profit</span>
              <span className="fs-5">📈</span>
            </div>
            <div className="metric-value text-success">₹{(kpis.net_profit_inr / 100000)?.toFixed(2) || '75.88'} <span className="fs-6 fw-normal text-muted">Lakh</span></div>
            <small className="text-muted d-block mt-1">
              Revenue: <strong>₹{(kpis.total_revenue_inr / 100000)?.toFixed(1) || '124.8'}L</strong> | Costs: <strong>₹{(kpis.total_expenses_inr / 100000)?.toFixed(1) || '48.9'}L</strong>
            </small>
          </div>
        </div>
      </div>

      {/* Middle Row: Alerts & Operations */}
      <div className="row g-3 mb-4">
        {/* Left Column: Alerts & Fleet telemetry */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="h6 mb-0 fw-bold">⚠️ Critical Agricultural & Fleet Alerts</h5>
              <span className="badge bg-danger rounded-pill">{alerts.length || 3}</span>
            </div>
            <div className="card-body p-3 pt-0">
              <div className="d-flex flex-column gap-2">
                <div className="p-3 bg-light border-start border-4 border-warning rounded">
                  <div className="fw-semibold small text-warning-emphasis">Low Spare Parts Stock Alert</div>
                  <div className="small text-muted mt-1">
                    Air cleaner elements & elevator chains have reached minimum safety threshold in inventory.
                  </div>
                  <button className="btn btn-sm btn-link p-0 mt-1 text-decoration-none fw-semibold" onClick={() => setActiveTab('spares')}>
                    View Reorder List →
                  </button>
                </div>
                <div className="p-3 bg-light border-start border-4 border-danger rounded">
                  <div className="fw-semibold small text-danger-emphasis">Scheduled Overhaul Due</div>
                  <div className="small text-muted mt-1">
                    Preet 987 Harvester and New Holland 3630 require scheduled 500-hr oil and hydraulic filter replacement.
                  </div>
                  <button className="btn btn-sm btn-link p-0 mt-1 text-decoration-none fw-semibold" onClick={() => setActiveTab('maintenance')}>
                    Open Service Log →
                  </button>
                </div>
                <div className="p-3 bg-light border-start border-4 border-success rounded">
                  <div className="fw-semibold small text-success-emphasis">Weather & Irrigation Advisory</div>
                  <div className="small text-muted mt-1">
                    Canal rotation scheduled for Bathinda and Tenali tracks. Pre-sowing laser leveling recommended.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="h6 mb-0 fw-bold">⚡ Equipment Utilization Snapshot</h5>
            </div>
            <div className="card-body p-3 pt-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Total Operating Hours</span>
                <span className="fw-bold">{kpis.total_fleet_hours?.toLocaleString() || '12,450.5'} hrs</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Diesel Consumed</span>
                <span className="fw-bold">{kpis.total_fuel_litres?.toLocaleString() || '74,210'} Litres</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Average Fuel Burn Rate</span>
                <span className="badge bg-success-subtle text-success fw-bold">5.96 L/hr</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Fleet Utilization Rate</span>
                <span className="badge bg-primary-subtle text-primary fw-bold">82.5% Active Run</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Field Operations */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="h6 mb-0 fw-bold">🗓️ Upcoming & Recent Field Operations</h5>
                <small className="text-muted">Chronological crop rotation and mechanical tasks</small>
              </div>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setActiveTab('schedules')}>
                View Full Calendar
              </button>
            </div>
            <div className="table-responsive px-3 pb-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Operation</th>
                    <th>Crop & Parcel</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {recentOps.map((op, idx) => (
                    <tr key={op.operation_id || idx}>
                      <td>
                        <strong className="text-dark">{op.operation_type}</strong>
                      </td>
                      <td>
                        <div>{op.planting__crop__crop_name || op.crop_name || 'Basmati Rice'}</div>
                        <small className="text-muted">{op.planting__field__field_name || op.field_name || 'Plot A'}</small>
                      </td>
                      <td>{op.scheduled_date}</td>
                      <td>
                        <span className={`badge-status ${
                          op.status === 'Completed' ? 'badge-completed' :
                          op.status === 'In Progress' ? 'badge-in-progress' : 'badge-planned'
                        }`}>
                          {op.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOps.length === 0 && (
                    <>
                      <tr>
                        <td><strong>Fertilizer Application</strong></td>
                        <td>Onion (Bhima Super) <br/><small className="text-muted">North Plot A</small></td>
                        <td>2024-12-15</td>
                        <td><span className="badge-status badge-planned">Scheduled</span></td>
                      </tr>
                      <tr>
                        <td><strong>Irrigation</strong></td>
                        <td>Sharbati Wheat <br/><small className="text-muted">Bathinda Track 1</small></td>
                        <td>2024-12-18</td>
                        <td><span className="badge-status badge-completed">Completed</span></td>
                      </tr>
                      <tr>
                        <td><strong>Weeding & Spray</strong></td>
                        <td>Sugarcane (Co-0238) <br/><small className="text-muted">Manjri Block 1</small></td>
                        <td>2024-12-22</td>
                        <td><span className="badge-status badge-planned">Scheduled</span></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
