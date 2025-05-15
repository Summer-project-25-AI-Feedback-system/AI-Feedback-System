import { createClient } from '@supabase/supabase-js';

// Tässä määritellään yhteys Supabaseen
const supabaseUrl = 'https://sztcnstdouastlagswaf.supabase.co';  // Vaihda omaan projektisi URL:ään
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dGNuc3Rkb3Vhc3RsYWdzd2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzM5MDQsImV4cCI6MjA2MjcwOTkwNH0.7oZz6GW3jrm7FofqCLkGmNP7qm4yvj2NxB_Z-lV3pSI';  // Vaihda omaan julkiseen avaimen

// Luo Supabase-asiakas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
