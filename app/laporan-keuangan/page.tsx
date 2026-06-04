'use client';

import { MagicDeleteDialog } from '@/components/custom/magic-delete-dialog';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllLaporanKeuangan, deleteLaporanKeuangan, type LaporanKeuangan } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, RefreshCw, Trash2, Edit, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { BlurFade } from "@/components/ui/blur-fade";

export default function LaporanKeuanganList() {
    const [data, setData] = useState<LaporanKeuangan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTahun, setFilterTahun] = useState<string>("all");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const loadData = async (page = 1) => {
        setLoading(true);
        try {
            const year = (filterTahun && filterTahun !== "all") ? parseInt(filterTahun) : undefined;
            const result = await getAllLaporanKeuangan(year, page);
            if (result.success && result.data) {
                setData(result.data);
                setPagination({
                    current_page: result.current_page || 1,
                    last_page: result.last_page || 1,
                    total: result.total || 0
                });
            } else {
                setData([]);
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal memuat data. Pastikan API terhubung.",
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData(1);
    }, [filterTahun]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteLaporanKeuangan(deleteId);
            toast({
                title: "Sukses",
                description: "Data berhasil dihapus!",
            });
            setDeleteId(null);
            loadData(pagination.current_page);
        } catch {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Terjadi kesalahan saat menghapus data.",
            });
        }
    };

    const renderPaginationItems = () => {
        const { current_page, last_page } = pagination;
        const items = [];
        const delta = 2;

        for (let i = 1; i <= last_page; i++) {
            if (
                i === 1 ||
                i === last_page ||
                (i >= current_page - delta && i <= current_page + delta)
            ) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => loadData(i)}
                            isActive={current_page === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (items[items.length - 1]?.key !== 'ellipsis') {
                items.push(
                    <PaginationItem key="ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }
        return items;
    };

    const getPeriodeLabel = (periode: string) => {
        const labels: Record<string, string> = {
            'semester_1': 'Semester 1',
            'semester_2': 'Semester 2',
            'unaudited': 'Unaudited',
            'audited': 'Audited',
        };
        return labels[periode] || periode;
    };

    const getSatkerLabel = (satker: string) => {
        const labels: Record<string, string> = {
            '401877': 'SATKER 401877',
            '401983': 'SATKER 401983',
        };
        return labels[satker] || satker;
    };

    return (
        <div className="space-y-6">
            <BlurFade delay={0.1} inView>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h2>
                        <p className="text-muted-foreground mt-1">Kelola data laporan keuangan satker</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/laporan-keuangan/tambah">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Data
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={() => loadData(pagination.current_page)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Daftar Laporan Keuangan</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-muted-foreground">Filter Tahun:</span>
                                <Select value={filterTahun} onValueChange={setFilterTahun}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun</SelectItem>
                                        {getYearOptions(2020).map((year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Satker</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Judul</TableHead>
                                        <TableHead className="text-center">File</TableHead>
                                        <TableHead className="text-center">Cover</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                Tidak ada data.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((item, idx) => {
                                            const no = (pagination.current_page - 1) * 10 + idx + 1;
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{no}</TableCell>
                                                    <TableCell>{item.tahun}</TableCell>
                                                    <TableCell>{getSatkerLabel(item.jenis_satker)}</TableCell>
                                                    <TableCell>{getPeriodeLabel(item.periode)}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{item.judul}</TableCell>
                                                    <TableCell className="text-center">
                                                        {item.file_url ? (
                                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                                <Button variant="ghost" size="sm">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.cover_url ? (
                                                            <a href={item.cover_url} target="_blank" rel="noopener noreferrer">
                                                                <Button variant="ghost" size="sm">
                                                                    <ImageIcon className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/laporan-keuangan/${item.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => setDeleteId(item.id!)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {pagination.last_page > 1 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => pagination.current_page > 1 && loadData(pagination.current_page - 1)}
                                                className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => pagination.current_page < pagination.last_page && loadData(pagination.current_page + 1)}
                                                className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </BlurFade>

            <MagicDeleteDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Laporan Keuangan"
                description="Data yang dihapus tidak dapat dikembalikan. Lanjutkan?"
            />
        </div>
    );
}
