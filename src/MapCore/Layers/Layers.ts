import { ITileLayer } from '../Models/config-model';
import { WMTS, TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { wmtsTileGrid } from '../TileGrid/wmts';
import { getTopLeft, getWidth } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { useEventSelector } from '../../index';
import { selectToken } from '../Project/projectSlice';

const sProjection = 'EPSG:25833';
const extent = {
  'EPSG:3857': [-20037508.34, -20037508.34, 20037508.34, 20037508.34] as [number, number, number, number],
  'EPSG:25833': [-2500000, 3500000, 3045984, 9045984] as [number, number, number, number],
};
const projection = new Projection({
  code: sProjection,
  extent: extent[sProjection],
});

const projectionExtent = projection.getExtent();
const size = getWidth(projectionExtent) / 256;

const resolutions = [];
const matrixIds = [];

for (let z = 0; z < 21; ++z) {
  //Max 18?
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = String(z);
}


const tileGrid = wmtsTileGrid({
  origin: getTopLeft(projection.getExtent()),
  resolutions: resolutions,
  matrixIds: matrixIds,
});

export const Layers = function () {
  return {
    createTileLayer(layer: ITileLayer, token: string): TileLayer | undefined {
      if (layer.source === 'WMTS') {
        let tokenUrl = '';
        if (layer.gatekeeper === 'true') {
          tokenUrl = layer.url + '&gkt=' + token;
        }
        console.log('TOKEN URL: ', tokenUrl, layer.gatekeeper, token);
        const newTileLayer = new TileLayer({
          source: new WMTS({
            url: tokenUrl ? tokenUrl : layer.url,
            layer: layer.params.layers ? layer.params.layers : '',
            matrixSet: layer.matrixset ? layer.matrixset : sProjection,
            projection: projection,
            tileGrid: tileGrid,
            style: 'default',
            format: layer.params.format,
          })
        });
        
        return newTileLayer;
      }
      if (layer.source === 'WMS') {
        const newTileLayer = new TileLayer({
          source: new TileWMS({
            url: layer.url,
            params: layer.params,
            projection: projection,
          })
        });
        return newTileLayer;
      }
    },
    updateLayerParams(layer: TileLayer, token: string) {
      const source = layer.getSource() as WMTS;
      const urls = source.getUrls();
      const newUrls: string[] = [];
      urls?.forEach(u => {
        // if (u.indexOf('gkt') )
        const newUrl = u.replace(/gkt=[^&?$]*/, 'gkt=' + token);
        newUrls.push(newUrl);
      })
      if (newUrls.length > 0) {
        source.setUrls(newUrls);
      }
      
      // sourceUrl = sourceUrl + '&GKT=' + token;
      
    }
    
  }
}