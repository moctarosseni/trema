
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const MOVEMENT_THRESHOLD = 0.01;
export const DEFAUlT_POSITION = {
    lat: 48.8566, // Paris
    lng: 2.3522 // Paris
};
export const DEFAULT_BOUNDS = {
    north: DEFAUlT_POSITION.lat + MOVEMENT_THRESHOLD,
    south: DEFAUlT_POSITION.lat - MOVEMENT_THRESHOLD,
    east: DEFAUlT_POSITION.lng + MOVEMENT_THRESHOLD,      
    west: DEFAUlT_POSITION.lng - MOVEMENT_THRESHOLD
};