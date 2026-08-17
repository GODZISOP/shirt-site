'use client';

import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface DesignerCanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  width?: number;
  height?: number;
}

export default function DesignerCanvas({
  onCanvasReady,
  width = 500,
  height = 600,
}: DesignerCanvasProps) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasElRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      selection: true,
      renderOnAddRemove: true,
    });

    canvasInstanceRef.current = canvas;
    onCanvasReady(canvas);

    return () => {
      canvas.dispose();
      canvasInstanceRef.current = null;
    };
  }, [width, height, onCanvasReady]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas ref={canvasElRef} width={width} height={height} />
    </div>
  );
}
