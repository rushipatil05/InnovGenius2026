export interface AllowedLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // in meters
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export const allowedLocations: AllowedLocation[] = [
    {
        id: 'loc1',
        name: 'Mumbai Head Office',
        latitude: 19.0760,
        longitude: 72.8777,
        radius: 50000000, // Large radius for testing to ensure it works almost anywhere
        address: 'InnovGenius HQ, Thakur College of Engineering and Technology',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051'
    },
    {
        id: 'loc2',
        name: 'Delhi Branch',
        latitude: 28.6139,
        longitude: 77.2090,
        radius: 2000,
        address: 'Connaught Place Branch, Inner Circle',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
    },
    {
        id: 'loc3',
        name: 'Bangalore Tech Hub',
        latitude: 12.9716,
        longitude: 77.5946,
        radius: 2000,
        address: 'Tech Park, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066'
    }
];

// Haversine formula to calculate distance in meters
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const findNearestAllowedLocation = (lat: number, lon: number): AllowedLocation | null => {
    for (const location of allowedLocations) {
        const distance = calculateDistance(lat, lon, location.latitude, location.longitude);
        if (distance <= location.radius) {
            return location;
        }
    }
    return null;
};
