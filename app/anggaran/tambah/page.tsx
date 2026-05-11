'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAnggaran, getAllPagu, type RealisasiAnggaran, type PaguAnggaran } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { BlurFade } from "@/components/ui/blur-fade";

const BULAN_OPTIONS = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

const KATEGORI_BY_DIPA: Record<string, string[]> = {
    'DIPA 01': ['Belanja Pegawai', 'Belanja Barang', 'Belanja Modal'],
    'DIPA 04': ['POSBAKUM', 'Pembebasan Biaya Perkara', 'Sidang Di Luar Gedung'],
};

export default function AnggaranAdd() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [paguList, setPaguList] = useState<PaguAnggaran[]>([]);
    const [fileDokumen, setFileDokumen] = useState<File | null>(null);
    
    const [formData, setFormData] = useState<Partial<RealisasiAnggaran>>({
        dipa: 'DIPA 01',
        kategori: '',
        bulan: new Date().getMonth() + 1,
        realisasi: 0,
        tahun: new Date().getFullYear(),
        keterangan: '',
        link_dokumen: '',
    });

    const [currentPagu, setCurrentPagu] = useState<number>(0);

    useEffect(() => {
        const loadPagu = async () => {
            const res = await getAllPagu(formData.tahun);
            if (res.success) setPaguList(res.data || []);
        };
        loadPagu();
    }, [formData.tahun]);

    useEffect(() => {
        const pagu = paguList.find(p => p.dipa === formData.dipa && p.kategori === formData.kategori);
        setCurrentPagu(pagu ? pagu.jumlah_pagu : 0);
    }, [formData.dipa, formData.kategori, paguList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.kategori) {
            toast({ title: "Error", description: "Pilih Kategori terlebih dahulu", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const dataToSend = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val !== undefined && val !== null) dataToSend.append(key, String(val));
            });
            if (fileDokumen) dataToSend.append('file_dokumen', fileDokumen);

            const result = await createAnggaran(dataToSend);

            if (result.success) {
                toast({ title: "Sukses", description: "Data realisasi berhasil disimpan!" });
                router.push('/anggaran');
            } else {
                throw new Error(result.message || 'Gagal menyimpan');
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan data." });
        }
        setLoading(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <BlurFade delay={0.1} inView>
                <div className="flex items-center gap-4">
                    <Link href="/anggaran"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <h2 className="text-2xl font-bold tracking-tight">Input Realisasi Bulanan</h2>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader>
                        <CardTitle>Formulir Realisasi</CardTitle>
                        <CardDescription>Unggah bukti dokumen untuk meningkatkan transparansi.</CardDescription>
                    </CardHeader>
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
                                        <SelectContent>
                                            {BULAN_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
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
                                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                            {KATEGORI_BY_DIPA[formData.dipa || 'DIPA 01'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Pagu Terkonfigurasi</p>
                                <p className="text-lg font-bold text-blue-900">{formatCurrency(currentPagu)}</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-emerald-700 font-bold">Realisasi Bulan Ini (Rp)</Label>
                                <Input type="number" className="text-lg font-semibold border-emerald-200" value={formData.realisasi} onChange={e => setFormData(prev => ({ ...prev, realisasi: parseFloat(e.target.value) }))} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Upload Dokumen Realisasi (PDF/Gambar)</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="file" onChange={e => setFileDokumen(e.target.files?.[0] || null)} accept=".pdf,image/*" />
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">File ini akan muncul di kolom &quot;doc&quot; website publik.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Atau Link Manual (Google Drive)</Label>
                                <Input placeholder="https://drive.google.com/..." value={formData.link_dokumen || ''} onChange={e => setFormData(prev => ({ ...prev, link_dokumen: e.target.value }))} />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Link href="/anggaran"><Button type="button" variant="outline">Batal</Button></Link>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading || currentPagu === 0}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Data
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
