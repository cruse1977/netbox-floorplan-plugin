// React import needed for JSX
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloorplanEditor } from './components/editor/FloorplanEditor';
import { setGlobalCSRFToken } from './utils/csrf';

// Get initial data from Django template
const dataElement = document.getElementById('floorplan-data');
if (!dataElement) {
  throw new Error('Floorplan data element not found');
}

const initialData = {
  floorplanId: parseInt(dataElement.dataset.floorplanId || '0'),
  siteId: dataElement.dataset.siteId ? parseInt(dataElement.dataset.siteId) : null,
  locationId: dataElement.dataset.locationId ? parseInt(dataElement.dataset.locationId) : null,
  recordType: (dataElement.dataset.recordType as 'site' | 'location') || 'site',
};

// Set CSRF token globally for API client
const csrfToken = dataElement.dataset.csrfToken;
if (csrfToken) {
  setGlobalCSRFToken(csrfToken);
}

// Find the root element
const rootElement = document.getElementById('floorplan-editor-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // Remove StrictMode - it causes double-rendering that conflicts with NetBox's DOM
  root.render(React.createElement(FloorplanEditor, { initialData }));
} else {
  console.error('Root element #floorplan-editor-root not found');
}
