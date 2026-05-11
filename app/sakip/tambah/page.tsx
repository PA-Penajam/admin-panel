'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSakip, JENIS_DOKUMEN_SAKIP, type Sakip } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';

function SakipForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Sakip>>({
        tahun: new Date().getFullYear(),
        tanggal_publish: new Date().toISOString().slice(0, 10),
        link_dokumen: '',
    });

    const [fileDokumen, setFileDokumen] = useState<File | null>(null);

    useEffect(() => {
        const tahun = searchParams.get('tahun');
        const jenis = searchParams.get('jenis');
        if (tahun) setFormData(prev => ({ ...prev, tahun: parseInt(tahun) }));
        if (jenis) setFormData(prev => ({ ...prev, jenis_dokumen: decodeURIComponent(jenis) as typeof JENIS_DOKUMEN_SAKIP[number] }));
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tahun || !formData.jenis_dokumen) {
            toast({ title: 'Error', description: 'Tahun dan Jenis Dokumen wajib diisi.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            const dataToSend = new FormData();
            (['tahun', 'jenis_dokumen', 'uraian', 'link_dokumen', 'tanggal_publish'] as const).forEach(key => {
                const val = formData[key];
                if (val !== null && val !== undefined && String(val).trim() !== '') {
                    dataToSend.append(key, String(val));
                }
            });
            if (fileDokumen) dataToSend.append('file_dokumen', fileDokumen);

            const result = await createSakip(dataToSend);
            if (result.success) {
                toast({ title: 'Sukses', description: 'Data berhasil disimpan!' });
                router.push('/sakip');
            } else {
                toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Terjadi kesalahan.' });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menyimpan.' });
        }
        setLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Formulir Dokumen SAKIP</CardTitle>
                <CardDescription>
                    Tambahkan dokumen SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintahan).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Tahun <span className='text-red-500'>*</span></Label>
                            <Select
                                value={String(formData.tahun || '')}
                                onValueChange={v => setFormData(prev => ({ ...prev, tahun: parseInt(v) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih Tahun' />
                                </SelectTrigger>
                                <SelectContent>
                                    {getYearOptions(2019).map(y => (
                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label>Jenis Dokumen <span className='text-red-500'>*</span></Label>
                            <Select
                                value={formData.jenis_dokumen || ''}
                                onValueChange={v => setFormData(prev => ({ ...prev, jenis_dokumen: v as typeof JENIS_DOKUMEN_SAKIP[number] }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih Jenis Dokumen' />
                                </SelectTrigger>
                                <SelectContent>
                                    {JENIS_DOKUMEN_SAKIP.map(j => (
                                        <SelectItem key={j} value={j}>{j}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>Uraian / Keterangan</Label>
                        <Textarea
                            value={formData.uraian || ''}
                            onChange={e => setFormData(prev => ({ ...prev, uraian: e.target.value }))}
                            placeholder='Masukkan uraian atau deskripsi dokumen (opsional)...'
                            rows={4}
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Link Dokumen</Label>
                            <Input
                                value={formData.link_dokumen || ''}
                                onChange={e => setFormData(prev => ({ ...prev, link_dokumen: e.target.value }))}
                                placeholder='https://drive.google.com/...'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Tanggal Publish</Label>
                            <Input
                                type='date'
                                value={formData.tanggal_publish || ''}
                                onChange={e => setFormData(prev => ({ ...prev, tanggal_publish: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>File Dokumen</Label>
                        <Input
                            type='file'
                            onChange={e => setFileDokumen(e.target.files?.[0] || null)}
                            accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                        />
                        <p className='text-xs text-muted-foreground'>
                            Format: PDF, DOC, DOCX, JPG, JPEG, PNG. Maks 20MB.
                        </p>
                        {fileDokumen && (
                            <p className='text-xs text-indigo-600 font-medium'>
                                File dipilih: {fileDokumen.name}
                            </p>
                        )}
                    </div>

                    <div className='pt-4 flex justify-end gap-2'>
                        <Link href='/sakip'><Button type='button' variant='outline'>Batal</Button></Link>
                        <Button type='submit' className='bg-indigo-600 hover:bg-indigo-700' disabled={loading}>
                            {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
                            Simpan
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function SakipTambah() {
    return (
        <div className='max-w-2xl mx-auto space-y-6'>
            <BlurFade delay={0.1} inView>
                <div className='flex items-center gap-4'>
                    <Link href='/sakip'><Button variant='outline' size='icon'><ArrowLeft className='h-4 w-4' /></Button></Link>
                    <h2 className='text-2xl font-bold tracking-tight'>Tambah Dokumen SAKIP</h2>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Suspense fallback={
                    <Card>
                        <CardContent className='flex justify-center items-center h-48'>
                            <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
                        </CardContent>
                    </Card>
                }>
                    <SakipForm />
                </Suspense>
            </BlurFade>
        </div>
    );
}
