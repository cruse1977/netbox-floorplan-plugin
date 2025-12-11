/**
 * Export Service
 * Handles exporting canvas to various formats (PNG, JPEG, PDF)
 */

import type Konva from 'konva';
import jsPDF from 'jspdf';

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'pdf';
  quality?: number; // 0.5 - 1.0 for JPEG
  scale?: number; // 1x, 2x, 3x for raster formats
  paperSize?: 'a4' | 'a3' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  filename?: string;
}

export class ExportService {
  /**
   * Reset stage view for export
   */
  private static resetStageView(stage: Konva.Stage): {
    scale: { x: number; y: number };
    position: { x: number; y: number };
  } {
    const currentScale = { x: stage.scaleX(), y: stage.scaleY() };
    const currentPosition = { x: stage.x(), y: stage.y() };

    // Reset to 1:1 zoom and 0,0 position
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });

    return { scale: currentScale, position: currentPosition };
  }

  /**
   * Restore stage view after export
   */
  private static restoreStageView(
    stage: Konva.Stage,
    saved: { scale: { x: number; y: number }; position: { x: number; y: number } }
  ): void {
    stage.scale(saved.scale);
    stage.position(saved.position);
  }

  /**
   * Get the bounding box of all content on the stage
   */
  private static getContentBounds(stage: Konva.Stage): { x: number; y: number; width: number; height: number } | null {
    // Find all shapes in all layers
    const allShapes: Konva.Node[] = [];
    stage.getLayers().forEach(layer => {
      layer.getChildren().forEach(child => {
        allShapes.push(child);
      });
    });

    if (allShapes.length === 0) {
      return null;
    }

    // Calculate bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    allShapes.forEach(shape => {
      const box = shape.getClientRect();
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Export canvas to PNG
   */
  static exportPNG(
    stage: Konva.Stage,
    options: { scale?: number; filename?: string } = {}
  ): void {
    try {
      const { scale = 2, filename = 'floorplan.png' } = options;

      // Save current view and reset
      const savedView = this.resetStageView(stage);

      // Get content bounds
      const bounds = this.getContentBounds(stage);

      // Export stage as PNG data URL with pixel ratio for quality
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        pixelRatio: scale,
        x: bounds?.x || 0,
        y: bounds?.y || 0,
        width: bounds?.width || stage.width(),
        height: bounds?.height || stage.height(),
      });

      // Restore view
      this.restoreStageView(stage, savedView);

      // Convert data URL to blob and download
      this.downloadDataURL(dataURL, filename);
    } catch (error) {
      console.error('PNG export failed:', error);
      throw new Error('Failed to export PNG');
    }
  }

  /**
   * Export canvas to JPEG
   */
  static exportJPEG(
    stage: Konva.Stage,
    options: { quality?: number; scale?: number; filename?: string } = {}
  ): void {
    try {
      const { quality = 0.9, scale = 2, filename = 'floorplan.jpg' } = options;

      // Save current view and reset
      const savedView = this.resetStageView(stage);

      // Get content bounds
      const bounds = this.getContentBounds(stage);

      // Export stage as JPEG data URL
      const dataURL = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality,
        pixelRatio: scale,
        x: bounds?.x || 0,
        y: bounds?.y || 0,
        width: bounds?.width || stage.width(),
        height: bounds?.height || stage.height(),
      });

      // Restore view
      this.restoreStageView(stage, savedView);

      // Convert data URL to blob and download
      this.downloadDataURL(dataURL, filename);
    } catch (error) {
      console.error('JPEG export failed:', error);
      throw new Error('Failed to export JPEG');
    }
  }

  /**
   * Export canvas to PDF
   */
  static exportPDF(
    stage: Konva.Stage,
    options: {
      paperSize?: 'a4' | 'a3' | 'letter' | 'legal';
      orientation?: 'portrait' | 'landscape';
      filename?: string;
    } = {}
  ): void {
    try {
      const {
        paperSize = 'a4',
        orientation = 'landscape',
        filename = 'floorplan.pdf',
      } = options;

      // Save current view and reset
      const savedView = this.resetStageView(stage);

      // Get content bounds
      const bounds = this.getContentBounds(stage);
      const contentWidth = bounds?.width || stage.width();
      const contentHeight = bounds?.height || stage.height();

      // Get paper dimensions in mm
      const paperDimensions = this.getPaperDimensions(paperSize);
      const isPortrait = orientation === 'portrait';
      const pageWidth = isPortrait ? paperDimensions.width : paperDimensions.height;
      const pageHeight = isPortrait ? paperDimensions.height : paperDimensions.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: paperSize,
      });

      // Calculate scaling to fit page (with margins)
      const margin = 10; // 10mm margins
      const availableWidth = pageWidth - 2 * margin;
      const availableHeight = pageHeight - 2 * margin;

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY);

      // Calculate centered position
      const scaledWidth = contentWidth * scale;
      const scaledHeight = contentHeight * scale;
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      // Export stage as PNG data URL for PDF
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        pixelRatio: 2, // Higher quality for PDF
        x: bounds?.x || 0,
        y: bounds?.y || 0,
        width: contentWidth,
        height: contentHeight,
      });

      // Restore view
      this.restoreStageView(stage, savedView);

      // Add image to PDF
      pdf.addImage(dataURL, 'PNG', x, y, scaledWidth, scaledHeight);

      // Save PDF
      pdf.save(filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF');
    }
  }

  /**
   * Universal export method
   */
  static export(stage: Konva.Stage, options: ExportOptions): void {
    const timestamp = this.getTimestamp();
    const filename = options.filename || `floorplan-${timestamp}`;

    switch (options.format) {
      case 'png':
        this.exportPNG(stage, {
          scale: options.scale || 2,
          filename: `${filename}.png`,
        });
        break;

      case 'jpeg':
        this.exportJPEG(stage, {
          quality: options.quality || 0.9,
          scale: options.scale || 2,
          filename: `${filename}.jpg`,
        });
        break;

      case 'pdf':
        this.exportPDF(stage, {
          paperSize: options.paperSize || 'a4',
          orientation: options.orientation || 'landscape',
          filename: `${filename}.pdf`,
        });
        break;

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Get paper dimensions in mm
   */
  private static getPaperDimensions(paperSize: string): { width: number; height: number } {
    const dimensions: Record<string, { width: number; height: number }> = {
      a4: { width: 210, height: 297 },
      a3: { width: 297, height: 420 },
      letter: { width: 215.9, height: 279.4 },
      legal: { width: 215.9, height: 355.6 },
    };

    return dimensions[paperSize] || dimensions.a4;
  }

  /**
   * Download data URL as file
   */
  private static downloadDataURL(dataURL: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Generate timestamp for filename
   */
  private static getTimestamp(): string {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);
  }
}
