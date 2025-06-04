// src/types/react-leaflet.d.ts
import * as L from 'leaflet';

declare module 'react-leaflet' {
    export interface MapContainerProps {
        center: L.LatLngExpression;
        zoom: number;
        scrollWheelZoom?: boolean;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }

    export interface GeoJSONProps {
        data: any;
        style?: (feature: any) => L.PathOptions;
        onEachFeature?: (feature: any, layer: any) => void;
        key?: string | number;
    }

    export interface TileLayerProps {
        url: string;
        attribution?: string;
    }
}