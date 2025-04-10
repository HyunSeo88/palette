import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../contexts/AuthContext';
import { ColorVisionType } from '../../types/user';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardProps,
  ChipProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface ColorVisionOption {
  type: ColorVisionType;
  label: string;
  description: string;
}

const colorVisionTypes: ColorVisionOption[] = [
  { 
    type: 'normal',
    label: 'Normal Vision',
    description: 'No color vision deficiency'
  },
  {
    type: 'protanopia',
    label: 'Protanopia',
    description: 'Red-blind color vision deficiency'
  },
  {
    type: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Green-blind color vision deficiency'
  },
  {
    type: 'tritanopia',
    label: 'Tritanopia',
    description: 'Blue-blind color vision deficiency'
  },
  {
    type: 'monochromacy',
    label: 'Complete Color Blindness',
    description: 'Unable to see any colors'
  }
];

interface StyledCardProps extends CardProps {
  selected?: boolean;
}

const StyledCard = styled(Card)<StyledCardProps>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

interface StyledChipProps extends ChipProps {
  selected?: boolean;
}

const StyledChip = styled(Chip)<StyledChipProps>(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  cursor: 'pointer',
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const MotionBox = motion(Box);

const steps = ['Color Vision', 'Style Preferences', 'Interests', 'Color Schemes'];

const styleOptions = [
  'Minimalist',
  'Casual',
  'Streetwear',
  'Formal',
  'Vintage',
  'Bohemian',
  'Athleisure',
  'Business Casual',
];

const interestOptions = [
  'Fashion News',
  'Sustainable Fashion',
  'Trend Analysis',
  'Personal Styling',
  'Brand Reviews',
  'Fashion Events',
  'DIY Fashion',
  'Fashion Technology',
];

const colorSchemeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'High Contrast', value: 'high-contrast' },
  { label: 'Soft', value: 'soft' },
  { label: 'Natural', value: 'natural' },
];

interface OnboardingState {
  selectedColorVision: ColorVisionType | undefined;
  selectedStyles: string[];
  selectedInterests: string[];
  selectedColorSchemes: string[];
}

const initialState: OnboardingState = {
  selectedColorVision: undefined,
  selectedStyles: [],
  selectedInterests: [],
  selectedColorSchemes: [],
};

const Onboarding: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<OnboardingState>(initialState);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      setError(null);
      try {
        const success = await updateProfile({
          colorVisionType: state.selectedColorVision,
          preferences: {
            styles: state.selectedStyles,
            interests: state.selectedInterests,
            colorSchemes: state.selectedColorSchemes,
          },
        });
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to update profile. Please try again.');
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleColorVisionSelect = (colorVision: ColorVisionOption) => {
    setState((prev) => ({
      ...prev,
      selectedColorVision: colorVision.type,
    }));
  };

  const toggleStyle = (style: string) => {
    setState((prev) => ({
      ...prev,
      selectedStyles: prev.selectedStyles.includes(style)
        ? prev.selectedStyles.filter((s) => s !== style)
        : [...prev.selectedStyles, style],
    }));
  };

  const toggleInterest = (interest: string) => {
    setState((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const toggleColorScheme = (scheme: string) => {
    setState((prev) => ({
      ...prev,
      selectedColorSchemes: prev.selectedColorSchemes.includes(scheme)
        ? prev.selectedColorSchemes.filter((s) => s !== scheme)
        : [...prev.selectedColorSchemes, scheme],
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            {colorVisionTypes.map((type) => (
              <Grid item xs={12} sm={6} key={type.type}>
                <StyledCard 
                  selected={state.selectedColorVision === type.type}
                  onClick={() => handleColorVisionSelect(type)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h6">{type.label}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {type.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your style preferences
            </Typography>
            <Grid container spacing={1}>
              {styleOptions.map((style) => (
                <Grid item key={style}>
                  <StyledChip
                    label={style}
                    onClick={() => toggleStyle(style)}
                    selected={state.selectedStyles.includes(style)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your interests
            </Typography>
            <Grid container spacing={1}>
              {interestOptions.map((interest) => (
                <Grid item key={interest}>
                  <StyledChip
                    label={interest}
                    onClick={() => toggleInterest(interest)}
                    selected={state.selectedInterests.includes(interest)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your preferred color schemes
            </Typography>
            <Grid container spacing={1}>
              {colorSchemeOptions.map((scheme) => (
                <Grid item key={scheme.value}>
                  <StyledChip
                    label={scheme.label}
                    onClick={() => toggleColorScheme(scheme.value)}
                    selected={state.selectedColorSchemes.includes(scheme.value)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return Boolean(state.selectedColorVision);
      case 1:
        return state.selectedStyles.length > 0;
      case 2:
        return state.selectedInterests.length > 0;
      case 3:
        return state.selectedColorSchemes.length > 0;
      default:
        return false;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to Palette!
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Let's personalize your experience
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ margin: '40px 0' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>
        {getStepContent(activeStep)}
      </Box>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!isStepValid(activeStep) || loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            'Finish'
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default Onboarding; 