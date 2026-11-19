import React, { useState } from 'react';

export default function UtilizationOptimizationView({ analytics }) {
  const data = analytics || {
    fleet_utilization_rate_pct: 82.5,
    avg_fuel_consumption_litres_per_hr: 5.96,
    total_operating_hours: 12450.5,
    total_idle_hours: 1820.0
  };

  const machines = [
    { name: 'John Deere 5310 PowerTech', hours: 1420, idle: 160, fuel: 8520, acres: 1150, eff: 6.0 },
    { name: 'Mahindra Arjun Novo 605 DI', hours: 780.5, idle: 95, fuel: 4680, acres: 640, eff: 5.9 },
    { name: 'Preet 987 Combine Harvester', hours: 680, idle: 110, fuel: 5780, acres: 890, eff: 8.5 },
    { name: 'Sonalika Tiger DI 75 4WD', hours: 620, idle: 75, fuel: 3720, acres: 510, eff: 6.0 },
    { name: 'ASPEE Tractor Boom Sprayer', hours: 310, idle: 45, fuel: 1550, acres: 480, eff: 5.0 },
    { name: 'Shaktiman Smart Rotavator', hours: 240, idle: 30, fuel: 1440, acres: 380, eff: 6.0 },
  ];

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 7: Utilization Analysis & Optimization</h2>
          <p className="text-muted small mb-0">
            Engine run-time telematics, diesel consumption efficiency, idle cycle mitigation, and productivity indexing.
          </p>
        </div>
        <span className="badge bg-success-subtle text-success p-2">
          Fleet Health: <strong>Optimized</strong>
        </span>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">FLEET UTILIZATION RATE</span>
            <h4 className="fw-bold mb-0 text-success">{data.fleet_utilization_rate_pct}%</h4>
            <small className="text-muted">Target benchmark: &gt; 80%</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">ACTIVE RUN HOURS</span>
            <h4 className="fw-bold mb-0 text-primary">{data.total_operating_hours?.toLocaleString()} hrs</h4>
            <small className="text-muted">Productive implement work</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">AVERAGE FUEL BURN</span>
            <h4 className="fw-bold mb-0 text-dark">{data.avg_fuel_consumption_litres_per_hr} L/hr</h4>
            <small className="text-muted">High-speed diesel rate</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">IDLE TIME PERCENTAGE</span>
            <h4 className="fw-bold mb-0 text-warning-emphasis">12.7% Idle</h4>
            <small className="text-muted">Opportunity for fuel reduction</small>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations Banner */}
      <div className="card border-0 bg-success-subtle p-3 rounded-3 mb-4">
        <div className="d-flex align-items-start gap-3">
          <span className="fs-3">💡</span>
          <div>
            <h5 className="h6 fw-bold text-success-emphasis mb-1">Algorithmic Fleet Optimization Recommendations</h5>
            <ul className="small text-success-emphasis mb-0 ps-3">
              <li><strong>Pre-Harvest Combines Grouping:</strong> Co-locating the Preet Harvester between Bathinda Canal tracks eliminates 45 km of road transit, saving ~120L diesel.</li>
              <li><strong>Idle Run Reduction:</strong> Idle time during paddy haulage waiting exceeds 1.2 hrs/shift. Introducing hydraulic bulk tippers will decrease engine idling by 35%.</li>
              <li><strong>Implement Matching:</strong> Pairing the Sonalika 75HP with the 3-Furrow Lemken reversible plough has improved land prep speed to 1.8 acres/hr.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Machinery Efficiency Telemetry Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="h6 mb-0 fw-bold">Machinery Asset Efficiency & Work Coverage Ranking</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Machinery Asset</th>
                <th>Operating Hours</th>
                <th>Idle Hours</th>
                <th>Work Area (Acres)</th>
                <th>Fuel Burn (Litres)</th>
                <th>Efficiency (L/hr)</th>
                <th>Run Ratio</th>
              </tr>
            </thead>
            <tbody className="small">
              {machines.map((m, idx) => {
                const total = m.hours + m.idle;
                const activePct = Math.round((m.hours / total) * 100);

                return (
                  <tr key={idx}>
                    <td><strong className="text-dark">{m.name}</strong></td>
                    <td className="fw-bold text-primary">{m.hours} hrs</td>
                    <td className="text-muted">{m.idle} hrs</td>
                    <td>{m.acres} Acres</td>
                    <td>{m.fuel} L</td>
                    <td><span className="badge bg-light text-dark border">{m.eff} L/hr</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '70px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${activePct}%` }}></div>
                        </div>
                        <span className="fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>{activePct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
