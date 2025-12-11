/**
 * Export Hook
 * Manages export state and operations
 */

import { useState, useCallback } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { ExportService, type ExportOptions } from '@/services/export';

export const useExport = () => {
  const { canvas } = useFloorplanStore();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(
    async (options: ExportOptions) => {
      if (!canvas) {
        setError('Canvas not available');
        return;
      }

      setIsExporting(true);
      setError(null);

      try {
        // Perform export
        ExportService.export(canvas, options);

        // Success - export happens via download, no further action needed
      } catch (err) {
        console.error('Export failed:', err);
        setError(err instanceof Error ? err.message : 'Export failed');
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    [canvas]
  );

  const exportPNG = useCallback(() => {
    if (!canvas) return;
    handleExport({ format: 'png', scale: 2 });
  }, [canvas, handleExport]);

  const exportJPEG = useCallback(() => {
    if (!canvas) return;
    handleExport({ format: 'jpeg', quality: 0.9, scale: 2 });
  }, [canvas, handleExport]);

  const exportPDF = useCallback(() => {
    if (!canvas) return;
    handleExport({ format: 'pdf', paperSize: 'a4', orientation: 'landscape' });
  }, [canvas, handleExport]);

  return {
    handleExport,
    exportPNG,
    exportJPEG,
    exportPDF,
    isExporting,
    error,
  };
};
