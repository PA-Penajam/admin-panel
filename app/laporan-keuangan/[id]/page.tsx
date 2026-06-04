'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getLaporanKeuangan, updateLaporanKeuangan, type LaporanKeuangan } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditLaporanKeuangan() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState<LaporanKeuangan>({
        tahun: new Date().getFullYear(),
        jenis_satker: '',
        periode: '',
        judul: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string>('');
    const [existingCoverUrl, setExistingCoverUrl] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = parseInt(params.id as string);
                const data = await getLaporanKeuangan(id);
                if (data) {
                    setFormData({
                        tahun: data.tahun,
                        jenis_satker: data.jenis_satker,
                        periode: data.periode,
                        judul: data.judul,
                    });
                    setExistingFileUrl(data.file_url || '');
                    setExistingCoverUrl(data.cover_url || '');
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Data tidak ditemukan.",
                    });
                    router.push('/laporan-keuangan');
                }
            } catch {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Gagal memuat data.",
                });
            }
            setLoadingData(false);
        };

        fetchData();
    }, [params.id, router, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.jenis_satker) {
            toast({ variant: "destructive", title: "Validasi", description: "Jenis Satker wajib dipilih." });
            return;
        }
        if (!formData.periode) {
            toast({ variant: "destructive", title: "Validasi", description: "Periode wajib dipilih." });
            return;
        }

        setLoading(true);

        try {
            const dataToSend = new FormData();
            dataToSend.append('tahun', String(formData.tahun));
            dataToSend.append('jenis_satker', formData.jenis_satker);
            dataToSend.append('periode', formData.periode);
            dataToSend.append('judul', formData.judul);

            if (file) {
                dataToSend.append('file_upload', file);
            }

            if (cover) {
                dataToSend.append('cover_upload', cover);
            }

            const id = parseInt(params.id as string);
            const result = await updateLaporanKeuangan(id, dataToSend);

            if (result.success) {
                toast({ title: "Sukses", description: "Data berhasil diupdate!" });
                setTimeout(() => router.push('/laporan-keuangan'), 1500);
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.message || 'Gagal mengupdate data.',
                });
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Terjadi kesalahan. Pastikan API terhubung.",
            });
        }

        setLoading(false);
    };

    if (loadingData) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-10 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-96 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-4">
                <Link href="/laporan-keuangan">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Edit Laporan Keuangan</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Form Edit Data</CardTitle>
                    <CardDescription>Ubah data laporan keuangan yang diperlukan</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Select
                                value={String(formData.tahun)}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, tahun: parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getYearOptions(2020).map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jenis_satker">Jenis Satker *</Label>
                            <Select
                                value={formData.jenis_satker}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, jenis_satker: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Satker" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="401877">SATKER 401877</SelectItem>
                                    <SelectItem value="401983">SATKER 401983</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="periode">Periode *</Label>
                            <Select
                                value={formData.periode}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, periode: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semester_1">Semester 1</SelectItem>
                                    <SelectItem value="semester_2">Semester 2</SelectItem>
                                    <SelectItem value="tahunan">Tahunan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Laporan *</Label>
                            <Input
                                id="judul"
                                name="judul"
                                type="text"
                                placeholder="Contoh: Laporan Keuangan SATKER 401877 Semester 1 Tahun 2024"
                                value={formData.judul}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file_upload">File PDF</Label>
                            {existingFileUrl && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <span>File saat ini:</span>
                                    <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        Lihat File <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                            <Input
                                id="file_upload"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <p className="text-sm text-muted-foreground">Upload file PDF baru (Max: 10MB) - Kosongkan jika tidak ingin mengubah</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_upload">Cover Image</Label>
                            {existingCoverUrl && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <span>Cover saat ini:</span>
                                    <a href={existingCoverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        Lihat Cover <ImageIcon className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                            <Input
                                id="cover_upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => setCover(e.target.files?.[0] || null)}
                            />
                            <p className="text-sm text-muted-foreground">Upload gambar cover baru (JPG, PNG, WEBP, Max: 5MB) - Kosongkan jika tidak ingin mengubah</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? 'Menyimpan...' : 'Update Data'}
                            </Button>
                            <Link href="/laporan-keuangan">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
