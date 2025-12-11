/**
 * Background Image Modal Component
 * Allows selecting a background image for the floorplan
 */

import React, { useState, useEffect } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { apiClient } from '@/services/api';
import type { FloorplanImage } from '@/types/floorplan';

interface BackgroundImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundImageModal: React.FC<BackgroundImageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { floorplan, updateBackground } = useFloorplanStore();
  const [images, setImages] = useState<FloorplanImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available images
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  // Set initial selected image from floorplan
  useEffect(() => {
    if (floorplan?.assigned_image) {
      setSelectedImageId(floorplan.assigned_image.id);
    } else {
      setSelectedImageId(null);
    }
  }, [floorplan]);

  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ results: FloorplanImage[] }>('/floorplanimages/');
      setImages(response.results || []);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateBackground(selectedImageId);
      onClose();
    } catch (err: any) {
      console.error('Failed to update background:', err);
      console.error('Error details:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || err.response?.data?.assigned_image?.[0] || err.message || 'Failed to update background image';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    setSelectedImageId(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Set Background Image</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSaving}
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Select Image</label>
                  <select
                    className="form-select"
                    value={selectedImageId || ''}
                    onChange={(e) =>
                      setSelectedImageId(e.target.value ? parseInt(e.target.value) : null)
                    }
                  >
                    <option value="">None (No background)</option>
                    {images.map((image) => (
                      <option key={image.id} value={image.id}>
                        {image.name} - {image.filename}
                      </option>
                    ))}
                  </select>
                  <small className="form-text text-muted">
                    Background image will be scaled to match the floorplan boundary
                  </small>
                </div>

                {selectedImageId && (
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemove}
                    >
                      Remove Background
                    </button>
                  </div>
                )}

                {images.length === 0 && (
                  <div className="alert alert-info">
                    No images available. Upload images through the NetBox admin interface.
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
