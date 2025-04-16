import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
  marginTop: 4,
};

export const filtersStyle: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  marginBottom: 2,
};

export const cardStyle: SxProps<Theme> = {
  marginBottom: 1,
  cursor: 'pointer',
};

export const createButtonStyle: SxProps<Theme> = {
  marginTop: 2,
  alignSelf: 'flex-end',
};

export const emptyStateStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50vh',
};