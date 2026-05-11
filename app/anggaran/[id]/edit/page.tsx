'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAnggaran, updateAnggaran, type RealisasiAnggaran } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { BlurFade } from "@/components/ui/blur-fade";

const BULAN_OPTIONS = [
    { value: "1", label: "Januari" }, { value: "2", label: "Februari" }, { value: "3", label: "Maret" },
    { value: "4", label: "April" }, { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
    { value: "7", label: "Juli" }, { value: "8", label: "Agustus" }, { value: "9", label: "September" },
    { value: "10", label: "Oktober" }, { value: "11", label: "November" }, { value: "12", label: "Desember" },
];

const KATEGORI_BY_DIPA: Record<string, string[]> = {
    'DIPA 01': ['Belanja Pegawai', 'Belanja Barang', 'Belanja Modal'],
    'DIPA 04': ['POSBAKUM', 'Pembebasan Biaya Perkara', 'Sidang Di Luar Gedung'],
};

export default function AnggaranEdit() {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string);
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [fileDokumen, setFileDokumen] = useState<File | null>(null);
    const [formData, setFormData] = useState<Partial<RealisasiAnggaran>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAnggaran(id);
                if (data) setFormData(data);
                else router.push('/anggaran');
            } catch (e) { toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" }); }
            setFetching(false);
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val !== undefined && val !== null) dataToSend.append(key, String(val));
            });
            if (fileDokumen) dataToSend.append('file_dokumen', fileDokumen);
            const result = await updateAnggaran(id, dataToSend);
            if (result.success) {
                toast({ title: "Sukses", description: "Data berhasil diperbarui!" });
                router.push('/anggaran');
            }
        } catch (error) { toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan" }); }
        setLoading(false);
    };

    if (fetching) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <BlurFade delay={0.1} inView>
                <div className="flex items-center gap-4">
                    <Link href="/anggaran"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Realisasi</h2>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader><CardTitle>Formulir Edit</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tahun</Label>
                                    <Input type="number" value={formData.tahun} onChange={e => setFormData(prev => ({ ...prev, tahun: parseInt(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bulan</Label>
                                    <Select value={formData.bulan?.toString()} onValueChange={(val) => setFormData(prev => ({ ...prev, bulan: parseInt(val) }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{BULAN_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>DIPA</Label>
                                    <Select value={formData.dipa} onValueChange={(val) => setFormData(prev => ({ ...prev, dipa: val, kategori: '' }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="DIPA 01">DIPA 01</SelectItem><SelectItem value="DIPA 04">DIPA 04</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategori Belanja</Label>
                                    <Select value={formData.kategori} onValueChange={(val) => setFormData(prev => ({ ...prev, kategori: val }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{KATEGORI_BY_DIPA[formData.dipa || 'DIPA 01'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Realisasi (Rp)</Label>
                                <Input type="number" value={formData.realisasi} onChange={e => setFormData(prev => ({ ...prev, realisasi: parseFloat(e.target.value) }))} />
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <Label>Upload Dokumen Baru (Opsional)</Label>
                                {formData.link_dokumen && (
                                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border mb-2">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <a href={formData.link_dokumen} target="_blank" className="text-xs text-blue-700 hover:underline">Lihat dokumen saat ini</a>
                                    </div>
                                )}
                                <Input type="file" onChange={e => setFileDokumen(e.target.files?.[0] || null)} accept=".pdf,image/*" />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Link href="/anggaran"><Button type="button" variant="outline">Batal</Button></Link>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
