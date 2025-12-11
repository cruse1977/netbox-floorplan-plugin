/**
 * Ultra-simple Fabric Canvas - NO hooks, NO overlays
 */

import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';

export const FabricCanvasSimple: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Creating basic Fabric.js canvas...');

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });

    console.log('Canvas created successfully');

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  return (
    <div style={{ border: '2px solid green', padding: '10px' }}>
      <h3>Simple Canvas (No Hooks)</h3>
      <canvas ref={canvasRef} />
    </div>
  );
};
