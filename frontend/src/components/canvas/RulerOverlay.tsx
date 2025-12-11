/**
 * Ruler Overlay Component
 * Displays horizontal and vertical rulers showing real-world measurements
 */

import React, { useEffect, useState, useRef } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { ScalingService } from '@/services/scaling';

const RULER_SIZE = 30; // pixels

export const RulerOverlay: React.FC = () => {
  const {
    canvas,
    canvasObjects,
    width,
    height,
    measurementUnit,
    scaleFactor,
    zoom,
  } = useFloorplanStore();

  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [boundaryPosition, setBoundaryPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the boundary object
  const boundary = canvasObjects.find((obj) => obj.type === 'floorplan_boundary');

  // Update container size
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Track stage position and boundary position
  useEffect(() => {
    if (!canvas) return;

    const updatePositions = () => {
      const pos = canvas.position();
      setStagePosition({ x: pos.x, y: pos.y });

      if (boundary) {
        setBoundaryPosition({ x: boundary.x, y: boundary.y });
      }
    };

    updatePositions();

    // Listen to stage events
    canvas.on('dragmove', updatePositions);
    canvas.on('wheel', updatePositions);

    return () => {
      canvas.off('dragmove', updatePositions);
      canvas.off('wheel', updatePositions);
    };
  }, [canvas, boundary]);

  // Update boundary position when canvasObjects change
  useEffect(() => {
    if (boundary) {
      setBoundaryPosition({ x: boundary.x, y: boundary.y });
    }
  }, [boundary]);

  // Use defaults if dimensions not set
  const effectiveWidth = width || 100;
  const effectiveHeight = height || 100;
  const effectiveUnit = measurementUnit || 'm';
  const effectiveScaleFactor = scaleFactor || 100;

  // Calculate the step size for ruler ticks (every 2 units in real-world)
  const stepRealWorld = 2;
  const stepCanvas = ScalingService.realWorldToCanvas(
    { width: stepRealWorld, height: stepRealWorld, unit: effectiveUnit },
    effectiveScaleFactor
  );

  // Calculate number of ticks
  const numHorizontalTicks = Math.ceil(effectiveWidth / stepRealWorld);
  const numVerticalTicks = Math.ceil(effectiveHeight / stepRealWorld);

  // Calculate the offset from stage pan and boundary position
  const horizontalOffset = stagePosition.x + boundaryPosition.x * zoom;
  const verticalOffset = stagePosition.y + boundaryPosition.y * zoom;

  // Generate horizontal ruler ticks
  const horizontalTicks = [];
  for (let i = 0; i <= numHorizontalTicks; i++) {
    const realValue = i * stepRealWorld;
    const canvasX = i * stepCanvas.width;
    const screenX = horizontalOffset + canvasX * zoom;

    // Only render if visible
    if (screenX >= 0 && screenX <= containerSize.width) {
      horizontalTicks.push({
        position: screenX,
        label: `${realValue}${effectiveUnit}`,
      });
    }
  }

  // Generate vertical ruler ticks
  const verticalTicks = [];
  for (let i = 0; i <= numVerticalTicks; i++) {
    const realValue = i * stepRealWorld;
    const canvasY = i * stepCanvas.height;
    const screenY = verticalOffset + canvasY * zoom;

    // Only render if visible
    if (screenY >= 0 && screenY <= containerSize.height) {
      verticalTicks.push({
        position: screenY,
        label: `${realValue}${effectiveUnit}`,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Horizontal Ruler */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: RULER_SIZE,
          right: 0,
          height: RULER_SIZE,
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <svg
          width={containerSize.width - RULER_SIZE}
          height={RULER_SIZE}
          style={{ display: 'block' }}
        >
          {horizontalTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={tick.position - RULER_SIZE}
                y1={RULER_SIZE - 10}
                x2={tick.position - RULER_SIZE}
                y2={RULER_SIZE}
                stroke="#495057"
                strokeWidth={1}
              />
              <text
                x={tick.position - RULER_SIZE}
                y={RULER_SIZE - 13}
                fontSize={10}
                fill="#495057"
                textAnchor="middle"
              >
                {tick.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Vertical Ruler */}
      <div
        style={{
          position: 'absolute',
          top: RULER_SIZE,
          left: 0,
          bottom: 0,
          width: RULER_SIZE,
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
        }}
      >
        <svg
          width={RULER_SIZE}
          height={containerSize.height - RULER_SIZE}
          style={{ display: 'block' }}
        >
          {verticalTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={RULER_SIZE - 10}
                y1={tick.position - RULER_SIZE}
                x2={RULER_SIZE}
                y2={tick.position - RULER_SIZE}
                stroke="#495057"
                strokeWidth={1}
              />
              <text
                x={RULER_SIZE - 13}
                y={tick.position - RULER_SIZE + 3}
                fontSize={10}
                fill="#495057"
                textAnchor="end"
                transform={`rotate(-90, ${RULER_SIZE - 13}, ${tick.position - RULER_SIZE + 3})`}
              >
                {tick.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Corner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: RULER_SIZE,
          height: RULER_SIZE,
          backgroundColor: '#e9ecef',
          borderRight: '1px solid #dee2e6',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#6c757d',
        }}
      >
        {ScalingService.formatScale(effectiveScaleFactor)}
      </div>
    </div>
  );
};
