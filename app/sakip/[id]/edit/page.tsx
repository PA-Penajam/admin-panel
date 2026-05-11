'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSakip, updateSakip, JENIS_DOKUMEN_SAKIP, type Sakip } from '@/lib/api';
import { getYearOptions } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { Badge } from '@/components/ui/badge';

const today = () => new Date().toISOString().slice(0, 10);

export default function SakipEdit() {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string);
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<Partial<Sakip>>({});
    const [fileDokumen, setFileDokumen] = useState<File | null>(null);
    const [isRevision, setIsRevision] = useState(false);
    const [revisionData, setRevisionData] = useState({
        link_dokumen: '',
        tanggal_publish: today(),
        keterangan_revisi: '',
    });

    const nextRevision = (formData.revisions?.length || 0) + 1;
    const hasInitialDocument = Boolean(formData.link_dokumen?.trim());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSakip(id);
                if (data) {
                    setFormData(data);
                } else {
                    toast({ title: 'Error', description: 'Data tidak ditemukan.', variant: 'destructive' });
                    router.push('/sakip');
                }
            } catch {
                toast({ title: 'Error', description: 'Gagal memuat data.', variant: 'destructive' });
                router.push('/sakip');
            }
            setFetching(false);
        };
        fetchData();
    }, [id, router, toast]);

    const appendBaseFields = (payload: FormData) => {
        (['tahun', 'jenis_dokumen', 'uraian', 'link_dokumen', 'tanggal_publish'] as const).forEach(key => {
            const val = formData[key];
            if (val !== null && val !== undefined && String(val).trim() !== '') {
                payload.append(key, String(val));
            }
        });
    };

    const appendRevisionFields = (payload: FormData) => {
        payload.append('is_revisi', '1');
        payload.append('tanggal_publish', revisionData.tanggal_publish);
        if (revisionData.link_dokumen.trim()) {
            payload.append('link_dokumen', revisionData.link_dokumen.trim());
        }
        if (revisionData.keterangan_revisi.trim()) {
            payload.append('keterangan_revisi', revisionData.keterangan_revisi.trim());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRevision && !hasInitialDocument) {
            toast({
                title: 'Dokumen awal belum ada',
                description: 'Simpan dokumen awal terlebih dahulu sebelum membuat revisi.',
                variant: 'destructive',
            });
            return;
        }

        if (isRevision && !revisionData.tanggal_publish) {
            toast({ title: 'Tanggal publish wajib diisi.', variant: 'destructive' });
            return;
        }

        if (isRevision && !revisionData.link_dokumen.trim() && !fileDokumen) {
            toast({
                title: 'Dokumen revisi wajib diisi',
                description: 'Isi link dokumen revisi atau unggah file revisi.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            const dataToSend = new FormData();
            if (isRevision) {
                appendRevisionFields(dataToSend);
            } else {
                appendBaseFields(dataToSend);
            }
            if (fileDokumen) dataToSend.append('file_dokumen', fileDokumen);

            const result = await updateSakip(id, dataToSend);
            if (result.success) {
                toast({
                    title: 'Sukses',
                    description: isRevision ? `Revisi ${nextRevision} berhasil ditambahkan!` : 'Data berhasil diperbarui!',
                });
                router.push('/sakip');
            } else {
                toast({ variant: 'destructive', title: 'Gagal', description: result.message || 'Terjadi kesalahan.' });
            }
        } catch {
            toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat menyimpan.' });
        }
        setLoading(false);
    };

    if (fetching) return (
        <div className='flex justify-center items-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
        </div>
    );

    return (
        <div className='max-w-2xl mx-auto space-y-6'>
            <BlurFade delay={0.1} inView>
                <div className='flex items-center gap-4'>
                    <Link href='/sakip'><Button variant='outline' size='icon'><ArrowLeft className='h-4 w-4' /></Button></Link>
                    <h2 className='text-2xl font-bold tracking-tight'>Edit Dokumen SAKIP</h2>
                </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit {formData.jenis_dokumen} — Tahun {formData.tahun}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>Tahun <span className='text-red-500'>*</span></Label>
                                    <Select
                                        value={String(formData.tahun || '')}
                                        onValueChange={v => setFormData(prev => ({ ...prev, tahun: parseInt(v) }))}
                                        disabled={isRevision}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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
                                        disabled={isRevision}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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
                                    rows={4}
                                    disabled={isRevision}
                                />
                            </div>

                            <div className='rounded-md border p-3'>
                                <div className='flex items-start gap-3'>
                                    <input
                                        id='is_revisi'
                                        type='checkbox'
                                        checked={isRevision}
                                        onChange={e => {
                                            setIsRevision(e.target.checked);
                                            setFileDokumen(null);
                                        }}
                                        className='mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600'
                                    />
                                    <div className='space-y-2'>
                                        <Label htmlFor='is_revisi' className='font-medium'>Ini revisi dokumen</Label>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <Badge variant='outline'>Revisi {nextRevision}</Badge>
                                            {formData.latest_revision && (
                                                <Badge className='bg-indigo-600'>Terakhir Revisi {formData.latest_revision.revisi_ke}</Badge>
                                            )}
                                        </div>
                                        {isRevision && !hasInitialDocument && (
                                            <p className='text-xs text-red-600'>Belum ada dokumen awal.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isRevision ? (
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
                            ) : (
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label>Link Dokumen Revisi</Label>
                                            <Input
                                                value={revisionData.link_dokumen}
                                                onChange={e => setRevisionData(prev => ({ ...prev, link_dokumen: e.target.value }))}
                                                placeholder='https://drive.google.com/...'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Tanggal Publish Revisi <span className='text-red-500'>*</span></Label>
                                            <Input
                                                type='date'
                                                value={revisionData.tanggal_publish}
                                                onChange={e => setRevisionData(prev => ({ ...prev, tanggal_publish: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Keterangan Revisi</Label>
                                        <Textarea
                                            value={revisionData.keterangan_revisi}
                                            onChange={e => setRevisionData(prev => ({ ...prev, keterangan_revisi: e.target.value }))}
                                            rows={3}
                                            placeholder='Contoh: Perbaikan target kinerja atau penyesuaian lampiran.'
                                        />
                                    </div>
                                </div>
                            )}

                            <div className='space-y-2'>
                                <Label>{isRevision ? 'File Dokumen Revisi' : 'File Dokumen'}</Label>
                                {formData.link_dokumen && (
                                    <div className='mb-2'>
                                        <a
                                            href={formData.link_dokumen}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline'
                                        >
                                            <ExternalLink className='h-3 w-3' />
                                            Dokumen awal
                                        </a>
                                    </div>
                                )}
                                <Input
                                    key={isRevision ? 'revision-file' : 'main-file'}
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
                                    {isRevision ? `Simpan Revisi ${nextRevision}` : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
