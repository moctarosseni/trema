
export type Place = {
    place_id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    price_level: number | null;
    created_at: string;
    updated_at: string;
    last_google_sync: string;
    google_id: string;
    district: string;
    subtypes: string; // JSON string of array, e.g. '["Local history museum", ...]'
    photo_sample: string[];
    review_count: string;
    verified: boolean;
    business_status: string;
    street_address: string;
    about_summary: string;
    metadata: {
        cid: string;
        tld: string;
        city: string;
        name: string;
        type: string;
        about: {
            details: {
                Crowd?: {
                    "Family-friendly"?: boolean;
                    "LGBTQ+ friendly"?: boolean;
                };
                Children?: {
                    "Good for kids"?: boolean;
                };
                Amenities?: {
                    Restroom?: boolean;
                    Restaurant?: boolean;
                };
                Highlights?: {
                    "Live performances"?: boolean;
                };
                Accessibility?: {
                    "Wheelchair accessible restroom"?: boolean;
                    "Wheelchair accessible parking lot"?: boolean;
                };
            };
            summary: string;
        };
        state: string | null;
        rating: number;
        address: string;
        country: string;
        website: string;
        zipcode: string;
        district: string;
        latitude: number;
        owner_id: string;
        place_id: string;
        subtypes: string[];
        timezone: string;
        verified: boolean;
        google_id: string;
        longitude: number;
        google_mid: string;
        located_in?: {
            name: string;
            google_id: string;
        };
        order_link: string | null;
        owner_link: string;
        owner_name: string;
        place_link: string;
        business_id: string;
        photo_count: number;
        price_level: number | null;
        booking_link: string | null;
        full_address: string;
        phone_number: string;
        review_count: number;
        reviews_link: string;
        photos_sample: Array<{
            type: string;
            latitude: number;
            photo_id: string;
            longitude: number;
            photo_url: string;
            photo_timestamp: number;
            photo_url_large: string | null;
            photo_datetime_utc: string;
            video_thumbnail_url: string | null;
        }>;
        subtype_gcids: string[];
        working_hours: {
            [day: string]: string[];
        };
        opening_status: string;
        street_address: string;
        business_status: string;
        reservations_link: string | null;
        reviews_per_rating: {
            [rating: string]: number;
        };
        emails_and_contacts: {
            yelp: string | null;
            emails: string[];
            github: string | null;
            tiktok: string | null;
            twitter: string | null;
            youtube: string | null;
            facebook: string | null;
            linkedin: string | null;
            snapchat: string | null;
            instagram: string | null;
            pinterest: string | null;
            phone_numbers: string[];
        };
        keywords_mentioned_in_reviews: Array<{
            keyword: string;
            review_count: number;
        }>;
    };
    type: string;
    editorial_status: string | null;
    city: string;
    instagram_username: string;
    document_id: string | null;
    location: {
        type: string;
        coordinates: [number, number];
    };
    location_geo: {
        type: string;
        coordinates: [number, number];
    };
    score: string;
    instagram_followers_count: number | null;
    instagram_media_count: number | null;
    instagram_category: string | null;
    instagram_full_name: string | null;
    instagram_date_joined: string | null;
    instagram_profile_image: string | null;
    instagram_metadata: any;
    last_instagram_sync: string | null;
    cover_image: string | null;
    handle: string | null;
    categories: string[];
    concept: string | null;
    theme: string | null;
    typography: string | null;
    profile_image: string | null;
    opening_hours: {
        periods: Array<{
            open: {
                day: number;
                time: string;
            };
            close: {
                day: number;
                time: string;
            };
        }>;
    };
    timezone: string;
    default_language: string;
};