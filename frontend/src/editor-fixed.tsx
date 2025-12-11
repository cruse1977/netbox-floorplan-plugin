import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// Simplified FloorplanEditor with React-controlled tabs (no Bootstrap JS)
function FloorplanEditorSimplified() {
  const [activeTab, setActiveTab] = useState<'rack' | 'device'>('rack');

  return (
    <div className="row">
      {/* Control Panel - Left */}
      <div className="col-md-4">
        <div className="card">
          <h5 className="card-header">Controls</h5>
          <div className="card-body">
            <h6>Test Component</h6>
            <p>Testing React-controlled tabs (no Bootstrap JS)</p>

            <hr />

            {/* React-Controlled Tabs - NO data-bs-toggle */}
            <div className="mb-3">
              <label className="form-label">Rack/Device Tabs Test</label>

              {/* Tab Buttons - React onClick only */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'rack' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('rack')}
                  >
                    Racks
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'device' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('device')}
                  >
                    Devices
                  </button>
                </li>
              </ul>

              {/* Tab Content - React conditional rendering */}
              <div className="border border-top-0 p-3">
                {activeTab === 'rack' && (
                  <div>
                    <h6>Racks Tab</h6>
                    <p>This is the racks content.</p>
                  </div>
                )}
                {activeTab === 'device' && (
                  <div>
                    <h6>Devices Tab</h6>
                    <p>This is the devices content.</p>
                  </div>
                )}
              </div>
            </div>

            <button className="btn btn-primary w-100">Save</button>
          </div>
        </div>
      </div>

      {/* Canvas - Right */}
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <div style={{
              border: '2px solid #ccc',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p>Canvas placeholder - {activeTab} tab active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get initial data
const dataElement = document.getElementById('floorplan-data');
if (dataElement) {
  console.log('Data found:', dataElement.dataset);
}

// Mount React
const rootElement = document.getElementById('floorplan-editor-root');
if (rootElement) {
  console.log('Mounting simplified editor with React-controlled tabs...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <FloorplanEditorSimplified />
    </React.StrictMode>
  );
  console.log('Mounted successfully');
} else {
  console.error('Root element not found');
}
