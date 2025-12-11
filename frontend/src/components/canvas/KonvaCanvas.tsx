/**
 * Konva Canvas Component
 * Main canvas component using Konva/react-konva
 */

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { useFloorplanStore } from '@/store/floorplanStore';
import {
  WallComponent,
  AreaComponent,
  LabelComponent,
  RackComponent,
  DeviceComponent,
  BoundaryComponent,
} from './CanvasObjects';
import { RulerOverlay } from './RulerOverlay';
import type { CanvasObject } from '@/utils/konvaHelpers';
import type { BoundaryObject } from '@/utils/konvaHelpers';

interface KonvaCanvasProps {
  readonly?: boolean;
  onObjectDeleted?: () => void;
  onObjectModified?: () => void;
  enableZoomPan?: boolean;
  enableKeyboard?: boolean;
}

export const KonvaCanvas: React.FC<KonvaCanvasProps> = ({
  readonly = false,
  onObjectDeleted,
  onObjectModified,
  enableZoomPan = true,
  enableKeyboard = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const {
    setCanvas,
    floorplan,
    canvasObjects,
    updateCanvasObject,
    removeCanvasObject,
    setZoom,
    setIsDragging,
  } = useFloorplanStore();

  // Initialize stage and store it
  useEffect(() => {
    if (stageRef.current) {
      // Store the Konva stage in Zustand (we'll need to update the store type)
      setCanvas(stageRef.current as any);
    }
  }, [setCanvas]);

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Load floorplan canvas JSON
  useEffect(() => {
    if (floorplan?.canvas && stageRef.current) {
      // Canvas objects are loaded via store
    }
  }, [floorplan]);

  // Load background image
  useEffect(() => {
    if (!floorplan?.assigned_image) {
      setBackgroundImage(null);
      return;
    }

    const imageUrl = floorplan.assigned_image.file || floorplan.assigned_image.external_url;
    if (!imageUrl) {
      setBackgroundImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous'; // Enable CORS if needed
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.onerror = (err) => {
      console.error('Failed to load background image:', err);
      setBackgroundImage(null);
    };
    img.src = imageUrl;
  }, [floorplan?.assigned_image]);

  // Handle wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (!enableZoomPan) return;

    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Clamp scale
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    stage.position(newPos);
    setZoom(clampedScale);
  };

  // Handle Alt+drag pan
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!enableZoomPan) return;

    if (e.evt.altKey) {
      setIsDragging(true);
      const stage = stageRef.current;
      if (stage) {
        stage.draggable(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (!enableZoomPan) return;

    setIsDragging(false);
    const stage = stageRef.current;
    if (stage) {
      stage.draggable(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          removeCanvasObject(selectedId);
          setSelectedId(null);
          if (onObjectDeleted) {
            onObjectDeleted();
          }
        }
      }

      // Arrow keys for movement
      if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const obj = canvasObjects.find((o) => o.id === selectedId);
        if (obj) {
          const step = e.shiftKey ? 10 : 1;
          let newX = obj.x;
          let newY = obj.y;

          switch (e.key) {
            case 'ArrowUp':
              newY -= step;
              break;
            case 'ArrowDown':
              newY += step;
              break;
            case 'ArrowLeft':
              newX -= step;
              break;
            case 'ArrowRight':
              newX += step;
              break;
          }

          updateCanvasObject(selectedId, { x: newX, y: newY });
          if (onObjectModified) {
            onObjectModified();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, selectedId, onObjectDeleted, onObjectModified]);

  // Handle object selection
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (readonly) return;

    const clickedOnEmpty = e.target === stageRef.current;
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleObjectClick = (id: string) => {
    if (readonly) return;
    setSelectedId(id);
  };

  const handleDragEnd = (id: string, e: any) => {
    const node = e.target;
    updateCanvasObject(id, { x: node.x(), y: node.y() });
    if (onObjectModified) {
      onObjectModified();
    }
  };

  // Render a canvas object based on its type
  const renderObject = (obj: CanvasObject) => {
    const isSelected = selectedId === obj.id;
    const onSelect = () => handleObjectClick(obj.id);
    const onDragEnd = (e: any) => handleDragEnd(obj.id, e);

    switch (obj.type) {
      case 'wall':
        return (
          <WallComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'area':
        return (
          <AreaComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'label':
        return (
          <LabelComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'rack':
        return (
          <RackComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'device':
        return (
          <DeviceComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      case 'floorplan_boundary':
        return (
          <BoundaryComponent
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
        draggable={false}
      >
        <Layer>
          {/* Background Image - render behind boundary */}
          {backgroundImage && (() => {
            // Find the boundary to get dimensions
            const boundary = canvasObjects.find(
              (obj) => obj.type === 'floorplan_boundary'
            ) as BoundaryObject | undefined;

            if (boundary) {
              return (
                <KonvaImage
                  image={backgroundImage}
                  x={boundary.x}
                  y={boundary.y}
                  width={boundary.width}
                  height={boundary.height}
                  listening={false}
                  opacity={0.7}
                />
              );
            }
            return null;
          })()}

          {/* Render all canvas objects */}
          {canvasObjects.map((obj) => renderObject(obj))}
        </Layer>
      </Stage>

      {/* Ruler Overlay */}
      {!readonly && <RulerOverlay />}
    </div>
  );
};
