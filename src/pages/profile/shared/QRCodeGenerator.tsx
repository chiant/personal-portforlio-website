import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  url, 
  size = 120, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch((error) => {
        console.error('Error generating QR code:', error);
      });
    }
  }, [url, size]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 dark:border-gray-600 rounded-lg"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default QRCodeGenerator;
