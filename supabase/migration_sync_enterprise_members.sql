-- Sinkronisasi akses instansi untuk akun karyawan cabang (enterprise_member) yang sudah ada
UPDATE public.users AS child
SET 
    institution_name = parent.institution_name,
    institution_type = parent.institution_type,
    has_analytics_access = parent.has_analytics_access
FROM public.users AS parent
WHERE child.parent_id = parent.id
AND child.tier = 'enterprise_member';
