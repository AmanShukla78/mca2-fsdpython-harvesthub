import React, { useState } from 'react';

export default function CostTrackingView({ costs: initialCosts, plantings }) {
  const [costs, setCosts] = useState(initialCosts || []);
  const [filterType, setFilterType] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCost, setNewCost] = useState({
    planting: plantings?.[0]?.planting_id || 1,
    input_type: 'Fertilizer',
    item_name: '',
    quantity: '',
    unit: 'Bags',
    unit_cost_inr: '',
    expense_date: '2024-11-20',
    supplier_name: 'IFFCO Seva Kendra'
  });

  const totalExpenditure = costs.reduce((sum, c) => sum + (parseFloat(c.total_cost_inr) || 0), 0);

  const costsByType = costs.reduce((acc, c) => {
    acc[c.input_type] = (acc[c.input_type] || 0) + (parseFloat(c.total_cost_inr) || 0);
    return acc;
  }, {});

  const filteredCosts = filterType === 'ALL' ? costs : costs.filter((c) => c.input_type === filterType);

  const handleAddCost = (e) => {
    e.preventDefault();
    const qty = parseFloat(newCost.quantity) || 0;
    const rate = parseFloat(newCost.unit_cost_inr) || 0;
    const plantingObj = plantings.find((p) => String(p.planting_id) === String(newCost.planting)) || plantings[0];

    const created = {
      cost_id: Date.now(),
      planting: newCost.planting,
      crop_name: plantingObj ? plantingObj.crop_name : 'Crop',
      field_name: plantingObj ? plantingObj.field_name : 'Field',
      input_type: newCost.input_type,
      item_name: newCost.item_name,
      quantity: qty,
      unit: newCost.unit,
      unit_cost_inr: rate,
      total_cost_inr: qty * rate,
      expense_date: newCost.expense_date,
      supplier_name: newCost.supplier_name
    };

    setCosts([created, ...costs]);
    setShowAddModal(false);
    setNewCost({
      planting: plantings?.[0]?.planting_id || 1,
      input_type: 'Fertilizer',
      item_name: '',
      quantity: '',
      unit: 'Bags',
      unit_cost_inr: '',
      expense_date: '2024-11-20',
      supplier_name: 'IFFCO Seva Kendra'
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 3: Input & Cost Tracking</h2>
          <p className="text-muted small mb-0">
            Granular fiscal accounting for seeds, fertilizers, chemical sprays, diesel fuel, and labor crews.
          </p>
        </div>
        <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowAddModal(true)}>
          + Record Farm Input Expense
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL INPUT EXPENDITURE</span>
            <h4 className="fw-bold mb-0 text-danger">₹{totalExpenditure.toLocaleString()}</h4>
            <small className="text-muted">Direct seasonal cost basis</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">FERTILIZERS & CHEMICALS</span>
            <h4 className="fw-bold mb-0 text-warning-emphasis">
              ₹{((costsByType['Fertilizer'] || 0) + (costsByType['Pesticide'] || 0)).toLocaleString()}
            </h4>
            <small className="text-muted">Soil nutrition & protection</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">DIESEL & MACHINERY RUN</span>
            <h4 className="fw-bold mb-0 text-primary">₹{(costsByType['Fuel'] || 0).toLocaleString()}</h4>
            <small className="text-muted">Tractor & combine fuel</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">MANUAL LABOR WAGES</span>
            <h4 className="fw-bold mb-0 text-success">₹{(costsByType['Labor'] || 0).toLocaleString()}</h4>
            <small className="text-muted">Sowing, weeding & picking</small>
          </div>
        </div>
      </div>

      {/* Filter and Ledger Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap justify-content-between align-items-center">
          <h5 className="h6 mb-0 fw-bold">Farm Input Expense Ledger</h5>
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <label className="small text-muted mb-0">Category:</label>
            <select
              className="form-select form-select-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Input Categories</option>
              <option value="Seed">Seeds</option>
              <option value="Fertilizer">Fertilizers</option>
              <option value="Pesticide">Pesticides</option>
              <option value="Fuel">Fuel (Diesel)</option>
              <option value="Labor">Manual Labor</option>
              <option value="Machinery Rental">Machinery Rental</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Item Specification</th>
                <th>Crop & Parcel</th>
                <th>Quantity</th>
                <th>Unit Rate (₹)</th>
                <th>Total Incurred (₹)</th>
                <th>Vendor / Source</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredCosts.map((c) => (
                <tr key={c.cost_id}>
                  <td>{c.expense_date}</td>
                  <td>
                    <span className={`badge ${
                      c.input_type === 'Seed' ? 'bg-success-subtle text-success' :
                      c.input_type === 'Fertilizer' ? 'bg-warning-subtle text-warning-emphasis' :
                      c.input_type === 'Fuel' ? 'bg-info-subtle text-info-emphasis' :
                      c.input_type === 'Labor' ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'
                    }`}>
                      {c.input_type}
                    </span>
                  </td>
                  <td><strong className="text-dark">{c.item_name}</strong></td>
                  <td>
                    <div>{c.crop_name}</div>
                    <small className="text-muted">{c.field_name}</small>
                  </td>
                  <td>{c.quantity} {c.unit}</td>
                  <td>₹{parseFloat(c.unit_cost_inr)?.toLocaleString()}</td>
                  <td className="fw-bold text-dark">₹{parseFloat(c.total_cost_inr)?.toLocaleString()}</td>
                  <td>{c.supplier_name || 'Direct Procurement'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Record Farm Input Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddCost}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Charged to Crop Cycle</label>
                    <select
                      className="form-select"
                      value={newCost.planting}
                      onChange={(e) => setNewCost({ ...newCost, planting: e.target.value })}
                    >
                      {plantings.map((p) => (
                        <option key={p.planting_id} value={p.planting_id}>
                          {p.crop_name} @ {p.field_name} ({p.season})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Input Category</label>
                      <select
                        className="form-select"
                        value={newCost.input_type}
                        onChange={(e) => setNewCost({ ...newCost, input_type: e.target.value })}
                      >
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Seed">Seed</option>
                        <option value="Pesticide">Pesticide</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Labor">Labor</option>
                        <option value="Machinery Rental">Machinery Rental</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Expense Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newCost.expense_date}
                        onChange={(e) => setNewCost({ ...newCost, expense_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Item Specification / Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Urea Neem Coated (45kg)"
                      value={newCost.item_name}
                      onChange={(e) => setNewCost({ ...newCost, item_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Quantity</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="e.g. 25"
                        value={newCost.quantity}
                        onChange={(e) => setNewCost({ ...newCost, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Unit</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Bags, Litres"
                        value={newCost.unit}
                        onChange={(e) => setNewCost({ ...newCost, unit: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Unit Cost (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="e.g. 1350"
                        value={newCost.unit_cost_inr}
                        onChange={(e) => setNewCost({ ...newCost, unit_cost_inr: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Supplier / Vendor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCost.supplier_name}
                      onChange={(e) => setNewCost({ ...newCost, supplier_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Record Expense
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
