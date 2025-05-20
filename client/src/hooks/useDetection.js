import { useSelector, useDispatch } from 'react-redux';

export const useDetection = () => {
  const detections = useSelector(state => state.detections.detections);
  const notifications = useSelector(state => state.detections.notifications);
  const currentSeverity = useSelector(state => state.detections.currentSeverity);
  const dispatch = useDispatch();

  return {
    detections,
    notifications,
    currentSeverity,
    addDetection: (detection) => dispatch(addDetection(detection)),
    updateSeverity: (severity) => dispatch(updateSeverity(severity)),
    addNotification: (notification) => dispatch(addNotification(notification)),
    clearNotifications: () => dispatch(clearNotifications())
  };
};