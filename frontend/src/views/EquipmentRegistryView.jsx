import React, { useState } from 'react';

export default function EquipmentRegistryView({ equipment: initialEquipment }) {
  const [equipmentList, setEquipmentList] = useState(initialEquipment || []);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAsset, setNewAsset] = useState({
    name: '',
    category_name: 'Tractors',
    make_and_model: '',
    serial_number: '',
    farm_name: 'Sahyadri Agro Estate',
    purchase_date: '2023-01-15',
    purchase_cost_inr: '',
    current_meter_hours: '0',
    status: 'Active'
  });

  const filteredAssets = equipmentList.filter((eq) => {
    const matchCat = filterCategory === 'ALL' || eq.category_name === filterCategory;
    const matchStatus = filterStatus === 'ALL' || eq.status === filterStatus;
    const matchSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        eq.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    const created = {
      equipment_id: Date.now(),
      name: newAsset.name,
      category_name: newAsset.category_name,
      make_and_model: newAsset.make_and_model,
      serial_number: newAsset.serial_number,
      farm_name: newAsset.farm_name,
      purchase_cost_inr: parseFloat(newAsset.purchase_cost_inr) || 0,
      current_meter_hours: parseFloat(newAsset.current_meter_hours) || 0,
      status: newAsset.status,
      last_serviced_date: 'New Asset'
    };

    setEquipmentList([created, ...equipmentList]);
    setShowAddModal(false);
  };

  const handleToggleStatus = (id, newStatus) => {
    setEquipmentList(equipmentList.map((eq) => eq.equipment_id === id ? { ...eq, status: newStatus } : eq));
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 5: Equipment Registry & Fleet Inventory</h2>
          <p className="text-muted small mb-0">
            Tractors, self-propelled combine harvesters, precision implements, sprayers, and irrigation pumps registry.
          </p>
        </div>
        <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowAddModal(true)}>
          + Register Machinery Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by machine name or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Tractors">Tractors</option>
              <option value="Harvesters">Combine Harvesters</option>
              <option value="Sprayers">Sprayers & Crop Protection</option>
              <option value="Tillage Implements">Tillage Implements</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="Active">Active (Field Ready)</option>
              <option value="In Maintenance">In Maintenance / Workshop</option>
              <option value="Idle">Idle (Parked)</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
          <div className="col-12 col-md-2 text-md-end text-muted small">
            Showing <strong>{filteredAssets.length}</strong> of {equipmentList.length}
          </div>
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="row g-3">
        {filteredAssets.map((eq) => (
          <div key={eq.equipment_id} className="col-12 col-md-6 col-xl-4">
            <div className="card h-100 border-0 shadow-sm rounded-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="badge bg-secondary-subtle text-secondary mb-1" style={{ fontSize: '0.7rem' }}>
                      {eq.category_name}
                    </span>
                    <h5 className="card-title fw-bold h6 mb-0 text-dark">{eq.name}</h5>
                    <small className="text-muted">{eq.make_and_model}</small>
                  </div>
                  <span className={`badge-status ${
                    eq.status === 'Active' ? 'badge-active' :
                    eq.status === 'In Maintenance' ? 'badge-maintenance' :
                    eq.status === 'Idle' ? 'badge-idle' : 'badge-alert'
                  }`}>
                    {eq.status}
                  </span>
                </div>

                <div className="bg-light p-2 rounded small my-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Serial Number:</span>
                    <code className="text-dark fw-bold">{eq.serial_number}</code>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Meter Run Hours:</span>
                    <strong className="text-primary">{eq.current_meter_hours} hrs</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Asset Value:</span>
                    <strong className="text-dark">₹{parseFloat(eq.purchase_cost_inr)?.toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Last Service:</span>
                    <span className="text-muted">{eq.last_serviced_date || 'N/A'}</span>
                  </div>
                </div>

                {/* Status Toggle Action */}
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="small text-muted">Update Status:</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className={`btn btn-sm ${eq.status === 'Active' ? 'btn-success' : 'btn-outline-success'} py-0 px-2`}
                      onClick={() => handleToggleStatus(eq.equipment_id, 'Active')}
                    >
                      Active
                    </button>
                    <button
                      className={`btn btn-sm ${eq.status === 'In Maintenance' ? 'btn-danger' : 'btn-outline-danger'} py-0 px-2`}
                      onClick={() => handleToggleStatus(eq.equipment_id, 'In Maintenance')}
                    >
                      Service
                    </button>
                    <button
                      className={`btn btn-sm ${eq.status === 'Idle' ? 'btn-secondary' : 'btn-outline-secondary'} py-0 px-2`}
                      onClick={() => handleToggleStatus(eq.equipment_id, 'Idle')}
                    >
                      Idle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Register New Machinery Asset</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddAsset}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Equipment Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sonalika Tiger DI 75 4WD"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={newAsset.category_name}
                        onChange={(e) => setNewAsset({ ...newAsset, category_name: e.target.value })}
                      >
                        <option value="Tractors">Tractors</option>
                        <option value="Harvesters">Combine Harvesters</option>
                        <option value="Sprayers">Sprayers & Crop Protection</option>
                        <option value="Tillage Implements">Tillage Implements</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Make & Model</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sonalika 75HP"
                        value={newAsset.make_and_model}
                        onChange={(e) => setNewAsset({ ...newAsset, make_and_model: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Unique Serial Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. SNL-TIG-2024-1102"
                        value={newAsset.serial_number}
                        onChange={(e) => setNewAsset({ ...newAsset, serial_number: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Purchase Cost (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 1250000"
                        value={newAsset.purchase_cost_inr}
                        onChange={(e) => setNewAsset({ ...newAsset, purchase_cost_inr: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Save Asset
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
