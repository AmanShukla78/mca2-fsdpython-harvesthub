import React, { useState } from 'react';

export default function SchedulingView({ plantings: initialPlantings, operations: initialOperations, fields, crops }) {
  const [plantings, setPlantings] = useState(initialPlantings || []);
  const [operations, setOperations] = useState(initialOperations || []);
  const [activeTab, setActiveTab] = useState('plantings'); // 'plantings' | 'operations'
  const [showPlantingModal, setShowPlantingModal] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState(false);

  // Form states
  const [newPlanting, setNewPlanting] = useState({
    field: fields?.[0]?.field_id || 1,
    crop: crops?.[0]?.crop_id || 1,
    season: 'Rabi 2025-26',
    sowing_date: '2025-11-15',
    expected_harvest_date: '2026-03-25',
    target_yield_kg: '45000',
    current_stage: 'Land Preparation',
    status: 'Planned'
  });

  const [newOperation, setNewOperation] = useState({
    planting: plantings?.[0]?.planting_id || 1,
    operation_type: 'Ploughing',
    scheduled_date: '2025-11-20',
    assigned_to_name: 'Raju Yadav',
    equipment_name: 'Mahindra Arjun Novo 605 DI',
    status: 'Scheduled'
  });

  const stages = ['Land Preparation', 'Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvesting', 'Completed'];

  const getStageIndex = (stage) => stages.indexOf(stage);

  const handleAdvanceStage = (plantingId) => {
    setPlantings(plantings.map((p) => {
      if (p.planting_id === plantingId) {
        const currIdx = getStageIndex(p.current_stage);
        if (currIdx < stages.length - 1) {
          const nextStage = stages[currIdx + 1];
          return {
            ...p,
            current_stage: nextStage,
            status: nextStage === 'Completed' ? 'Harvested' : 'In Progress'
          };
        }
      }
      return p;
    }));
  };

  const handleAddPlanting = (e) => {
    e.preventDefault();
    const fieldObj = fields.find((f) => String(f.field_id) === String(newPlanting.field)) || fields[0];
    const cropObj = crops.find((c) => String(c.crop_id) === String(newPlanting.crop)) || crops[0];

    const created = {
      planting_id: Date.now(),
      field: newPlanting.field,
      field_name: fieldObj ? fieldObj.field_name : 'Field Plot',
      farm_name: fieldObj ? fieldObj.farm_name : 'Primary Farm',
      crop: newPlanting.crop,
      crop_name: cropObj ? cropObj.crop_name : 'Selected Crop',
      season: newPlanting.season,
      sowing_date: newPlanting.sowing_date,
      expected_harvest_date: newPlanting.expected_harvest_date,
      target_yield_kg: parseFloat(newPlanting.target_yield_kg),
      actual_yield_kg: null,
      current_stage: newPlanting.current_stage,
      status: newPlanting.status,
      total_costs: 0
    };

    setPlantings([created, ...plantings]);
    setShowPlantingModal(false);
  };

  const handleAddOperation = (e) => {
    e.preventDefault();
    const plantingObj = plantings.find((p) => String(p.planting_id) === String(newOperation.planting)) || plantings[0];

    const created = {
      operation_id: Date.now(),
      planting: newOperation.planting,
      crop_name: plantingObj ? plantingObj.crop_name : 'Crop',
      field_name: plantingObj ? plantingObj.field_name : 'Field',
      operation_type: newOperation.operation_type,
      scheduled_date: newOperation.scheduled_date,
      assigned_to_name: newOperation.assigned_to_name,
      equipment_name: newOperation.equipment_name,
      status: newOperation.status
    };

    setOperations([created, ...operations]);
    setShowOperationModal(false);
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 2: Planting & Harvesting Scheduling</h2>
          <p className="text-muted small mb-0">
            Multi-season crop rotation management, phenological stages tracking, and field operational execution.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm shadow-sm" onClick={() => setShowOperationModal(true)}>
            + Schedule Field Task
          </button>
          <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowPlantingModal(true)}>
            + Plan New Crop Rotation
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="border-bottom mb-4">
        <ul className="nav module-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'plantings' ? 'active' : ''}`}
              onClick={() => setActiveTab('plantings')}
            >
              🌱 Active Crop Rotations ({plantings.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'operations' ? 'active' : ''}`}
              onClick={() => setActiveTab('operations')}
            >
              🚜 Scheduled Field Tasks ({operations.length})
            </button>
          </li>
        </ul>
      </div>

      {/* View 1: Crop Rotations and Phenological Stages */}
      {activeTab === 'plantings' && (
        <div className="d-flex flex-column gap-3">
          {plantings.map((p) => {
            const stageIndex = getStageIndex(p.current_stage);
            const pct = Math.max(10, Math.round(((stageIndex + 1) / stages.length) * 100));

            return (
              <div key={p.planting_id} className="card border-0 shadow-sm rounded-3 p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="h6 fw-bold mb-0 text-dark">
                      {p.crop_name} <span className="badge bg-secondary-subtle text-secondary ms-2">{p.season}</span>
                    </h5>
                    <small className="text-muted">
                      Parcel: <strong>{p.field_name}</strong> ({p.farm_name})
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                    <span className={`badge-status ${
                      p.status === 'In Progress' ? 'badge-in-progress' :
                      p.status === 'Harvested' ? 'badge-completed' : 'badge-planned'
                    }`}>
                      {p.status}
                    </span>
                    {p.status !== 'Harvested' && (
                      <button
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleAdvanceStage(p.planting_id)}
                      >
                        Advance Stage →
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Stage Indicator */}
                <div className="my-2">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Stage: <strong className="text-success">{p.current_stage}</strong></span>
                    <span>Progress: <strong>{pct}%</strong></span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${p.current_stage === 'Completed' ? 'bg-success' : 'bg-primary'}`}
                      role="progressbar"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2 pt-1 small text-muted overflow-x-auto">
                    {stages.map((st, i) => (
                      <span
                        key={st}
                        className={`text-nowrap px-1 ${
                          i < stageIndex ? 'text-success fw-semibold' :
                          i === stageIndex ? 'text-primary fw-bold' : 'text-muted opacity-50'
                        }`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {i <= stageIndex ? '✓ ' : '○ '}{st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dates & Target Metrics */}
                <div className="row g-2 mt-2 pt-2 border-top small text-muted">
                  <div className="col-6 col-md-3">
                    <span>Sowing Date:</span> <strong className="text-dark d-block">{p.sowing_date}</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span>Expected Harvest:</span> <strong className="text-dark d-block">{p.expected_harvest_date}</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span>Target Yield:</span> <strong className="text-success d-block">{p.target_yield_kg?.toLocaleString()} kg</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <span>Tracked Expenses:</span> <strong className="text-danger d-block">₹{p.total_costs?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Field Operations List */}
      {activeTab === 'operations' && (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th>Task Operation</th>
                  <th>Crop & Field Parcel</th>
                  <th>Scheduled Date</th>
                  <th>Assigned Worker</th>
                  <th>Machinery Allocated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {operations.map((op) => (
                  <tr key={op.operation_id}>
                    <td>
                      <strong className="text-dark">{op.operation_type}</strong>
                    </td>
                    <td>
                      <div>{op.crop_name}</div>
                      <small className="text-muted">{op.field_name}</small>
                    </td>
                    <td>{op.scheduled_date}</td>
                    <td>
                      👤 {op.assigned_to_name || 'Unassigned'}
                    </td>
                    <td>
                      {op.equipment_name ? (
                        <span className="badge bg-light text-dark border">🚜 {op.equipment_name}</span>
                      ) : (
                        <span className="text-muted small">Manual Labor</span>
                      )}
                    </td>
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
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Crop Rotation Modal */}
      {showPlantingModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Plan New Crop Rotation Cycle</h5>
                <button type="button" className="btn-close" onClick={() => setShowPlantingModal(false)}></button>
              </div>
              <form onSubmit={handleAddPlanting}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Field Parcel</label>
                    <select
                      className="form-select"
                      value={newPlanting.field}
                      onChange={(e) => setNewPlanting({ ...newPlanting, field: e.target.value })}
                    >
                      {fields.map((f) => (
                        <option key={f.field_id} value={f.field_id}>
                          {f.field_name} ({f.area_acres} Acres - {f.soil_type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Crop Selection</label>
                    <select
                      className="form-select"
                      value={newPlanting.crop}
                      onChange={(e) => setNewPlanting({ ...newPlanting, crop: e.target.value })}
                    >
                      {crops.map((c) => (
                        <option key={c.crop_id} value={c.crop_id}>
                          {c.crop_name} ({c.crop_category} - {c.standard_growth_days} Days)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Season Cycle Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPlanting.season}
                      onChange={(e) => setNewPlanting({ ...newPlanting, season: e.target.value })}
                      placeholder="e.g. Rabi 2025-26"
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Sowing Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newPlanting.sowing_date}
                        onChange={(e) => setNewPlanting({ ...newPlanting, sowing_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Expected Harvest</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newPlanting.expected_harvest_date}
                        onChange={(e) => setNewPlanting({ ...newPlanting, expected_harvest_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Yield (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newPlanting.target_yield_kg}
                      onChange={(e) => setNewPlanting({ ...newPlanting, target_yield_kg: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPlantingModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Schedule Rotation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Operation Modal */}
      {showOperationModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Schedule Field Operation</h5>
                <button type="button" className="btn-close" onClick={() => setShowOperationModal(false)}></button>
              </div>
              <form onSubmit={handleAddOperation}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Crop Planting Target</label>
                    <select
                      className="form-select"
                      value={newOperation.planting}
                      onChange={(e) => setNewOperation({ ...newOperation, planting: e.target.value })}
                    >
                      {plantings.map((p) => (
                        <option key={p.planting_id} value={p.planting_id}>
                          {p.crop_name} @ {p.field_name} ({p.season})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Operation Type</label>
                    <select
                      className="form-select"
                      value={newOperation.operation_type}
                      onChange={(e) => setNewOperation({ ...newOperation, operation_type: e.target.value })}
                    >
                      <option value="Ploughing">Ploughing</option>
                      <option value="Harrowing">Harrowing</option>
                      <option value="Sowing">Sowing</option>
                      <option value="Fertilizer Application">Fertilizer Application</option>
                      <option value="Pesticide Spray">Pesticide Spray</option>
                      <option value="Weeding">Weeding</option>
                      <option value="Irrigation">Irrigation</option>
                      <option value="Harvesting">Harvesting</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Scheduled Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newOperation.scheduled_date}
                      onChange={(e) => setNewOperation({ ...newOperation, scheduled_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Assign Worker</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newOperation.assigned_to_name}
                      onChange={(e) => setNewOperation({ ...newOperation, assigned_to_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowOperationModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Assign Task
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
