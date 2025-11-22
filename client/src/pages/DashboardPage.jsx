import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/axios';
import toast from 'react-hot-toast';
import './DashboardPage.css';

function DashboardPage() {
  const { isAdmin } = useAuth();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingTree, setEditingTree] = useState(null);
  const [formData, setFormData] = useState({
    species: '',
    latitude: '',
    longitude: '',
    planterName: '',
    planterEmail: '',
    datePlanted: new Date().toISOString().split('T')[0],
    status: 'planted',
    notes: '',
    photoUrl: ''
  });
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchTrees();
    }
  }, [isAdmin]);

  const fetchTrees = async () => {
    try {
      const response = await apiClient.get('/api/trees');
      setTrees(response.data);
    } catch (error) {
      toast.error('Failed to load trees');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const treeData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (editingTree) {
        await apiClient.put(`/api/trees/${editingTree._id}`, treeData);
        toast.success('Tree updated successfully!');
      } else {
        await apiClient.post('/api/trees', treeData);
        toast.success('Tree added successfully!');
      }

      resetForm();
      fetchTrees();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (tree) => {
    setEditingTree(tree);
    setFormData({
      species: tree.species,
      latitude: tree.latitude.toString(),
      longitude: tree.longitude.toString(),
      planterName: tree.planterName,
      planterEmail: tree.planterEmail || '',
      datePlanted: new Date(tree.datePlanted).toISOString().split('T')[0],
      status: tree.status,
      notes: tree.notes || '',
      photoUrl: tree.photoUrl || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tree?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/trees/${id}`);
      toast.success('Tree deleted successfully!');
      fetchTrees();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      species: '',
      latitude: '',
      longitude: '',
      planterName: '',
      planterEmail: '',
      datePlanted: new Date().toISOString().split('T')[0],
      status: 'planted',
      notes: '',
      photoUrl: ''
    });
    setEditingTree(null);
    setShowAddForm(false);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await apiClient.post('/api/upload/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.errors && response.data.errors.length > 0) {
        toast.error(`Uploaded with ${response.data.errors.length} errors. Check console.`);
        console.error('Upload errors:', response.data.errors);
      } else {
        toast.success(`Successfully uploaded ${response.data.inserted} trees!`);
      }

      setCsvFile(null);
      setShowUploadModal(false);
      fetchTrees();
    } catch (error) {
      toast.error(error.response?.data?.error || 'CSV upload failed');
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await apiClient.get('/api/upload/csv-template', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tree-upload-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Template downloaded!');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  if (!isAdmin) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1>Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="dashboard-actions">
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
              + Add Tree
            </button>
            <button onClick={() => setShowUploadModal(true)} className="btn btn-secondary">
              📤 Upload CSV
            </button>
            <button onClick={downloadTemplate} className="btn btn-outline">
              📥 Download Template
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingTree ? 'Edit Tree' : 'Add New Tree'}</h2>
              <form onSubmit={handleSubmit} className="tree-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Species *</label>
                    <input
                      type="text"
                      name="species"
                      value={formData.species}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="planted">Planted</option>
                      <option value="growing">Growing</option>
                      <option value="mature">Mature</option>
                      <option value="deceased">Deceased</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Planter Name *</label>
                    <input
                      type="text"
                      name="planterName"
                      value={formData.planterName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Planter Email</label>
                    <input
                      type="email"
                      name="planterEmail"
                      value={formData.planterEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Date Planted</label>
                  <input
                    type="date"
                    name="datePlanted"
                    value={formData.datePlanted}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Photo URL</label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingTree ? 'Update' : 'Add'} Tree
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Upload CSV File</h2>
              <form onSubmit={handleCsvUpload} className="upload-form">
                <div className="form-group">
                  <label>CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    required
                  />
                  <small>Download template for correct format</small>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="trees-table-container">
          <h2>Trees ({trees.length})</h2>
          <div className="table-wrapper">
            <table className="trees-table">
              <thead>
                <tr>
                  <th>Species</th>
                  <th>Planter</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trees.map((tree) => (
                  <tr key={tree._id}>
                    <td>{tree.species}</td>
                    <td>{tree.planterName}</td>
                    <td>{new Date(tree.datePlanted).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${tree.status}`}>
                        {tree.status}
                      </span>
                    </td>
                    <td>
                      {tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(tree)}
                        className="btn-icon"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(tree._id)}
                        className="btn-icon btn-danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

