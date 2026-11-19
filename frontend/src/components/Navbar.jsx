import React from 'react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole, isLiveConnected }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'fields', label: '1. Field & Crop Mapping', icon: '🗺️' },
    { id: 'schedules', label: '2. Planting & Schedules', icon: '📅' },
    { id: 'costs', label: '3. Input & Costs', icon: '💰' },
    { id: 'yields', label: '4. Yield & Forecast', icon: '🌾' },
    { id: 'equipment', label: '5. Fleet Registry', icon: '🚜' },
    { id: 'maintenance', label: '6. Maintenance', icon: '🔧' },
    { id: 'utilization', label: '7. Fleet Utilization', icon: '⚡' },
    { id: 'spares', label: '8. Spare Parts', icon: '📦' },
  ];

  const roles = [
    { code: 'FARM_MANAGER', label: 'Farm Manager' },
    { code: 'FIELD_WORKER', label: 'Field Worker' },
    { code: 'ADMIN', label: 'System Admin' },
  ];

  return (
    <header className="brand-nav text-white sticky-top py-2 px-3 shadow-sm">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <span className="fs-3">🌾</span>
          <div>
            <h1 className="h5 mb-0 fw-bold tracking-tight">HarvestHub</h1>
            <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
              Comprehensive Farm Management & Crop Planning Platform
            </small>
          </div>
        </div>

        {/* Role & Connection Pill */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center bg-black bg-opacity-25 px-2 py-1 rounded-pill">
            <span className={`badge rounded-pill me-2 ${isLiveConnected ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.68rem' }}>
              {isLiveConnected ? '● Live Django API' : '● Standalone Active'}
            </span>
            <small className="text-white-50 me-2" style={{ fontSize: '0.75rem' }}>Role:</small>
            <select
              className="form-select form-select-sm bg-transparent text-white border-0 py-0 ps-1 pe-4 fw-semibold"
              style={{ fontSize: '0.8rem', cursor: 'pointer' }}
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.code} value={r.code} className="text-dark">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <span className="badge bg-light text-success fw-bold px-2 py-1">P08 | Agriculture</span>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="container-fluid mt-2 pt-2 border-top border-white border-opacity-10 overflow-x-auto">
        <ul className="nav nav-pills flex-nowrap gap-1 pb-1">
          {tabs.map((tab) => (
            <li key={tab.id} className="nav-item">
              <button
                className={`nav-link text-white text-nowrap py-1 px-3 ${activeTab === tab.id ? 'active-tab' : 'opacity-75'}`}
                style={{ fontSize: '0.825rem' }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="me-1">{tab.icon}</span> {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
