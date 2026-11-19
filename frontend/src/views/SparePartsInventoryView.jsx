import React, { useState } from 'react';

export default function SparePartsInventoryView({ spares: initialSpares }) {
  const [spares, setSpares] = useState(initialSpares || []);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [orderQty, setOrderQty] = useState('10');
  const [orderNotice, setOrderNotice] = useState(null);

  const lowStockCount = spares.filter((p) => p.current_stock <= p.minimum_reorder_level).length;
  const totalInventoryValue = spares.reduce((acc, p) => acc + ((p.current_stock || 0) * (parseFloat(p.unit_price_inr) || 0)), 0);

  const displayedSpares = filterLowStock ? spares.filter((p) => p.current_stock <= p.minimum_reorder_level) : spares;

  const handleOpenOrder = (part) => {
    setSelectedPart(part);
    setShowOrderModal(true);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedPart) return;

    const qty = parseInt(orderQty, 10) || 1;
    // update in-memory stock
    setSpares(spares.map((p) => {
      if (p.part_id === selectedPart.part_id) {
        return {
          ...p,
          current_stock: p.current_stock + qty,
          is_low_stock: (p.current_stock + qty) <= p.minimum_reorder_level
        };
      }
      return p;
    }));

    setOrderNotice(`Purchase Order dispatched to ${selectedPart.supplier_name} for ${qty} ${selectedPart.unit_of_measure} of ${selectedPart.name}!`);
    setShowOrderModal(false);
    setTimeout(() => setOrderNotice(null), 5000);
  };

  return (
    <div className="container-fluid py-4">
      {/* Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Module 8: Spare Parts & Supply Management</h2>
          <p className="text-muted small mb-0">
            Consumable filters, wear cutting blades, hydraulic fluids, supplier catalogs, and restock purchase orders.
          </p>
        </div>
        <button className="btn btn-outline-danger btn-sm shadow-sm" onClick={() => setFilterLowStock(!filterLowStock)}>
          {filterLowStock ? 'Show All Inventory' : `⚠️ Show Low Stock Only (${lowStockCount})`}
        </button>
      </div>

      {/* Alert banner if order dispatched */}
      {orderNotice && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>✓ Order Confirmed:</strong> {orderNotice}
          <button type="button" className="btn-close" onClick={() => setOrderNotice(null)}></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">TOTAL UNIQUE SKUS</span>
            <h4 className="fw-bold mb-0 text-dark">{spares.length} Parts</h4>
            <small className="text-muted">Catalogued spares</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">LOW STOCK WARNINGS</span>
            <h4 className="fw-bold mb-0 text-danger">{lowStockCount} Critical</h4>
            <small className="text-muted">At or below reorder threshold</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">CURRENT INVENTORY VALUE</span>
            <h4 className="fw-bold mb-0 text-primary">₹{totalInventoryValue.toLocaleString()}</h4>
            <small className="text-muted">On-hand parts capital</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <span className="text-muted small fw-semibold">AUTHORIZED SUPPLIERS</span>
            <h4 className="fw-bold mb-0 text-success">12 Vendors</h4>
            <small className="text-muted">GST registered partners</small>
          </div>
        </div>
      </div>

      {/* Spares Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="h6 mb-0 fw-bold">Spare Parts Catalog & Replenishment Monitor</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Part Number</th>
                <th>Component Specification</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Unit Price (₹)</th>
                <th>Supplier Vendor</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="small">
              {displayedSpares.map((p) => {
                const isLow = p.current_stock <= p.minimum_reorder_level;

                return (
                  <tr key={p.part_id} className={isLow ? 'table-warning bg-opacity-10' : ''}>
                    <td><code>{p.part_number}</code></td>
                    <td><strong className="text-dark">{p.name}</strong></td>
                    <td><span className="badge bg-secondary-subtle text-secondary">{p.category}</span></td>
                    <td className={`fw-bold ${p.current_stock === 0 ? 'text-danger' : isLow ? 'text-warning-emphasis' : 'text-success'}`}>
                      {p.current_stock} {p.unit_of_measure}
                    </td>
                    <td className="text-muted">{p.minimum_reorder_level} {p.unit_of_measure}</td>
                    <td>₹{parseFloat(p.unit_price_inr)?.toLocaleString()}</td>
                    <td>{p.supplier_name || 'Standard Supplier'}</td>
                    <td>
                      {p.current_stock === 0 ? (
                        <span className="badge-status badge-alert">Out of Stock</span>
                      ) : isLow ? (
                        <span className="badge-status badge-maintenance">Low Stock</span>
                      ) : (
                        <span className="badge-status badge-active">Adequate</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-success btn-sm py-0 px-2"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleOpenOrder(p)}
                      >
                        + Reorder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Modal */}
      {showOrderModal && selectedPart && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Generate Restock Purchase Order</h5>
                <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
              </div>
              <form onSubmit={handleCreateOrder}>
                <div className="modal-body">
                  <div className="p-3 bg-light rounded mb-3 small">
                    <div><strong>Component:</strong> {selectedPart.name}</div>
                    <div><strong>Part Number:</strong> <code>{selectedPart.part_number}</code></div>
                    <div><strong>Supplier:</strong> {selectedPart.supplier_name}</div>
                    <div><strong>Unit Price:</strong> ₹{parseFloat(selectedPart.unit_price_inr)?.toLocaleString()}</div>
                    <div><strong>Current Stock:</strong> {selectedPart.current_stock} {selectedPart.unit_of_measure}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Order Quantity ({selectedPart.unit_of_measure})</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={orderQty}
                      onChange={(e) => setOrderQty(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-2 bg-success-subtle text-success-emphasis rounded small">
                    <span>Estimated Total PO Value:</span>
                    <strong className="fs-6">
                      ₹{((parseInt(orderQty, 10) || 0) * (parseFloat(selectedPart.unit_price_inr) || 0)).toLocaleString()}
                    </strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowOrderModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm">
                    Dispatch Purchase Order
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
