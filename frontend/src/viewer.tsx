import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloorplanViewer } from './components/viewer/FloorplanViewer';

// Get initial data from Django template
const dataElement = document.getElementById('floorplan-data');
if (!dataElement) {
  throw new Error('Floorplan data element not found');
}

const initialData = {
  floorplanId: parseInt(dataElement.dataset.floorplanId || '0'),
};

// Find the root element
const rootElement = document.getElementById('floorplan-viewer-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <FloorplanViewer initialData={initialData} />
    </React.StrictMode>
  );
} else {
  console.error('Root element #floorplan-viewer-root not found');
}
