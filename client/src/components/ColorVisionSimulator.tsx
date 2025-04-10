import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
import { ColorVisionType } from '../types/user';
import {
  simulateColorVision,
  simulateImageColorVision,
  isColorCombinationAccessible,
} from '../utils/colorVisionUtils';

interface ColorVisionSimulatorProps {
  defaultColorVisionType?: ColorVisionType;
}

const ColorVisionSimulator: React.FC<ColorVisionSimulatorProps> = ({
  defaultColorVisionType = 'normal',
}) => {
  const [colorVisionType, setColorVisionType] = useState<ColorVisionType>(defaultColorVisionType);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [imageUrl, setImageUrl] = useState('');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const colorVisionTypes: { value: ColorVisionType; label: string }[] = [
    { value: 'normal', label: '정상 시야' },
    { value: 'protanopia', label: '1형 색각이상 (적색맹)' },
    { value: 'deuteranopia', label: '2형 색각이상 (녹색맹)' },
    { value: 'tritanopia', label: '3형 색각이상 (청색맹)' },
    { value: 'monochromacy', label: '전색맹' },
  ];

  useEffect(() => {
    const simulateForeground = simulateColorVision(foregroundColor, colorVisionType);
    const simulateBackground = simulateColorVision(backgroundColor, colorVisionType);

    if (imageUrl) {
      simulateImageColorVision(imageUrl, colorVisionType)
        .then(setSimulatedImageUrl)
        .catch((err) => setError('이미지를 처리하는 중 오류가 발생했습니다.'));
    }
  }, [colorVisionType, foregroundColor, backgroundColor, imageUrl]);

  const isAccessible = isColorCombinationAccessible(
    foregroundColor,
    backgroundColor,
    colorVisionType
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          색각이상 시뮬레이터
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>색각이상 유형</InputLabel>
          <Select
            value={colorVisionType}
            onChange={(e) => setColorVisionType(e.target.value as ColorVisionType)}
            label="색각이상 유형"
          >
            {colorVisionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="전경색"
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              sx={{ '& input': { height: 50 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="배경색"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              sx={{ '& input': { height: 50 } }}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 2,
            p: 2,
            color: simulateColorVision(foregroundColor, colorVisionType),
            bgcolor: simulateColorVision(backgroundColor, colorVisionType),
            borderRadius: 1,
          }}
        >
          <Typography>
            이 텍스트는 선택한 색각이상 유형에서 보이는 모습입니다.
          </Typography>
        </Box>

        {!isAccessible && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            선택한 색상 조합은 WCAG 2.1 Level AA 기준을 충족하지 않습니다.
            더 높은 대비를 가진 색상을 선택해주세요.
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            이미지 시뮬레이션
          </Typography>
          <TextField
            fullWidth
            label="이미지 URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            margin="normal"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          {simulatedImageUrl && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    원본 이미지
                  </Typography>
                  <img
                    src={imageUrl}
                    alt="Original"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    시뮬레이션 이미지
                  </Typography>
                  <img
                    src={simulatedImageUrl}
                    alt="Simulated"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ColorVisionSimulator; 