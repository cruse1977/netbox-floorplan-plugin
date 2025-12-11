import React from 'react';
import ReactDOM from 'react-dom/client';

// Minimal test component - just text
function MinimalEditor() {
  return (
    <div style={{ padding: '20px', border: '2px solid green' }}>
      <h1>✅ React Editor is Working!</h1>
      <p>If you see this, React mounted successfully.</p>
      <p>The issue is in the FloorplanEditor component itself.</p>
    </div>
  );
}

// Get initial data from Django template
const dataElement = document.getElementById('floorplan-data');
if (!dataElement) {
  console.error('Floorplan data element not found');
} else {
  console.log('Data found:', dataElement.dataset);
}

// Find the root element
const rootElement = document.getElementById('floorplan-editor-root');

if (rootElement) {
  console.log('Root element found, mounting minimal test...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <MinimalEditor />
    </React.StrictMode>
  );
  console.log('Minimal component mounted');
} else {
  console.error('Root element #floorplan-editor-root not found');
}
