'use client';

import { MagicDeleteDialog } from '@/components/custom/magic-delete-dialog';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAllSakip, deleteSakip, JENIS_DOKUMEN_SAKIP, type Sakip } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, RefreshCw, Trash2, Edit, ExternalLink, Search, History } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 15;

export default function SakipList() {
    const [allData, setAllData] = useState<Sakip[]>([]);
    const [displayData, setDisplayData] = useState<Sakip[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTahun, setFilterTahun] = useState<string>('all');
    const [filterJenis, setFilterJenis] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedHistory, setSelectedHistory] = useState<Sakip | null>(null);
    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const tahun = filterTahun !== 'all' ? parseInt(filterTahun) : undefined;
            const result = await getAllSakip(tahun);
            if (result.success && result.data) {
                setAllData(result.data);
            } else {
                setAllData([]);
            }
        } catch {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Gagal memuat data. Pastikan API terhubung.',
            });
            setAllData([]);
        }
        setLoading(false);
    }, [filterTahun, toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            let filtered = allData;

            if (filterJenis !== 'all') {
                filtered = filtered.filter(d => d.jenis_dokumen === filterJenis);
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                filtered = filtered.filter(d =>
                    d.jenis_dokumen.toLowerCase().includes(q) ||
                    (d.uraian && d.uraian.toLowerCase().includes(q))
                );
            }

            setPagination(prev => {
                const total = filtered.length;
                const last_page = Math.max(1, Math.ceil(total / PAGE_SIZE));
                const current_page = Math.min(prev.current_page, last_page);
                return { ...prev, current_page, last_page, total };
            });

            setDisplayData(filtered);
        }, 400);
        return () => clearTimeout(timer);
    }, [allData, filterJenis, searchQuery]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const result = await deleteSakip(deleteId);
            if (result.success) {
                toast({ title: 'Sukses', description: 'Data berhasil dihapus!' });
            } else {
                toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Terjadi kesalahan.' });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menghapus.' });
        }
        setDeleteId(null);
        loadData();
    };

    const renderPaginationItems = () => {
        const { current_page, last_page } = pagination;
        const items = [];
        const delta = 2;

        for (let i = 1; i <= last_page; i++) {
            if (i === 1 || i === last_page || (i >= current_page - delta && i <= current_page + delta)) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={current_page === i}
                            onClick={() => setPagination(prev => ({ ...prev, current_page: i }))}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (
                items.length > 0 &&
                (items[items.length - 1] as any)?.key &&
                !String((items[items.length - 1] as any).key).startsWith('ellipsis')
            ) {
                items.push(<PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>);
            }
        }
        return items;
    };

    const paginatedData = displayData.slice(
        (pagination.current_page - 1) * PAGE_SIZE,
        pagination.current_page * PAGE_SIZE
    );

    const formatDate = (value?: string | null) => {
        if (!value) return '—';
        const [datePart] = value.split('T');
        const [year, month, day] = datePart.split('-');
        if (year && month && day) return `${day}/${month}/${year}`;
        return value;
    };

    const getActiveDocument = (item: Sakip) => (
        item.latest_revision?.link_dokumen || item.dokumen_aktif || item.link_dokumen
    );

    const getActiveLabel = (item: Sakip) => (
        item.latest_revision ? `Reviu ${item.latest_revision.revisi_ke}` : 'Dokumen Awal'
    );

    return (
        <div className="space-y-6">
            <BlurFade delay={0.1} inView>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">SAKIP</h2>
                        <p className="text-muted-foreground">Sistem Akuntabilitas Kinerja Instansi Pemerintahan.</p>
                    </div>
                    <Link href="/sakip/tambah">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Data
                        </Button>
                    </Link>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader className="space-y-4 pb-4">
                        <div className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Daftar Dokumen SAKIP</CardTitle>
                            <Button variant="outline" size="icon" onClick={loadData}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari jenis dokumen atau uraian..."
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setPagination(prev => ({ ...prev, current_page: 1 }));
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={filterTahun} onValueChange={v => { setFilterTahun(v); setPagination(prev => ({ ...prev, current_page: 1 })); }}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Semua Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                    {getYearOptions(2019).map(y => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterJenis} onValueChange={v => { setFilterJenis(v); setPagination(prev => ({ ...prev, current_page: 1 })); }}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Jenis</SelectItem>
                                    {JENIS_DOKUMEN_SAKIP.map(j => (
                                        <SelectItem key={j} value={j}>{j}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">No</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Jenis Dokumen</TableHead>
                                        <TableHead>Uraian</TableHead>
                                        <TableHead className="text-center">Dokumen</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                {allData.length === 0
                                                    ? 'Belum ada data SAKIP. Klik "Tambah Data" untuk memulai.'
                                                    : 'Tidak ada data yang cocok dengan filter.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center">
                                                    {(pagination.current_page - 1) * PAGE_SIZE + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.tahun}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-indigo-700 max-w-[220px] truncate" title={item.jenis_dokumen}>
                                                    {item.jenis_dokumen}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground max-w-[300px] truncate" title={item.uraian || ''}>
                                                    {item.uraian || <span className="italic text-xs">—</span>}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getActiveDocument(item) ? (
                                                        <a
                                                            href={getActiveDocument(item) || ''}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm"
                                                        >
                                                            <ExternalLink className="h-3 w-3" /> Lihat
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">Belum tersedia</span>
                                                    )}
                                                    <div className="mt-1 text-[11px] text-muted-foreground">
                                                        {getActiveLabel(item)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:text-indigo-600"
                                                            onClick={() => setSelectedHistory(item)}
                                                            title="History reviu"
                                                        >
                                                            <History className="h-4 w-4" />
                                                        </Button>
                                                        <Link href={`/sakip/${item.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => setDeleteId(item.id!)}
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

                        {!loading && pagination.last_page > 1 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }));
                                                }}
                                                className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }));
                                                }}
                                                className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                    Menampilkan {Math.min((pagination.current_page - 1) * PAGE_SIZE + 1, pagination.total)}–{Math.min(pagination.current_page * PAGE_SIZE, pagination.total)} dari {pagination.total} data
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </BlurFade>

            <MagicDeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data ini? Tindakan tidak dapat dibatalkan."
      />

            <Dialog open={!!selectedHistory} onOpenChange={open => !open && setSelectedHistory(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>History Reviu Dokumen SAKIP</DialogTitle>
                        <DialogDescription>
                            {selectedHistory?.jenis_dokumen} Tahun {selectedHistory?.tahun}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedHistory && (
                        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                            <div className="rounded-md border p-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <Badge variant="outline">Dokumen Awal</Badge>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Publish: {formatDate(selectedHistory.tanggal_publish)}
                                        </p>
                                    </div>
                                    {selectedHistory.link_dokumen ? (
                                        <a
                                            href={selectedHistory.link_dokumen}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <ExternalLink className="h-3 w-3" /> Buka Dokumen
                                        </a>
                                    ) : (
                                        <span className="text-xs italic text-muted-foreground">Belum tersedia</span>
                                    )}
                                </div>
                            </div>

                            {selectedHistory.revisions && selectedHistory.revisions.length > 0 ? (
                                selectedHistory.revisions.map(revision => (
                                    <div key={revision.id || revision.revisi_ke} className="rounded-md border p-3">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge className="bg-indigo-600">Reviu {revision.revisi_ke}</Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        Publish: {formatDate(revision.tanggal_publish)}
                                                    </span>
                                                </div>
                                                {revision.keterangan && (
                                                    <p className="text-sm text-muted-foreground">{revision.keterangan}</p>
                                                )}
                                            </div>
                                            {revision.link_dokumen ? (
                                                <a
                                                    href={revision.link_dokumen}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                                                >
                                                    <ExternalLink className="h-3 w-3" /> Buka Dokumen
                                                </a>
                                            ) : (
                                                <span className="text-xs italic text-muted-foreground">Belum tersedia</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    Belum ada history reviu.
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
