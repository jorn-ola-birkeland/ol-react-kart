import React, { useEffect, useRef, useState } from 'react';
import  MapApi  from '../MapCore/mapCore';
import projectConfig from '../norgeskart.json';
import { useEventStoreSelector } from '../MapCore/Events/Event/eventHooks';
import { clickCoordinates } from '../MapCore/Events/getClickCoordinatesSlice';
import { mapMoveEndCoordinates } from '../MapCore/Events/mapMoveSlice';

const MapTest = () => {
  const [showLayer1, setShowLayer1] = useState(false);
  const [mapInit, setMapInit] = useState(false);
  const clickedCoordiantes = useEventStoreSelector(clickCoordinates);
  const mapMoveEnd = useEventStoreSelector(mapMoveEndCoordinates);

  const mapApi = MapApi();
  useEffect(() => {
    if (!mapInit) {
      mapApi.init(projectConfig);
      setMapInit(true);
    }
  },[mapInit, mapApi])

  useEffect(() => {
    if (showLayer1) {
      mapApi.showLayer();
    }
  }, [showLayer1, mapApi])

  const handleShowLayer1 = (event: React.ChangeEvent<HTMLInputElement>): void => setShowLayer1(event.target.checked);

  return (
    <>
      {/* <div>
        <input type="checkbox" checked={showLayer1} onChange={handleShowLayer1}/> Ringve botaniske
      </div> */}
      <div className='p-2'>
        <div><h4>Only for test: </h4></div>
        <div>Clicked coordinates: {clickedCoordiantes.coordinate[0]}, {clickedCoordiantes.coordinate[1]}</div>
        <div>Map move end center coordinates: {mapMoveEnd.coordinates}</div>
      </div>
      <div id="map" className='ol-map'></div>
     </>
  );
}

export default MapTest;