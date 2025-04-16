import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
  marginTop: 4,
};

export const boardStyle: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
};

export const columnStyle: SxProps<Theme> = {
  width: 300,
};

export const droppableStyle: SxProps<Theme> = {
  backgroundColor: '#f0f0f0',
  padding: 2,
  minHeight: 200,
};

export const cardStyle: SxProps<Theme> = {
  marginBottom: 1,
};