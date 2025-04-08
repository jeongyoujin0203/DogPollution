import React, { useEffect } from 'react';

interface MapProps {
    center: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ center }) => {
    useEffect(() => {
        if (document.getElementById('kakao-map-script')) return;

        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(center.lat, center.lng),
                    level: 3,
                };

                const map = new window.kakao.maps.Map(container, options);
                new window.kakao.maps.Marker({
                    map,
                    position: new window.kakao.maps.LatLng(center.lat, center.lng),
                });
            });
        };

        return () => {
            const existingScript = document.getElementById('kakao-map-script');
            if (existingScript) existingScript.remove();
        };
    }, [center]);

    return <div id="map" className="w-full h-full" />;
};

export default Map;