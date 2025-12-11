/**
 * Export Dialog Component
 * Modal for configuring and exporting floorplan in various formats
 */

import React, { useState } from 'react';
import type { ExportOptions } from '@/services/export';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'pdf'>('png');
  const [quality, setQuality] = useState(90); // 0-100 for UI
  const [scale, setScale] = useState(2); // 1x, 2x, 3x
  const [paperSize, setPaperSize] = useState<'a4' | 'a3' | 'letter' | 'legal'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [filename, setFilename] = useState('');

  const handleExport = () => {
    const options: ExportOptions = {
      format,
      quality: quality / 100, // Convert 0-100 to 0-1
      scale,
      paperSize,
      orientation,
      filename: filename || undefined,
    };

    onExport(options);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Export Floorplan</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info">
                <strong>Tip:</strong> Choose your export format and customize settings below.
              </div>

              {/* Format Selection */}
              <div className="mb-3">
                <label className="form-label">Export Format</label>
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 ${format === 'png' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFormat('png')}
                    >
                      PNG (Raster)
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 ${format === 'jpeg' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFormat('jpeg')}
                    >
                      JPEG (Compressed)
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 ${format === 'pdf' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFormat('pdf')}
                    >
                      PDF (Document)
                    </button>
                  </div>
                </div>
              </div>

              {/* JPEG Quality */}
              {format === 'jpeg' && (
                <div className="mb-3">
                  <label htmlFor="jpeg-quality" className="form-label">
                    JPEG Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="jpeg-quality"
                    min="50"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                  />
                  <small className="form-text text-muted">
                    Higher quality = larger file size
                  </small>
                </div>
              )}

              {/* Raster Scale/Resolution */}
              {(format === 'png' || format === 'jpeg') && (
                <div className="mb-3">
                  <label htmlFor="scale-select" className="form-label">
                    Resolution Scale
                  </label>
                  <select
                    className="form-select"
                    id="scale-select"
                    value={scale}
                    onChange={(e) => setScale(parseInt(e.target.value))}
                  >
                    <option value="1">1x (Standard)</option>
                    <option value="2">2x (High Resolution)</option>
                    <option value="3">3x (Print Quality)</option>
                  </select>
                  <small className="form-text text-muted">
                    Higher scale = larger image dimensions
                  </small>
                </div>
              )}

              {/* PDF Options */}
              {format === 'pdf' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="paper-size" className="form-label">
                      Paper Size
                    </label>
                    <select
                      className="form-select"
                      id="paper-size"
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value as any)}
                    >
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="a3">A3 (297 × 420 mm)</option>
                      <option value="letter">Letter (8.5 × 11 in)</option>
                      <option value="legal">Legal (8.5 × 14 in)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Orientation</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${orientation === 'portrait' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setOrientation('portrait')}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        className={`btn ${orientation === 'landscape' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setOrientation('landscape')}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Filename (Optional) */}
              <div className="mb-3">
                <label htmlFor="filename" className="form-label">
                  Filename (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder={`Leave empty for auto-generated name`}
                />
                <small className="form-text text-muted">
                  Extension will be added automatically
                </small>
              </div>

              {/* Format Info */}
              <div className="alert alert-secondary small mb-0">
                <strong>Format Details:</strong><br />
                {format === 'png' && 'Raster graphics with transparency - best for web'}
                {format === 'jpeg' && 'Compressed raster - smaller files, no transparency'}
                {format === 'pdf' && 'Printable document - scales to fit page with margins'}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExport}
              >
                <i className="mdi mdi-download"></i> Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
