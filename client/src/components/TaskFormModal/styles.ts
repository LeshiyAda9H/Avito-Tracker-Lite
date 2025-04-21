import { SxProps, Theme } from '@mui/material';

export const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const formStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const buttonContainerStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 1,
};

export const goToBoardButtonStyle: SxProps<Theme> = {
  alignSelf: 'flex-start',
};