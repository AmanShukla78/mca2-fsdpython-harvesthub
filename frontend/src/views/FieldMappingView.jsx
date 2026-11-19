import React, { useState } from 'react';

export default function FieldMappingView({ fields: initialFields, farms }) {
  const [fields, setFields] = useState(initialFields || []);
  const [filterSoil, setFilterSoil] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newField, setNewField] = useState({
    field_name: '',
    farm: farms?.[0]?.farm_id || 1,
    area_acres: '',
    soil_type: 'Black Cotton',
    irrigation_source: 'Drip Irrigation',
    status: 'Active'
  });

  const filteredFields = fields.filter((f) => {
    const matchSoil = filterSoil === 'ALL' || f.soil_type === filterSoil;
    const matchStatus = filterStatus === 'ALL' || f.status === filterStatus;
    const matchSearch = f.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (f.farm_name && f.farm_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSoil && matchStatus && matchSearch;
  });

  const handleAddField = (e) => {
    e.preventDefault();
    if (!newField.field_name || !newField.area_acres) return;

    const farmObj = farms.find((farm) => String(farm.farm_id) === String(newField.farm)) || farms[0];
    const created = {
      field_id: Date.now(),
      farm: newField.farm,
      farm_name: farmObj ? farmObj.farm_name : 'Primary Farm',
      field_name: newField.field_name,
      area_acres: parseFloat(newField.area_acres),
      soil_type: newField.soil_type,
      irrigation_source: newField.irrigation_source,
      status: newField.status,
      active_crop: null,
      boundary_geojson: { type: "Polygon", coordinates: [[[73.98, 20.17], [73.99, 20.17], [73.99, 20.18], [73.98, 20.18], [73.98, 20.17]]] }
    };

    setFields([created, ...fields]);
    setShowAddModal(false);
    setNewField({
      field_name: '',
      farm: farms?.[0]?.farm_id || 1,
      area_acres: '',
      soil_type: 'Black Cotton',
      irrigation_source: 'Drip Irrigation',
      status: 'Active'
    });
  };

  const totalAcres = fields.reduce((acc, curr) => acc + (parseFloat(curr.area_acres) || 0), 0);
  const plantedCount = fields.filter((f) => f.status === 'Planted').length;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 1: Field & Crop Mapping</h2>
          <p className="text-muted small mb-0">
            Cadastral parcel zoning, GPS perimeter tracking, soil strata classification, and crop assignment.
          </p>
        </div>
        <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowAddModal(true)}>
          + Register New Field Parcel
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL PARCELS</span>
            <h4 className="fw-bold mb-0 text-dark">{fields.length}</h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">MAPPED AREA</span>
            <h4 className="fw-bold mb-0 text-success">{totalAcres.toFixed(1)} <small className="fs-6 text-muted">Acres</small></h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">CURRENTLY PLANTED</span>
            <h4 className="fw-bold mb-0 text-primary">{plantedCount} Parcels</h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">SOIL TYPES TRACKED</span>
            <h4 className="fw-bold mb-0 text-secondary">6 Types</h4>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by parcel or farm estate name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterSoil}
              onChange={(e) => setFilterSoil(e.target.value)}
            >
              <option value="ALL">All Soil Classifications</option>
              <option value="Black Cotton">Black Cotton</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Clay Loam">Clay Loam</option>
              <option value="Sandy Loam">Sandy Loam</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Cultivation Statuses</option>
              <option value="Planted">Planted</option>
              <option value="Active">Active</option>
              <option value="Under Preparation">Under Preparation</option>
              <option value="Fallow">Fallow</option>
            </select>
          </div>
          <div className="col-12 col-md-2 text-md-end text-muted small">
            Showing <strong>{filteredFields.length}</strong> of {fields.length}
          </div>
        </div>
      </div>

      {/* Field Cards Grid */}
      <div className="row g-3">
        {filteredFields.map((field) => (
          <div key={field.field_id} className="col-12 col-md-6 col-xl-4">
            <div className="card h-100 border-0 shadow-sm rounded-3 field-card">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="card-title fw-bold h6 mb-1 text-dark">{field.field_name}</h5>
                    <span className="text-muted small">📍 {field.farm_name}</span>
                  </div>
                  <span className={`badge-status ${
                    field.status === 'Planted' ? 'badge-active' :
                    field.status === 'Under Preparation' ? 'badge-in-progress' :
                    field.status === 'Fallow' ? 'badge-idle' : 'badge-completed'
                  }`}>
                    {field.status}
                  </span>
                </div>

                <div className="bg-light p-2 rounded small mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Parcel Acreage:</span>
                    <strong className="text-dark">{field.area_acres} Acres</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Soil Profile:</span>
                    <span className="badge bg-secondary-subtle text-secondary">{field.soil_type}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Irrigation Source:</span>
                    <span className="badge bg-info-subtle text-info-emphasis">{field.irrigation_source}</span>
                  </div>
                </div>

                {/* Active Crop Mapping */}
                <div className="border-top pt-2 mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted fw-semibold">Mapped Crop:</span>
                    {field.active_crop ? (
                      <span className="badge bg-success-subtle text-success fw-bold">
                        {field.active_crop.crop_name}
                      </span>
                    ) : (
                      <span className="text-muted small fst-italic">None (Fallow / Prep)</span>
                    )}
                  </div>
                  {field.active_crop && (
                    <div className="d-flex justify-content-between align-items-center mt-1 small text-muted">
                      <span>Season: {field.active_crop.season}</span>
                      <span className="badge bg-light text-dark border">
                        Stage: {field.active_crop.current_stage}
                      </span>
                    </div>
                  )}
                </div>

                {/* GeoJSON Boundary Indicator */}
                <div className="mt-2 text-end">
                  <span className="badge bg-light text-muted border" style={{ fontSize: '0.68rem' }}>
                    🌐 {field.boundary_geojson ? 'GIS Polygon Bound' : 'Cadastral Marker'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Register New Field Parcel</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddField}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Field Parcel Identifier</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. West Plot D - Sugarcane Sector"
                      value={newField.field_name}
                      onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Belongs to Farm Estate</label>
                    <select
                      className="form-select"
                      value={newField.farm}
                      onChange={(e) => setNewField({ ...newField, farm: e.target.value })}
                    >
                      {farms.map((f) => (
                        <option key={f.farm_id} value={f.farm_id}>
                          {f.farm_name} ({f.city}, {f.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Area (Acres)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="e.g. 35.5"
                        value={newField.area_acres}
                        onChange={(e) => setNewField({ ...newField, area_acres: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Initial Status</label>
                      <select
                        className="form-select"
                        value={newField.status}
                        onChange={(e) => setNewField({ ...newField, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Planted">Planted</option>
                        <option value="Under Preparation">Under Preparation</option>
                        <option value="Fallow">Fallow</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Soil Classification</label>
                      <select
                        className="form-select"
                        value={newField.soil_type}
                        onChange={(e) => setNewField({ ...newField, soil_type: e.target.value })}
                      >
                        <option value="Black Cotton">Black Cotton</option>
                        <option value="Alluvial">Alluvial</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Clay Loam">Clay Loam</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Laterite">Laterite</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Irrigation Source</label>
                      <select
                        className="form-select"
                        value={newField.irrigation_source}
                        onChange={(e) => setNewField({ ...newField, irrigation_source: e.target.value })}
                      >
                        <option value="Drip Irrigation">Drip Irrigation</option>
                        <option value="Canal">Canal</option>
                        <option value="Borewell">Borewell</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="River Lift">River Lift</option>
                        <option value="Rainfed">Rainfed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Save Parcel
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
