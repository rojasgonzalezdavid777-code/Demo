export const mapStyles = `
<style>
  body { margin: 0; padding: 0; overflow: hidden; }
  #map { height: 100vh; width: 100vw; background: #f0f0f0; }
  
  .sitp-marker {
    background: #0056b3 !important;
    width: 40px !important; 
    height: 40px !important;
    border: 3px solid white !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.4) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    position: relative !important;
  }

  .sitp-marker::after {
    content: '' !important;
    position: absolute !important;
    bottom: -12px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    border-left: 9px solid transparent !important;
    border-right: 9px solid transparent !important;
    border-top: 12px solid white !important;
  }

  .user-dot { background: #4285F4; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; }
</style>
`;