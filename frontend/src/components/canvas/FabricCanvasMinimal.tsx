/**
 * Minimal Fabric Canvas - Testing version
 * Strips out all hooks to find what breaks
 */

import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';

interface FabricCanvasMinimalProps {
  readonly?: boolean;
}

export const FabricCanvasMinimal: React.FC<FabricCanvasMinimalProps> = ({ readonly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing minimal Fabric.js canvas...');

    // Create basic canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
      selection: !readonly,
    });

    console.log('Fabric.js canvas created successfully');

    // Cleanup
    return () => {
      console.log('Disposing canvas...');
      fabricCanvas.dispose();
    };
  }, [readonly]);

  return (
    <div style={{ position: 'relative', border: '2px solid green' }}>
      <div className="alert alert-success mb-2">
        ✅ Minimal FabricCanvas rendering
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};
