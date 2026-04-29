'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSkRadiusBiaya, updateSkRadiusBiaya, type SkRadiusBiaya } from '@/lib/api';
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

function SkRadiusBiayaEditForm({ id }: { id: number }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState<Partial<SkRadiusBiaya>>({
        tahun: currentYear,
        is_active: true,
    });

    const [file, setFile] = useState<File | null>(null);
    const [metadataJson, setMetadataJson] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            try {
                const result = await getSkRadiusBiaya(id);
                if (result) {
                    setFormData(result);
                    if (result.metadata_json) {
                        setMetadataJson(result.metadata_json);
                    }
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Data tidak ditemukan.' });
                    router.push('/radius-biaya');
                }
            } catch {
                toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data.' });
                router.push('/radius-biaya');
            }
            setFetching(false);
        };
        fetchData();
    }, [id, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tahun || !formData.nomor_sk || !formData.tentang) {
            toast({ title: 'Error', description: 'Tahun, Nomor SK, dan Tentang wajib diisi.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append('tahun', String(formData.tahun));
            dataToSend.append('nomor_sk', formData.nomor_sk || '');
            dataToSend.append('tentang', formData.tentang || '');
            dataToSend.append('is_active', formData.is_active ? '1' : '0');

            if (formData.file_url) {
                dataToSend.append('file_url', formData.file_url);
            }

            if (file) {
                dataToSend.append('file', file);
            }

            if (metadataJson.trim()) {
                dataToSend.append('metadata_json', metadataJson);
            }

            const result = await updateSkRadiusBiaya(id, dataToSend);
            if (result.success) {
                toast({ title: 'Sukses', description: 'SK berhasil diupdate!' });
                router.push('/radius-biaya');
            } else {
                toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Terjadi kesalahan.' });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menyimpan.' });
        }
        setLoading(false);
    };

    if (fetching) {
        return (
            <Card>
                <CardContent className='flex justify-center items-center h-48'>
                    <Loader2 className='h-8 w-8 animate-spin text-emerald-600' />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit SK Radius Biaya</CardTitle>
                <CardDescription>
                    Ubah data Surat Keputusan Panjar Biaya Perkara.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Tahun <span className='text-red-500'>*</span></Label>
                            <Input
                                type='number'
                                value={formData.tahun || currentYear}
                                onChange={e => setFormData(prev => ({ ...prev, tahun: parseInt(e.target.value) || currentYear }))}
                                placeholder='2025'
                                min={2000}
                                max={2100}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Status</Label>
                            <Select
                                value={formData.is_active ? 'true' : 'false'}
                                onValueChange={v => setFormData(prev => ({ ...prev, is_active: v === 'true' }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='true'>Aktif</SelectItem>
                                    <SelectItem value='false'>Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>Nomor SK <span className='text-red-500'>*</span></Label>
                        <Input
                            value={formData.nomor_sk || ''}
                            onChange={e => setFormData(prev => ({ ...prev, nomor_sk: e.target.value }))}
                            placeholder='1307/KPA.W17-A8/HK1.2.5/XII/2025'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Tentang <span className='text-red-500'>*</span></Label>
                        <Textarea
                            value={formData.tentang || ''}
                            onChange={e => setFormData(prev => ({ ...prev, tentang: e.target.value }))}
                            placeholder='Panjar Biaya Perkara Perdata pada Pengadilan Agama Penajam'
                            rows={2}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>URL Dokumen (Google Drive / External)</Label>
                        <Input
                            value={formData.file_url || ''}
                            onChange={e => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                            placeholder='https://drive.google.com/file/d/...'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Upload File Baru (Opsional)</Label>
                        <Input
                            type='file'
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            accept='.pdf,.doc,.docx'
                        />
                        <p className='text-xs text-muted-foreground'>
                            Format: PDF, DOC, DOCX. Maks 5MB. Upload file akan mengoverride URL jika diisi.
                        </p>
                        {formData.file_url && !file && (
                            <p className='text-xs text-blue-600'>
                                URL saat ini: {formData.file_url}
                            </p>
                        )}
                        {file && (
                            <p className='text-xs text-emerald-600 font-medium'>
                                File baru dipilih: {file.name}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label>Metadata JSON</Label>
                        <Textarea
                            value={metadataJson}
                            onChange={e => setMetadataJson(e.target.value)}
                            placeholder='Paste JSON metadata SK di sini...'
                            rows={10}
                            className='font-mono text-xs'
                        />
                        <p className='text-xs text-muted-foreground'>
                            JSON metadata berisi dasar hukum, klasifikasi radius, dan komponen panjar biaya.
                        </p>
                    </div>

                    <div className='pt-4 flex justify-end gap-2'>
                        <Link href='/radius-biaya'><Button type='button' variant='outline'>Batal</Button></Link>
                        <Button type='submit' className='bg-emerald-600 hover:bg-emerald-700' disabled={loading}>
                            {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
                            Update
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function SkRadiusBiayaEdit({ params }: { params: { id: string } }) {
    return (
        <div className='max-w-2xl mx-auto space-y-6'>
            <BlurFade delay={0.1} inView>
                <div className='flex items-center gap-4'>
                    <Link href='/radius-biaya'><Button variant='outline' size='icon'><ArrowLeft className='h-4 w-4' /></Button></Link>
                    <h2 className='text-2xl font-bold tracking-tight'>Edit SK Radius Biaya</h2>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Suspense fallback={
                    <Card>
                        <CardContent className='flex justify-center items-center h-48'>
                            <Loader2 className='h-8 w-8 animate-spin text-emerald-600' />
                        </CardContent>
                    </Card>
                }>
                    <SkRadiusBiayaEditForm id={parseInt(params.id)} />
                </Suspense>
            </BlurFade>
        </div>
    );
}
