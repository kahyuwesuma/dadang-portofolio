import { createClient } from '@supabase/supabase-js';
import type { Publikasi, PengabdianMasyarakat, Statistik, HeroContent, DescContent } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getHeroContent(): Promise<HeroContent> {
    const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', 1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching hero content:', error);
    }

    return data || {
        id: 1,
        image_url: '/images/profile4.jpeg',
        title: 'Dr. Dadang I K Mujiono',
        subtitle: 'Academic | Conservationist'
    };
}

export async function getDescContent(): Promise<DescContent> {
    const { data, error } = await supabase
        .from('desc_content')
        .select('groups')
        .eq('id', 1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching desc content:', error);
    }

    return {
        id: 1,
        groups: data?.groups ?? []
    };
}

export async function getPublikasi() {
    const { data, error } = await supabase
        .from('publikasi')
        .select('*')
        .order('tahun', { ascending: false });

    if (error) {
        console.error('Error fetching publikasi:', error);
        return [];
    }

    return data as Publikasi[];
}

export async function getPublikasiWithTags() {
    const { data, error } = await supabase
        .from('v_publikasi_with_tags')
        .select('*')
        .order('tahun', { ascending: false });

    if (error) {
        console.error('Error fetching publikasi with tags:', error);
        return [];
    }

    return data as Publikasi[];
}

export async function getPengabdian() {
    const { data, error } = await supabase
        .from('pengabdian')
        .select('*')
        .order('tanggal', { ascending: false });

    if (error) {
        console.error('Error fetching pengabdian:', error);
        return [];
    }

    return data as PengabdianMasyarakat[];
}

export async function getStatistik() {
    const { data, error } = await supabase
        .from('statistik')
        .select('*')
        .order('urutan', { ascending: true });

    if (error) {
        console.error('Error fetching statistik:', error);
        return [];
    }

    return data as Statistik[];
}

export async function searchPublikasi(searchTerm: string, kategoriFilter: string = 'all') {
    const { data, error } = await supabase
        .rpc('search_publikasi', {
            search_term: searchTerm,
            kategori_filter: kategoriFilter
        });

    if (error) {
        console.error('Error searching publikasi:', error);
        return [];
    }

    return data as Publikasi[];
}

export async function searchPengabdian(searchTerm: string) {
    const { data, error } = await supabase
        .rpc('search_pengabdian', {
            search_term: searchTerm
        });

    if (error) {
        console.error('Error searching pengabdian:', error);
        return [];
    }

    return data as PengabdianMasyarakat[];
}