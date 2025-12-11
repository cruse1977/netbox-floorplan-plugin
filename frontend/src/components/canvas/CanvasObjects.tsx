/**
 * Canvas Objects Components
 * React-Konva components for rendering different object types
 */

import React from 'react';
import { Rect, Text, Group } from 'react-konva';
import type {
  WallObject,
  AreaObject,
  LabelObject,
  RackObject,
  DeviceObject,
  BoundaryObject,
} from '@/utils/konvaHelpers';

interface ObjectProps<T> {
  object: T;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: any) => void;
}

// Wall Component
export const WallComponent: React.FC<ObjectProps<WallObject>> = ({
  object,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  return (
    <Rect
      id={object.id}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      fill={object.fill}
      stroke={isSelected ? '#0066ff' : object.stroke}
      strokeWidth={isSelected ? 3 : object.strokeWidth}
      draggable={object.draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
    />
  );
};

// Area Component
export const AreaComponent: React.FC<ObjectProps<AreaObject>> = ({
  object,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  return (
    <Rect
      id={object.id}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      fill={object.fill}
      stroke={isSelected ? '#0066ff' : object.stroke}
      strokeWidth={isSelected ? 3 : object.strokeWidth}
      opacity={object.opacity}
      draggable={object.draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
    />
  );
};

// Label Component
export const LabelComponent: React.FC<ObjectProps<LabelObject>> = ({
  object,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  return (
    <Text
      id={object.id}
      x={object.x}
      y={object.y}
      text={object.text}
      fontSize={object.fontSize}
      fill={object.fill}
      fontFamily={object.fontFamily}
      draggable={object.draggable}
      stroke={isSelected ? '#0066ff' : undefined}
      strokeWidth={isSelected ? 1 : 0}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
    />
  );
};

// Rack Component (Simple and Advanced)
export const RackComponent: React.FC<ObjectProps<RackObject>> = ({
  object,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  const labels = object.labels;
  const lineHeight = 14;

  // Calculate Y positions upfront
  let yOffset = 5;
  const nameY = yOffset;
  yOffset += lineHeight;
  const statusY = yOffset;
  if (labels.status) yOffset += lineHeight;
  const roleY = yOffset;
  if (labels.role) yOffset += lineHeight;
  const tenantY = yOffset;

  return (
    <Group
      id={object.id}
      x={object.x}
      y={object.y}
      draggable={object.draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
    >
      {/* Rack rectangle */}
      <Rect
        width={object.width}
        height={object.height}
        fill={object.fill}
        stroke={isSelected ? '#0066ff' : object.stroke}
        strokeWidth={isSelected ? 3 : object.strokeWidth}
      />

      {/* Name label */}
      <Text
        x={5}
        y={nameY}
        text={labels.name}
        fontSize={12}
        fill="#ffffff"
        fontStyle="bold"
      />

      {/* Status label */}
      {labels.status && (
        <Text
          x={5}
          y={statusY}
          text={`Status: ${labels.status}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}

      {/* Role label */}
      {labels.role && (
        <Text
          x={5}
          y={roleY}
          text={`Role: ${labels.role}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}

      {/* Tenant label */}
      {labels.tenant && (
        <Text
          x={5}
          y={tenantY}
          text={`Tenant: ${labels.tenant}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}
    </Group>
  );
};

// Device Component (Simple and Advanced)
export const DeviceComponent: React.FC<ObjectProps<DeviceObject>> = ({
  object,
  isSelected,
  onSelect,
  onDragEnd,
}) => {
  const labels = object.labels;
  const lineHeight = 14;

  // Calculate Y positions upfront
  let yOffset = 5;
  const nameY = yOffset;
  yOffset += lineHeight;
  const statusY = yOffset;
  if (labels.status) yOffset += lineHeight;
  const roleY = yOffset;
  if (labels.role) yOffset += lineHeight;
  const tenantY = yOffset;

  return (
    <Group
      id={object.id}
      x={object.x}
      y={object.y}
      draggable={object.draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
    >
      {/* Device rectangle */}
      <Rect
        width={object.width}
        height={object.height}
        fill={object.fill}
        stroke={isSelected ? '#0066ff' : object.stroke}
        strokeWidth={isSelected ? 3 : object.strokeWidth}
      />

      {/* Name label */}
      <Text
        x={5}
        y={nameY}
        text={labels.name}
        fontSize={12}
        fill="#ffffff"
        fontStyle="bold"
      />

      {/* Status label */}
      {labels.status && (
        <Text
          x={5}
          y={statusY}
          text={`Status: ${labels.status}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}

      {/* Role label */}
      {labels.role && (
        <Text
          x={5}
          y={roleY}
          text={`Role: ${labels.role}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}

      {/* Tenant label */}
      {labels.tenant && (
        <Text
          x={5}
          y={tenantY}
          text={`Tenant: ${labels.tenant}`}
          fontSize={10}
          fill="#ffffff"
        />
      )}
    </Group>
  );
};

// Boundary Component
export const BoundaryComponent: React.FC<ObjectProps<BoundaryObject>> = ({
  object,
}) => {
  return (
    <Rect
      id={object.id}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      draggable={false}
      listening={false}
      dash={[10, 5]}
    />
  );
};
