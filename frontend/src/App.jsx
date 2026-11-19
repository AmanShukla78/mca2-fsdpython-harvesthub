import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import FieldMappingView from './views/FieldMappingView';
import SchedulingView from './views/SchedulingView';
import CostTrackingView from './views/CostTrackingView';
import YieldAnalysisView from './views/YieldAnalysisView';
import EquipmentRegistryView from './views/EquipmentRegistryView';
import MaintenanceTrackerView from './views/MaintenanceTrackerView';
import UtilizationOptimizationView from './views/UtilizationOptimizationView';
import SparePartsInventoryView from './views/SparePartsInventoryView';
import { api, initialMockState } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('FARM_MANAGER');
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Core Data States
  const [summary, setSummary] = useState(null);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [plantings, setPlantings] = useState([]);
  const [operations, setOperations] = useState([]);
  const [costs, setCosts] = useState([]);
  const [yields, setYields] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [spares, setSpares] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadData() {
      // 1. Check live backend
      try {
        const liveSummary = await api.getDashboardSummary();
        if (liveSummary && liveSummary.kpis) {
          setSummary(liveSummary);
          setIsLiveConnected(true);
        } else {
          setSummary({ kpis: initialMockState.kpis, recent_operations: initialMockState.operations, alerts: [] });
        }
      } catch {
        setSummary({ kpis: initialMockState.kpis, recent_operations: initialMockState.operations, alerts: [] });
      }

      // 2. Load entities
      const [f, fd, cr, pl, op, c, y, eq, mt, sp, an] = await Promise.all([
        api.getFarms(),
        api.getFields(),
        api.getCrops(),
        api.getPlantings(),
        api.getOperations(),
        api.getCosts(),
        api.getYields(),
        api.getEquipment(),
        api.getMaintenance(),
        api.getSpareParts(),
        api.getFleetAnalytics()
      ]);

      setFarms(f || initialMockState.farms);
      setFields(fd || initialMockState.fields);
      setCrops(cr || initialMockState.crops);
      setPlantings(pl || initialMockState.plantings);
      setOperations(op || initialMockState.operations);
      setCosts(c || initialMockState.costs);
      setYields(y || initialMockState.yields);
      setEquipment(eq || initialMockState.equipment);
      setMaintenance(mt || initialMockState.maintenance);
      setSpares(sp || initialMockState.spares);
      setAnalytics(an);
    }

    loadData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        isLiveConnected={isLiveConnected}
      />

      <main className="flex-grow-1">
        {activeTab === 'dashboard' && (
          <DashboardView summary={summary} setActiveTab={setActiveTab} currentRole={currentRole} />
        )}
        {activeTab === 'fields' && (
          <FieldMappingView fields={fields} farms={farms} />
        )}
        {activeTab === 'schedules' && (
          <SchedulingView plantings={plantings} operations={operations} fields={fields} crops={crops} />
        )}
        {activeTab === 'costs' && (
          <CostTrackingView costs={costs} plantings={plantings} />
        )}
        {activeTab === 'yields' && (
          <YieldAnalysisView yields={yields} plantings={plantings} />
        )}
        {activeTab === 'equipment' && (
          <EquipmentRegistryView equipment={equipment} />
        )}
        {activeTab === 'maintenance' && (
          <MaintenanceTrackerView maintenance={maintenance} equipment={equipment} />
        )}
        {activeTab === 'utilization' && (
          <UtilizationOptimizationView analytics={analytics} />
        )}
        {activeTab === 'spares' && (
          <SparePartsInventoryView spares={spares} />
        )}
      </main>

      <footer className="bg-white border-top py-3 px-4 text-center text-muted small mt-auto">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
          <span>
            <strong>HarvestHub (P08)</strong> &bull; Indian Agricultural Farm Management & Crop Planning Platform
          </span>
          <span className="mt-1 mt-md-0">
            Tech Stack: Python & Django REST Framework &bull; React 18 &bull; MySQL 8.0 &bull; Agile Sprints 0-3
          </span>
        </div>
      </footer>
    </div>
  );
}
