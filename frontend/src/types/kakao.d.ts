declare namespace kakao {
    namespace maps {
        class LatLng {
            constructor(lat: number, lng: number);
        }
        class Map {
            constructor(container: HTMLElement, options: { center: LatLng; level: number });
            setCenter(coords: LatLng): void;
        }
        class Marker {
            constructor(options: { map: Map; position: LatLng; title?: string });
            setMap(map: Map | null): void;
        }
        namespace services {
            class Geocoder {
                addressSearch(
                    address: string,
                    callback: (result: any[], status: string) => void
                ): void;
            }
            enum Status {
                OK = 'OK',
                ERROR = 'ERROR',
            }
        }
        function load(callback: () => void): void;
    }
}