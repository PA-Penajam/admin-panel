'use client';

import { MagicDeleteDialog } from '@/components/custom/magic-delete-dialog';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllSkInovasi, deleteSkInovasi, type SkInovasi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, RefreshCw, Trash2, Edit, ExternalLink } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Badge } from '@/components/ui/badge';

export default function SkInovasiList() {
    const [data, setData] = useState<SkInovasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { toast } = useToast();

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getAllSkInovasi();
            if (result.success && result.data) {
                setData(result.data);
            } else {
                setData([]);
            }
        } catch {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Gagal memuat data. Pastikan API terhubung.',
            });
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const result = await deleteSkInovasi(deleteId);
            if (result.success) {
                toast({ title: 'Sukses', description: 'SK berhasil dihapus!' });
            } else {
                toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Terjadi kesalahan.' });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menghapus.' });
        }
        setDeleteId(null);
        loadData();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <BlurFade delay={0.1} inView>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">SK Inovasi</h2>
                        <p className="text-muted-foreground">Surat Keputusan penetapan inovasi tahunan.</p>
                    </div>
                    <Link href="/sk-inovasi/tambah">
                        <Button className="bg-amber-600 hover:bg-amber-700 shadow-md">
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah SK
                        </Button>
                    </Link>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader className="space-y-4 pb-4">
                        <div className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Daftar SK Inovasi</CardTitle>
                            <Button variant="outline" size="icon" onClick={loadData}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">No</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Nomor SK</TableHead>
                                        <TableHead>Tentang</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Dokumen</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={7}><Skeleton className="h-12 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Belum ada SK Inovasi. Klik &quot;Tambah SK&quot; untuk memulai.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-base font-semibold">
                                                        {item.tahun}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-amber-700 max-w-[250px] truncate" title={item.nomor_sk}>
                                                    {item.nomor_sk}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground max-w-[300px]" title={item.tentang}>
                                                    {item.tentang.length > 80 ? item.tentang.substring(0, 80) + '...' : item.tentang}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.is_active ? (
                                                        <Badge className="bg-green-600 hover:bg-green-700">Aktif</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Nonaktif</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.file_url ? (
                                                        <a
                                                            href={item.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-amber-600 hover:underline text-sm"
                                                        >
                                                            <ExternalLink className="h-3 w-3" /> Lihat
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">Belum ada</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/sk-inovasi/${item.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => setDeleteId(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>

            <MagicDeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus SK ini? Tindakan tidak dapat dibatalkan."
      />
        </div>
    );
}
