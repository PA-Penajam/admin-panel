'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createLaporanKeuangan, type LaporanKeuangan } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function TambahLaporanKeuangan() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<LaporanKeuangan>({
        tahun: new Date().getFullYear(),
        jenis_satker: '',
        periode: '',
        judul: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);

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
        if (!file) {
            toast({ variant: "destructive", title: "Validasi", description: "File PDF wajib diupload." });
            return;
        }

        setLoading(true);

        try {
            const dataToSend = new FormData();
            dataToSend.append('tahun', String(formData.tahun));
            dataToSend.append('jenis_satker', formData.jenis_satker);
            dataToSend.append('periode', formData.periode);
            dataToSend.append('judul', formData.judul);
            dataToSend.append('file_upload', file);

            if (cover) {
                dataToSend.append('cover_upload', cover);
            }

            const result = await createLaporanKeuangan(dataToSend);

            if (result.success) {
                toast({ title: "Sukses", description: "Data berhasil disimpan!" });
                setTimeout(() => router.push('/laporan-keuangan'), 1500);
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.message || 'Gagal menyimpan data.',
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

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-4">
                <Link href="/laporan-keuangan">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Tambah Laporan Keuangan</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Form Input Data</CardTitle>
                    <CardDescription>Isi semua field yang diperlukan untuk menambah data laporan keuangan</CardDescription>
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
                                    <SelectItem value="401877">401877</SelectItem>
                                    <SelectItem value="401983">401983</SelectItem>
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
                                    <SelectItem value="unaudited">Unaudited</SelectItem>
                                    <SelectItem value="audited">Audited</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Laporan *</Label>
                            <Input
                                id="judul"
                                name="judul"
                                type="text"
                                placeholder="Contoh: Laporan Keuangan 401877 Semester 1 Tahun 2024"
                                value={formData.judul}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file_upload">File PDF *</Label>
                            <Input
                                id="file_upload"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">Upload file PDF (Max: 10MB)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_upload">Cover Image (Opsional)</Label>
                            <Input
                                id="cover_upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => setCover(e.target.files?.[0] || null)}
                            />
                            <p className="text-sm text-muted-foreground">Upload gambar cover (JPG, PNG, WEBP, Max: 5MB)</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? 'Menyimpan...' : 'Simpan Data'}
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
