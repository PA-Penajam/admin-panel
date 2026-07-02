'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProfilPimpinan, type ProfilPimpinan } from '@/lib/api';
import { ProfilPimpinanForm } from '../../_components/profil-pimpinan-form';

export default function EditProfilPimpinanPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<ProfilPimpinan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getProfilPimpinan(Number(params.id));
        if (!result) {
          toast({ variant: 'destructive', title: 'Error', description: 'Profil tidak ditemukan.' });
          router.push('/profil-pimpinan');
          return;
        }
        setData(result);
      } catch {
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat profil pimpinan.' });
        router.push('/profil-pimpinan');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id, router, toast]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ProfilPimpinanForm mode="edit" initialData={data} />;
}
