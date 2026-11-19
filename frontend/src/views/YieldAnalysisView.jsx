import React, { useState } from 'react';

export default function YieldAnalysisView({ yields: initialYields, plantings }) {
  const [yields, setYields] = useState(initialYields || []);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newYield, setNewYield] = useState({
    planting: plantings?.[0]?.planting_id || 1,
    harvest_date: '2024-11-20',
    net_yield_kg: '',
    target_yield_kg: '30000',
    quality_grade: 'Grade A (Export/Premium)',
    market_price_per_kg_inr: '',
    storage_location: 'Central Silo 1',
    buyer_name: 'BigBasket Farm Direct'
  });

  const totalYieldKg = yields.reduce((acc, y) => acc + (parseFloat(y.net_yield_kg) || 0), 0);
  const totalRevenueInr = yields.reduce((acc, y) => acc + (parseFloat(y.total_revenue_inr) || 0), 0);
  const avgRate = totalYieldKg > 0 ? (totalRevenueInr / totalYieldKg) : 0;

  const handleAddYield = (e) => {
    e.preventDefault();
    const kg = parseFloat(newYield.net_yield_kg) || 0;
    const rate = parseFloat(newYield.market_price_per_kg_inr) || 0;
    const plantingObj = plantings.find((p) => String(p.planting_id) === String(newYield.planting)) || plantings[0];

    const created = {
      yield_id: Date.now(),
      planting: newYield.planting,
      crop_name: plantingObj ? plantingObj.crop_name : 'Crop',
      field_name: plantingObj ? plantingObj.field_name : 'Field',
      farm_name: plantingObj ? plantingObj.farm_name : 'Estate',
      season: plantingObj ? plantingObj.season : 'Kharif 2024',
      harvest_date: newYield.harvest_date,
      net_yield_kg: kg,
      target_yield_kg: parseFloat(newYield.target_yield_kg) || kg,
      quality_grade: newYield.quality_grade,
      market_price_per_kg_inr: rate,
      total_revenue_inr: kg * rate,
      storage_location: newYield.storage_location,
      buyer_name: newYield.buyer_name
    };

    setYields([created, ...yields]);
    setShowAddModal(false);
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 4: Yield Analysis & Forecasting</h2>
          <p className="text-muted small mb-0">
            Post-harvest crop output analytics, actual vs forecasted yield variance, and commercial revenue tracking.
          </p>
        </div>
        <button className="btn btn-success btn-sm shadow-sm" onClick={() => setShowAddModal(true)}>
          + Log Harvest Output & Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL HARVEST PRODUCED</span>
            <h4 className="fw-bold mb-0 text-success">{(totalYieldKg / 1000).toFixed(1)} <small className="fs-6 text-muted">Metric Tonnes</small></h4>
            <small className="text-muted">{totalYieldKg.toLocaleString()} Kilograms net</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">GROSS REVENUE REALIZED</span>
            <h4 className="fw-bold mb-0 text-dark">₹{(totalRevenueInr / 100000).toFixed(2)} <small className="fs-6 text-muted">Lakh INR</small></h4>
            <small className="text-muted">₹{totalRevenueInr.toLocaleString()}</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">WEIGHTED AVG MANDI RATE</span>
            <h4 className="fw-bold mb-0 text-primary">₹{avgRate.toFixed(2)} / kg</h4>
            <small className="text-muted">Weighted realization</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">PREMIUM QUALITY SHARE</span>
            <h4 className="fw-bold mb-0 text-warning-emphasis">78.5% Grade A</h4>
            <small className="text-muted">Export & Supermarket grade</small>
          </div>
        </div>
      </div>

      {/* Harvest Output Ledger Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="h6 mb-0 fw-bold">Harvest Output & Commercial Realization Ledger</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Harvest Date</th>
                <th>Crop & Estate Parcel</th>
                <th>Actual Yield (kg)</th>
                <th>Target Forecast (kg)</th>
                <th>Yield Variance</th>
                <th>Quality Grade</th>
                <th>Mandi Rate (₹/kg)</th>
                <th>Gross Revenue (₹)</th>
                <th>Buyer Mandi / Corp</th>
              </tr>
            </thead>
            <tbody className="small">
              {yields.map((y) => {
                const diff = (parseFloat(y.net_yield_kg) || 0) - (parseFloat(y.target_yield_kg) || 0);
                const isPositive = diff >= 0;

                return (
                  <tr key={y.yield_id}>
                    <td>{y.harvest_date}</td>
                    <td>
                      <strong className="text-dark">{y.crop_name}</strong>
                      <div className="text-muted small">{y.field_name} ({y.farm_name})</div>
                    </td>
                    <td className="fw-bold text-success">{parseFloat(y.net_yield_kg)?.toLocaleString()} kg</td>
                    <td className="text-muted">{parseFloat(y.target_yield_kg)?.toLocaleString()} kg</td>
                    <td>
                      <span className={`badge ${isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {isPositive ? `+${diff.toLocaleString()}` : diff.toLocaleString()} kg
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        y.quality_grade?.includes('Grade A') ? 'bg-success-subtle text-success' :
                        y.quality_grade?.includes('Grade B') ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning-emphasis'
                      }`}>
                        {y.quality_grade}
                      </span>
                    </td>
                    <td>₹{parseFloat(y.market_price_per_kg_inr)?.toFixed(2)}</td>
                    <td className="fw-bold text-dark">₹{parseFloat(y.total_revenue_inr)?.toLocaleString()}</td>
                    <td>{y.buyer_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Harvest Output Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Record Harvest Output & Mandi Realization</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddYield}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Crop Planting Cycle</label>
                    <select
                      className="form-select"
                      value={newYield.planting}
                      onChange={(e) => setNewYield({ ...newYield, planting: e.target.value })}
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
                      <label className="form-label small fw-semibold">Harvest Completion Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newYield.harvest_date}
                        onChange={(e) => setNewYield({ ...newYield, harvest_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Quality Inspection Grade</label>
                      <select
                        className="form-select"
                        value={newYield.quality_grade}
                        onChange={(e) => setNewYield({ ...newYield, quality_grade: e.target.value })}
                      >
                        <option value="Grade A (Export/Premium)">Grade A (Export/Premium)</option>
                        <option value="Grade B (Standard Market)">Grade B (Standard Market)</option>
                        <option value="Grade C (Processing/Fair)">Grade C (Processing/Fair)</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Net Yield Output (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 34000"
                        value={newYield.net_yield_kg}
                        onChange={(e) => setNewYield({ ...newYield, net_yield_kg: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Mandi Market Rate (₹/kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="e.g. 48.50"
                        value={newYield.market_price_per_kg_inr}
                        onChange={(e) => setNewYield({ ...newYield, market_price_per_kg_inr: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Storage Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newYield.storage_location}
                        onChange={(e) => setNewYield({ ...newYield, storage_location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Procurement Buyer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newYield.buyer_name}
                        onChange={(e) => setNewYield({ ...newYield, buyer_name: e.target.value })}
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
                    Record Harvest & Revenue
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
