import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Client for browser (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey || supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Types
export interface User {
    id: string;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface GalleryImage {
    id: number;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
}

export interface SiteSetting {
    key: string;
    value: string;
}

// Default settings
export const defaultSettings: Record<string, string> = {
    // Stats
    stat_age: '28',
    stat_height: '180',
    stat_weight: '105',
    stat_experience: '10',

    // About text
    about_line1: 'The body is hardware. The mind is software.',
    about_line2: 'To upgrade the chassis, you must first rewrite the kernel.',
    about_line3: 'Pain is simply a signal indicating growth. Process the data. Execute the lift.',

    // Social links (only WhatsApp and Instagram now)
    social_instagram: 'https://www.instagram.com/welcomto_brj_city?igsh=MXRqcjJvZzZ6cW9teg==',
    social_whatsapp: '+918319219942',
    social_phone: '+918319219942',

    // Dynamic Location
    location: 'Lakhnadon, 480886',
};

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) return null;
    return data as User;
}

export async function createUser(email: string, passwordHash: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
        .from('users')
        .insert({ email, password_hash: passwordHash })
        .select()
        .single();

    if (error || !data) return null;
    return data as User;
}

// Image Upload (Supabase Storage)
export async function uploadImage(file: File): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from('gallery')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return null;
        }

        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Upload handler error:', error);
        return null;
    }
}

// Gallery functions
export async function getAllImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabaseAdmin
        .from('gallery_images')
        .select('id, imageUrl:image_url, caption, createdAt:created_at')
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as GalleryImage[];
}

export async function getImageById(id: number): Promise<GalleryImage | null> {
    const { data, error } = await supabaseAdmin
        .from('gallery_images')
        .select('id, imageUrl:image_url, caption, createdAt:created_at')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data as GalleryImage;
}

export async function addImage(imageUrl: string, caption: string | null): Promise<GalleryImage | null> {
    const { data, error } = await supabaseAdmin
        .from('gallery_images')
        .insert({ image_url: imageUrl, caption })
        .select('id, imageUrl:image_url, caption, createdAt:created_at')
        .single();

    if (error || !data) return null;
    return data as GalleryImage;
}

export async function updateImageCaption(id: number, caption: string): Promise<boolean> {
    const { error } = await supabaseAdmin
        .from('gallery_images')
        .update({ caption })
        .eq('id', id);

    return !error;
}

export async function deleteImage(id: number): Promise<boolean> {
    // 1. Get image URL to find storage path
    const image = await getImageById(id);
    if (image) {
        // Extract filename from URL
        const path = image.imageUrl.split('/').pop();
        if (path) {
            await supabaseAdmin.storage.from('gallery').remove([path]);
        }
    }

    // 2. Delete database record
    const { error } = await supabaseAdmin
        .from('gallery_images')
        .delete()
        .eq('id', id);

    return !error;
}

// Settings functions
export interface SiteSettings {
    stat_age: string;
    stat_height: string;
    stat_weight: string;
    stat_experience: string;
    about_line1: string;
    about_line2: string;
    about_line3: string;
    social_instagram: string;
    social_whatsapp: string;
    social_phone: string;
    location: string;
}

export async function getAllSettings(): Promise<SiteSettings> {
    const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('*');

    if (error || !data) {
        // Return defaults if error
        return defaultSettings as unknown as SiteSettings;
    }

    const settings: Record<string, string> = { ...defaultSettings };
    for (const row of data as SiteSetting[]) {
        settings[row.key] = row.value;
    }
    return settings as unknown as SiteSettings;
}

export async function getSetting(key: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error || !data) return defaultSettings[key] || null;
    return data.value;
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
    const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });

    return !error;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<boolean> {
    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
    }));

    const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

    return !error;
}

// Initialize default admin user
export async function initializeDefaultAdmin(): Promise<void> {
    const bcrypt = await import('bcryptjs');
    const DEFAULT_EMAIL = 'admin@brajeshparte.com';
    const DEFAULT_PASSWORD = 'CyberDiscipline2024!';

    const existingUser = await getUserByEmail(DEFAULT_EMAIL);
    if (!existingUser) {
        const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
        await createUser(DEFAULT_EMAIL, passwordHash);
        console.log('Default admin user created');
    }
}

// Initialize default settings
export async function initializeDefaultSettings(): Promise<void> {
    const updates = Object.entries(defaultSettings).map(([key, value]) => ({
        key,
        value,
    }));

    // Use upsert to add only missing settings
    await supabaseAdmin
        .from('site_settings')
        .upsert(updates, { onConflict: 'key', ignoreDuplicates: true });
}
