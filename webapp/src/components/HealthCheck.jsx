
import React, { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState({ status: 'ok', timestamp: new Date().toISOString() });

  useEffect(() => {
    setHealthStatus({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(healthStatus, null, 2)}
    </pre>
  );
};

export default HealthCheck;
