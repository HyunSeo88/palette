import { ColorVisionType } from '../types/user';

// RGB to LMS conversion matrix
const RGB_TO_LMS = [
  [17.8824, 43.5161, 4.11935],
  [3.45565, 27.1554, 3.86714],
  [0.0299566, 0.184309, 1.46709]
];

// LMS to RGB conversion matrix
const LMS_TO_RGB = [
  [0.0809444479, -0.130504409, 0.116721066],
  [-0.0102485335, 0.0540193266, -0.113614708],
  [-0.000365296938, -0.00412161469, 0.693511405]
];

// Simulation matrices for different color vision types
const SIMULATION_MATRICES = {
  protanopia: [
    [0, 2.02344, -2.52581],
    [0, 1, 0],
    [0, 0, 1]
  ],
  deuteranopia: [
    [1, 0, 0],
    [0.494207, 0, 1.24827],
    [0, 0, 1]
  ],
  tritanopia: [
    [1, 0, 0],
    [0, 1, 0],
    [-0.395913, 0.801109, 0]
  ],
  monochromacy: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ]
};

// Matrix multiplication helper
const multiplyMatrices = (a: number[][], b: number[][]): number[][] => {
  return a.map((row) => {
    return b[0].map((_, colIndex) => {
      return row.reduce((sum, cell, i) => {
        return sum + cell * b[i][colIndex];
      }, 0);
    });
  });
};

// Convert RGB color to simulated color
export const simulateColorVision = (
  color: string,
  type: ColorVisionType
): string => {
  if (type === 'normal') return color;

  // Parse RGB values
  const rgb = color.startsWith('#')
    ? [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      ]
    : color
        .match(/\d+/g)
        ?.map(Number)
        .slice(0, 3) || [0, 0, 0];

  // Convert RGB to LMS
  const lms = multiplyMatrices([rgb], RGB_TO_LMS)[0];

  // Apply simulation matrix
  const simulatedLms = multiplyMatrices(
    [lms],
    SIMULATION_MATRICES[type] || SIMULATION_MATRICES.monochromacy
  )[0];

  // Convert back to RGB
  const simulatedRgb = multiplyMatrices([simulatedLms], LMS_TO_RGB)[0];

  // Clamp values and convert to hex
  const clampedRgb = simulatedRgb.map((v) => Math.max(0, Math.min(255, Math.round(v))));
  const hex = clampedRgb
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');

  return `#${hex}`;
};

// Apply color vision simulation to an image
export const simulateImageColorVision = async (
  imageUrl: string,
  type: ColorVisionType
): Promise<string> => {
  if (type === 'normal') return imageUrl;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Process each pixel
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const simulatedColor = simulateColorVision(`rgb(${r},${g},${b})`, type);
        const [sr, sg, sb] = simulatedColor
          .slice(1)
          .match(/.{2}/g)!
          .map((hex) => parseInt(hex, 16));

        pixels[i] = sr;
        pixels[i + 1] = sg;
        pixels[i + 2] = sb;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

// Helper function to determine if a color combination is accessible
export const isColorCombinationAccessible = (
  foreground: string,
  background: string,
  type: ColorVisionType
): boolean => {
  const simulatedFg = simulateColorVision(foreground, type);
  const simulatedBg = simulateColorVision(background, type);

  // Calculate relative luminance
  const getLuminance = (color: string): number => {
    const rgb = color
      .slice(1)
      .match(/.{2}/g)!
      .map((hex) => {
        const value = parseInt(hex, 16) / 255;
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(simulatedFg);
  const l2 = getLuminance(simulatedBg);

  // Calculate contrast ratio
  const contrastRatio =
    (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text
  return contrastRatio >= 4.5;
}; 