import { Chip } from '@mui/material';
import { useDetection } from '../../contexts/DetectionContext';

const SeverityIndicator = () => {
  const { currentSeverity } = useDetection();
  
  const getColor = () => {
    switch(currentSeverity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Chip
      label={`Severity: ${currentSeverity || 'none'}`}
      color={getColor()}
      variant="outlined"
    />
  );
};

export default SeverityIndicator;