import { createClient } from '@supabase/supabase-js';
import type { Publikasi, PengabdianMasyarakat, Statistik } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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