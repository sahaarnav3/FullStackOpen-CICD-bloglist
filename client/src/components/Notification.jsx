import Alert from '@mui/material/Alert';
import { useNotificationData } from '../stores/NotificationStore';

export default function Notification() {
  const { message, severity } = useNotificationData();
  if (message === null) return null;

  return (
    <Alert severity={severity} sx={{ marginTop: '15px' }}>
      {message}
    </Alert>
  );
}
