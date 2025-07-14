"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: Array<{ x: number; y: number }>;
  format: string;
  rawValue: string;
}

interface UseBarcodeDetectorOptions {
  formats?: string[];
}

interface UseBarcodeDetectorReturn {
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
  isSupported: boolean;
  supportedFormats: string[];
  isDetecting: boolean;
  error: string | null;
}

export const useBarcodeDetector = (
  options: UseBarcodeDetectorOptions = {}
): UseBarcodeDetectorReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);
  const detectorRef = useRef<any | null>(null);

  const isSupported =
    typeof window !== "undefined" && "BarcodeDetector" in window;

  useEffect(() => {
    if (!isSupported) return;

    const initializeDetector = async () => {
      try {
        // Get supported formats
        const formats = await (
          window as any
        ).BarcodeDetector.getSupportedFormats();
        setSupportedFormats(formats);

        // Create detector with specified formats or all supported formats
        const detectorFormats = options.formats || formats;
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: detectorFormats,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize barcode detector"
        );
      }
    };

    initializeDetector();
  }, [isSupported, options.formats]);

  const detect = useCallback(
    async (source: ImageBitmapSource): Promise<DetectedBarcode[]> => {
      if (!isSupported || !detectorRef.current) {
        throw new Error("Barcode detection is not supported");
      }

      setIsDetecting(true);
      setError(null);

      try {
        const barcodes = await detectorRef.current.detect(source);
        return barcodes.map((barcode: any) => ({
          boundingBox: barcode.boundingBox,
          cornerPoints: barcode.cornerPoints,
          format: barcode.format,
          rawValue: barcode.rawValue,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Detection failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsDetecting(false);
      }
    },
    [isSupported]
  );

  return {
    detect,
    isSupported,
    supportedFormats,
    isDetecting,
    error,
  };
};

export default useBarcodeDetector;
