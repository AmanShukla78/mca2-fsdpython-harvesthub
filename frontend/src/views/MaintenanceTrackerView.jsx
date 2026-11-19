import React, { useState } from 'react';

export default function MaintenanceTrackerView({ maintenance: initialMaintenance, equipment }) {
  const [maintenanceList, setMaintenanceList] = useState(initialMaintenance || []);
  const [filterType, setFilterType] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newLog, setNewLog] = useState({
    equipment_name: equipment?.[0]?.name || 'Mahindra Arjun Novo 605 DI',
    maintenance_type: 'Preventive Service',
    title: '',
    scheduled_date: '2024-11-20',
    meter_hours_at_service: '850',
    labor_cost_inr: '1500',
    parts_cost_inr: '4500',
    status: 'In Progress',
    technician_name: 'Authorized Service Tech'
  });

  const totalMaintenanceCost = maintenanceList.reduce((acc, m) => acc + (parseFloat(m.total_cost_inr) || 0), 0);
  const pendingCount = maintenanceList.filter((m) => m.status === 'In Progress' || m.status === 'Scheduled').length;

  const filteredLogs = filterType === 'ALL' ? maintenanceList : maintenanceList.filter((m) => m.maintenance_type === filterType);

  const handleAddLog = (e) => {
    e.preventDefault();
    const labor = parseFloat(newLog.labor_cost_inr) || 0;
    const parts = parseFloat(newLog.parts_cost_inr) || 0;

    const created = {
      maintenance_id: Date.now(),
      equipment_name: newLog.equipment_name,
      maintenance_type: newLog.maintenance_type,
      title: newLog.title,
      scheduled_date: newLog.scheduled_date,
      meter_hours_at_service: parseFloat(newLog.meter_hours_at_service) || 0,
      labor_cost_inr: labor,
      parts_cost_inr: parts,
      total_cost_inr: labor + parts,
      status: newLog.status,
      technician_name: newLog.technician_name
    };

    setMaintenanceList([created, ...maintenanceList]);
    setShowAddModal(false);
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 6: Maintenance Scheduling & Tracking</h2>
          <p className="text-muted small mb-0">
            Preventive service intervals, emergency breakdown logs, technician labor tracking, and spare parts replacement.
          </p>
        </div>
        <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowAddModal(true)}>
          + Log Maintenance Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL FLEET SERVICE JOBS</span>
            <h4 className="fw-bold mb-0 text-dark">{maintenanceList.length} Tickets</h4>
            <small className="text-muted">Recorded servicing events</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">ACTIVE WORKSHOP TICKETS</span>
            <h4 className="fw-bold mb-0 text-danger">{pendingCount} Pending</h4>
            <small className="text-muted">Currently undergoing service</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL MAINTENANCE OUTLAY</span>
            <h4 className="fw-bold mb-0 text-primary">₹{totalMaintenanceCost.toLocaleString()}</h4>
            <small className="text-muted">Labor and parts consolidated</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">FLEET UPTIME INTEGRITY</span>
            <h4 className="fw-bold mb-0 text-success">94.8% Operational</h4>
            <small className="text-muted">Target minimum: 90%</small>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap justify-content-between align-items-center">
          <h5 className="h6 mb-0 fw-bold">Service & Maintenance Job Log</h5>
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <label className="small text-muted mb-0">Type:</label>
            <select
              className="form-select form-select-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Service Types</option>
              <option value="Preventive Service">Preventive Service</option>
              <option value="Breakdown Repair">Breakdown Repair</option>
              <option value="Overhaul">Overhaul</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Service Date</th>
                <th>Machinery Asset</th>
                <th>Type</th>
                <th>Job Title / Scope</th>
                <th>Meter Hours</th>
                <th>Technician</th>
                <th>Total Cost (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredLogs.map((m) => (
                <tr key={m.maintenance_id}>
                  <td>{m.scheduled_date}</td>
                  <td><strong className="text-dark">{m.equipment_name}</strong></td>
                  <td>
                    <span className={`badge ${
                      m.maintenance_type === 'Preventive Service' ? 'bg-success-subtle text-success' :
                      m.maintenance_type === 'Breakdown Repair' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'
                    }`}>
                      {m.maintenance_type}
                    </span>
                  </td>
                  <td>{m.title}</td>
                  <td>{m.meter_hours_at_service} hrs</td>
                  <td>👤 {m.technician_name}</td>
                  <td className="fw-bold text-dark">₹{parseFloat(m.total_cost_inr)?.toLocaleString()}</td>
                  <td>
                    <span className={`badge-status ${
                      m.status === 'Completed' ? 'badge-completed' :
                      m.status === 'In Progress' ? 'badge-in-progress' : 'badge-planned'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Log Maintenance Service Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddLog}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Equipment Asset</label>
                    <select
                      className="form-select"
                      value={newLog.equipment_name}
                      onChange={(e) => setNewLog({ ...newLog, equipment_name: e.target.value })}
                    >
                      {equipment.map((eq) => (
                        <option key={eq.equipment_id} value={eq.name}>
                          {eq.name} ({eq.serial_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Service Type</label>
                      <select
                        className="form-select"
                        value={newLog.maintenance_type}
                        onChange={(e) => setNewLog({ ...newLog, maintenance_type: e.target.value })}
                      >
                        <option value="Preventive Service">Preventive Service</option>
                        <option value="Breakdown Repair">Breakdown Repair</option>
                        <option value="Overhaul">Overhaul</option>
                        <option value="Inspection">Inspection</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Scheduled Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newLog.scheduled_date}
                        onChange={(e) => setNewLog({ ...newLog, scheduled_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Job Title / Issue Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 500-Hour Routine Oil, Fuel and Air Filter Replacement"
                      value={newLog.title}
                      onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Meter Hours</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLog.meter_hours_at_service}
                        onChange={(e) => setNewLog({ ...newLog, meter_hours_at_service: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Labor Cost (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLog.labor_cost_inr}
                        onChange={(e) => setNewLog({ ...newLog, labor_cost_inr: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Parts Cost (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newLog.parts_cost_inr}
                        onChange={(e) => setNewLog({ ...newLog, parts_cost_inr: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mechanic / Service Technician</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newLog.technician_name}
                      onChange={(e) => setNewLog({ ...newLog, technician_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Save Service Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
