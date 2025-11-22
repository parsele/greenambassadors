import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import apiClient from '../config/axios';
import toast from 'react-hot-toast';
import './MapPage.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for trees
const treeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Amboseli coordinates (center of Amboseli National Park)
const AMBOSELI_CENTER = [-2.6531, 37.2531];
const AMBOSELI_ZOOM = 12;

function MapBoundsUpdater({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

function MapPage() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);

  useEffect(() => {
    fetchTrees();
    fetchStats();
  }, []);

  const fetchTrees = async () => {
    try {
      const response = await apiClient.get('/api/trees');
      setTrees(response.data);
    } catch (error) {
      toast.error('Failed to load trees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/trees/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  if (loading) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-page">
      <div className="map-stats">
        {stats && (
          <div className="stats-card">
            <h3>Tree Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.totalTrees}</span>
                <span className="stat-label">Total Trees</span>
              </div>
              {Object.entries(stats.byStatus || {}).map(([status, count]) => (
                <div key={status} className="stat-item">
                  <span className="stat-value">{count}</span>
                  <span className="stat-label">{status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="map-container">
        <MapContainer
          center={AMBOSELI_CENTER}
          zoom={AMBOSELI_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trees.map((tree) => (
            <Marker
              key={tree._id}
              position={[tree.latitude, tree.longitude]}
              icon={treeIcon}
              eventHandlers={{
                click: () => setSelectedTree(tree)
              }}
            >
              <Popup>
                <div className="tree-popup">
                  <h4>{tree.species}</h4>
                  <p><strong>Planter:</strong> {tree.planterName}</p>
                  <p><strong>Date:</strong> {new Date(tree.datePlanted).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {tree.status}</p>
                  {tree.notes && <p><strong>Notes:</strong> {tree.notes}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {selectedTree && (
        <div className="tree-detail-panel">
          <button className="close-button" onClick={() => setSelectedTree(null)}>×</button>
          <h2>{selectedTree.species}</h2>
          <div className="detail-item">
            <strong>Planter:</strong> {selectedTree.planterName}
          </div>
          <div className="detail-item">
            <strong>Date Planted:</strong> {new Date(selectedTree.datePlanted).toLocaleDateString()}
          </div>
          <div className="detail-item">
            <strong>Status:</strong> <span className={`status-badge status-${selectedTree.status}`}>{selectedTree.status}</span>
          </div>
          {selectedTree.planterEmail && (
            <div className="detail-item">
              <strong>Email:</strong> {selectedTree.planterEmail}
            </div>
          )}
          {selectedTree.notes && (
            <div className="detail-item">
              <strong>Notes:</strong> {selectedTree.notes}
            </div>
          )}
          <div className="detail-item">
            <strong>Coordinates:</strong> {selectedTree.latitude.toFixed(6)}, {selectedTree.longitude.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;

