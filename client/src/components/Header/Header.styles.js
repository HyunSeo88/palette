import { styled, alpha } from '@mui/material/styles';
import { Box, InputBase } from '@mui/material';

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3, // More rounded
  backgroundColor: alpha(theme.palette.grey[500], 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[500], 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  flexGrow: 1,
  maxWidth: '600px', // Limit max width
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
    maxWidth: 'none',
    marginRight: theme.spacing(1),
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export const IconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5), // Adjust gap between icons
  [theme.breakpoints.down('sm')]: {
    // Hide some icons on small screens if necessary
    '& > :not(:first-of-type):not(:last-of-type)': {
      // display: 'none',
    }
  }
})); 