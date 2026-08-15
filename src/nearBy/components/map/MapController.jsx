import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { getSafeCenter } from '../../utils/mapUtils';

export const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => { 
    const safeCoords = getSafeCenter(center);
    map.flyTo(safeCoords, 13, { duration: 1.5 }); 
  }, [center, map]);
  return null;
};