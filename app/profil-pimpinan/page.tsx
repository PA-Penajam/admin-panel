'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MagicDeleteDialog } from '@/components/custom/magic-delete-dialog';
import { BlurFade } from '@/components/ui/blur-fade';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  deleteProfilPimpinan,
  getAllProfilPimpinan,
  type ProfilPimpinan,
} from '@/lib/api';
import { Edit, ExternalLink, PlusCircle, RefreshCw, Search, Trash2, UserRound } from 'lucide-react';

export default function ProfilPimpinanPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<ProfilPimpinan[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = async (query = searchQuery) => {
    setLoading(true);
    try {
      const result = await getAllProfilPimpinan({ q: query });
      if (result.success) {
        setData(result.data || []);
      } else {
        setData([]);
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat profil pimpinan.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(searchQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteProfilPimpinan(deleteId);
      if (result.success) {
        toast({ title: 'Sukses', description: 'Profil pimpinan berhasil dihapus.' });
        setDeleteId(null);
        loadData();
      } else {
        toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Gagal menghapus data.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menghapus data.' });
    }
  };

  return (
    <div className="space-y-6">
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profil Pimpinan</h2>
            <p className="text-muted-foreground">
              Kelola profil Ketua dan Wakil Ketua untuk ditampilkan di portal publik.
            </p>
          </div>
          <Link href="/profil-pimpinan/tambah">
            <Button className="bg-teal-600 hover:bg-teal-700 shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Profil
            </Button>
          </Link>
        </div>
      </BlurFade>

      <BlurFade delay={0.15} inView>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari nama, jabatan, atau slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => loadData()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <Card>
          <CardHeader>
            <CardTitle>
              Daftar Profil
              {!loading && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({data.length} data)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada profil pimpinan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pimpinan</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Publish</TableHead>
                      <TableHead>Urutan</TableHead>
                      <TableHead className="text-center">Link</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {item.foto_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.foto_url}
                                  alt={item.nama}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserRound className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.nama}</p>
                              <p className="text-sm text-muted-foreground">{item.jabatan}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.slug}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.status_label || (item.status_aktif ? 'Aktif' : 'Tidak Aktif')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? 'default' : 'outline'}>
                            {item.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.urutan}</TableCell>
                        <TableCell className="text-center">
                          {item.profil_link ? (
                            <a href={item.profil_link} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                Lihat
                              </Button>
                            </a>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/profil-pimpinan/${item.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id ?? null)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </BlurFade>

      <MagicDeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Profil Pimpinan?"
        description="Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
