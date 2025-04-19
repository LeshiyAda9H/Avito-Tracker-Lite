import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
  padding: 3,
  flexGrow: 1,
};

export const filtersStyle: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  marginBottom: 3,
};

export const cardStyle: SxProps<Theme> = {
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};

export const createButtonStyle: SxProps<Theme> = {
  alignSelf: 'flex-end',
  marginTop: 2,
};

export const emptyStateStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50vh',
};