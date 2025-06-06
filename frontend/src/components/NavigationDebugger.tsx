import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🚀 NavigationDebugger - Location changed:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  useEffect(() => {
    // Track clicks on all Link elements
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const linkElement = target.closest('a');
      
      if (linkElement) {
        console.log('🔗 Link clicked:', {
          href: linkElement.href,
          pathname: linkElement.pathname,
          text: linkElement.textContent?.trim(),
          tagName: target.tagName,
          className: target.className,
          timestamp: new Date().toISOString()
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>Current Route: {location.pathname}</div>
      <div>Search: {location.search}</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default NavigationDebugger; 