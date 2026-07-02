'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  createProfilPimpinan,
  updateProfilPimpinan,
  type ProfilPimpinan,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BlurFade } from '@/components/ui/blur-fade';
import { ChevronLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react';

type PendidikanRow = { jenjang: string; institusi: string; tahun: string };
type PekerjaanRow = { jabatan: string; instansi: string; tahun: string };
type PenghargaanRow = { nama: string; tahun: string };

interface ProfilPimpinanFormProps {
  mode: 'create' | 'edit';
  initialData?: ProfilPimpinan | null;
}

const DEFAULT_PENDIDIKAN: PendidikanRow = { jenjang: '', institusi: '', tahun: '' };
const DEFAULT_PEKERJAAN: PekerjaanRow = { jabatan: '', instansi: '', tahun: '' };
const DEFAULT_PENGHARGAAN: PenghargaanRow = { nama: '', tahun: '' };

function normalizePendidikan(rows?: ProfilPimpinan['riwayat_pendidikan']): PendidikanRow[] {
  return rows && rows.length > 0 ? rows : [DEFAULT_PENDIDIKAN];
}

function normalizePekerjaan(rows?: ProfilPimpinan['riwayat_pekerjaan']): PekerjaanRow[] {
  return rows && rows.length > 0 ? rows : [DEFAULT_PEKERJAAN];
}

function normalizePenghargaan(rows?: ProfilPimpinan['penghargaan']): PenghargaanRow[] {
  return rows && rows.length > 0 ? rows : [DEFAULT_PENGHARGAAN];
}

export function ProfilPimpinanForm({ mode, initialData }: ProfilPimpinanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<ProfilPimpinan>>({
    slug: initialData?.slug ?? '',
    nama: initialData?.nama ?? '',
    jabatan: initialData?.jabatan ?? '',
    golongan_pangkat: initialData?.golongan_pangkat ?? '',
    tmt_jabatan: initialData?.tmt_jabatan ?? '',
    foto_url: initialData?.foto_url ?? '',
    profil_link: initialData?.profil_link ?? '',
    status_aktif: initialData?.status_aktif ?? true,
    status_label: initialData?.status_label ?? 'Aktif',
    urutan: initialData?.urutan ?? 0,
    published: initialData?.published ?? false,
  });

  const [riwayatPendidikan, setRiwayatPendidikan] = useState<PendidikanRow[]>(
    normalizePendidikan(initialData?.riwayat_pendidikan)
  );
  const [riwayatPekerjaan, setRiwayatPekerjaan] = useState<PekerjaanRow[]>(
    normalizePekerjaan(initialData?.riwayat_pekerjaan)
  );
  const [penghargaan, setPenghargaan] = useState<PenghargaanRow[]>(
    normalizePenghargaan(initialData?.penghargaan)
  );

  const pageTitle = mode === 'create' ? 'Tambah Profil Pimpinan' : 'Edit Profil Pimpinan';
  const pageDescription =
    mode === 'create'
      ? 'Tambahkan profil Ketua atau Wakil Ketua secara terstruktur.'
      : 'Perbarui data profil pimpinan yang sudah ada.';

  const canPreviewCurrentImage = useMemo(
    () => Boolean(initialData?.foto_url && !fotoFile),
    [initialData?.foto_url, fotoFile]
  );

  const set = (key: keyof ProfilPimpinan, value: string | number | boolean | undefined | null) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const updateArrayRow = <T extends Record<string, string>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    key: keyof T,
    value: string
  ) => {
    setter((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const appendRow = <T extends Record<string, string>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => setter((prev) => [...prev, value]);

  const removeRow = <T extends Record<string, string>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    fallback: T
  ) => {
    setter((prev) => {
      if (prev.length === 1) return [fallback];
      return prev.filter((_, i) => i !== index);
    });
  };

  function buildFormData(): FormData {
    const payload = new FormData();

    payload.append('slug', String(formData.slug ?? ''));
    payload.append('nama', String(formData.nama ?? ''));
    payload.append('jabatan', String(formData.jabatan ?? ''));
    payload.append('golongan_pangkat', String(formData.golongan_pangkat ?? ''));
    payload.append('tmt_jabatan', String(formData.tmt_jabatan ?? ''));
    payload.append('foto_url', String(formData.foto_url ?? ''));
    payload.append('profil_link', String(formData.profil_link ?? ''));
    payload.append('status_aktif', formData.status_aktif ? '1' : '0');
    payload.append('status_label', String(formData.status_label ?? ''));
    payload.append('urutan', String(formData.urutan ?? 0));
    payload.append('published', formData.published ? '1' : '0');

    if (fotoFile) {
      payload.append('foto_file', fotoFile);
    }

    riwayatPendidikan.forEach((row, index) => {
      payload.append(`riwayat_pendidikan[${index}][jenjang]`, row.jenjang);
      payload.append(`riwayat_pendidikan[${index}][institusi]`, row.institusi);
      payload.append(`riwayat_pendidikan[${index}][tahun]`, row.tahun);
    });

    riwayatPekerjaan.forEach((row, index) => {
      payload.append(`riwayat_pekerjaan[${index}][jabatan]`, row.jabatan);
      payload.append(`riwayat_pekerjaan[${index}][instansi]`, row.instansi);
      payload.append(`riwayat_pekerjaan[${index}][tahun]`, row.tahun);
    });

    penghargaan.forEach((row, index) => {
      payload.append(`penghargaan[${index}][nama]`, row.nama);
      payload.append(`penghargaan[${index}][tahun]`, row.tahun);
    });

    return payload;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!String(formData.slug ?? '').trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Slug wajib diisi.' });
      return;
    }
    if (!String(formData.nama ?? '').trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Nama wajib diisi.' });
      return;
    }
    if (!String(formData.jabatan ?? '').trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Jabatan wajib diisi.' });
      return;
    }

    setLoading(true);
    try {
      const payload = buildFormData();
      const result =
        mode === 'create'
          ? await createProfilPimpinan(payload)
          : await updateProfilPimpinan(Number(initialData?.id), payload);

      if (result.success) {
        toast({
          title: 'Sukses',
          description:
            mode === 'create'
              ? 'Profil pimpinan berhasil ditambahkan.'
              : 'Profil pimpinan berhasil diperbarui.',
        });
        router.push('/profil-pimpinan');
      } else {
        toast({
          variant: 'destructive',
          title: 'Gagal',
          description: result.message || 'Terjadi kesalahan saat menyimpan.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan data.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <BlurFade delay={0.1} inView>
        <div className="flex items-center gap-4">
          <Link href="/profil-pimpinan">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Form Profil Pimpinan</CardTitle>
              <CardDescription>
                Kelola profil Ketua dan Wakil Ketua dengan data terstruktur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="utama" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="utama">Informasi Utama</TabsTrigger>
                  <TabsTrigger value="pendidikan">Pendidikan</TabsTrigger>
                  <TabsTrigger value="pekerjaan">Pekerjaan</TabsTrigger>
                  <TabsTrigger value="penghargaan">Penghargaan</TabsTrigger>
                </TabsList>

                <TabsContent value="utama" className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Slug <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="ketua / wakil-ketua"
                        value={formData.slug || ''}
                        onChange={(e) => set('slug', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Nama lengkap pimpinan"
                        value={formData.nama || ''}
                        onChange={(e) => set('nama', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jabatan <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Ketua / Wakil Ketua Pengadilan Agama Penajam"
                        value={formData.jabatan || ''}
                        onChange={(e) => set('jabatan', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Golongan / Pangkat</Label>
                      <Input
                        placeholder="Hakim Madya Pratama, IV/a"
                        value={formData.golongan_pangkat || ''}
                        onChange={(e) => set('golongan_pangkat', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>TMT Jabatan</Label>
                      <Input
                        type="date"
                        value={formData.tmt_jabatan || ''}
                        onChange={(e) => set('tmt_jabatan', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Urutan</Label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.urutan ?? 0}
                        onChange={(e) => set('urutan', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status Label</Label>
                      <Input
                        placeholder="Aktif"
                        value={formData.status_label || ''}
                        onChange={(e) => set('status_label', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link Profil Eksternal</Label>
                      <Input
                        type="url"
                        placeholder="https://simtepa.mahkamahagung.go.id/..."
                        value={formData.profil_link || ''}
                        onChange={(e) => set('profil_link', e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>URL Foto</Label>
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={formData.foto_url || ''}
                        onChange={(e) => set('foto_url', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Foto</Label>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>

                  {canPreviewCurrentImage ? (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium mb-3">Foto saat ini</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={String(initialData?.foto_url)}
                        alt={String(initialData?.nama || 'Profil pimpinan')}
                        className="h-36 rounded-lg object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status Aktif</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        value={String(Boolean(formData.status_aktif))}
                        onChange={(e) => set('status_aktif', e.target.value === 'true')}
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Published</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        value={String(Boolean(formData.published))}
                        onChange={(e) => set('published', e.target.value === 'true')}
                      >
                        <option value="false">Draft</option>
                        <option value="true">Published</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pendidikan" className="space-y-4">
                  {riwayatPendidikan.map((row, index) => (
                    <Card key={`pendidikan-${index}`} className="border-dashed">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Riwayat Pendidikan #{index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeRow(setRiwayatPendidikan, index, DEFAULT_PENDIDIKAN)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Jenjang</Label>
                            <Input
                              placeholder="S2 / S1 / SLTA"
                              value={row.jenjang}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPendidikan, index, 'jenjang', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Institusi</Label>
                            <Textarea
                              rows={2}
                              placeholder="Nama institusi"
                              value={row.institusi}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPendidikan, index, 'institusi', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Input
                              placeholder="2021"
                              value={row.tahun}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPendidikan, index, 'tahun', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendRow(setRiwayatPendidikan, { ...DEFAULT_PENDIDIKAN })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Riwayat Pendidikan
                  </Button>
                </TabsContent>

                <TabsContent value="pekerjaan" className="space-y-4">
                  {riwayatPekerjaan.map((row, index) => (
                    <Card key={`pekerjaan-${index}`} className="border-dashed">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Riwayat Pekerjaan #{index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(setRiwayatPekerjaan, index, DEFAULT_PEKERJAAN)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Jabatan</Label>
                            <Input
                              placeholder="Ketua / Hakim / Cakim"
                              value={row.jabatan}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPekerjaan, index, 'jabatan', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Instansi</Label>
                            <Textarea
                              rows={2}
                              placeholder="Nama instansi"
                              value={row.instansi}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPekerjaan, index, 'instansi', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Input
                              placeholder="2026"
                              value={row.tahun}
                              onChange={(e) =>
                                updateArrayRow(setRiwayatPekerjaan, index, 'tahun', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendRow(setRiwayatPekerjaan, { ...DEFAULT_PEKERJAAN })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Riwayat Pekerjaan
                  </Button>
                </TabsContent>

                <TabsContent value="penghargaan" className="space-y-4">
                  {penghargaan.map((row, index) => (
                    <Card key={`penghargaan-${index}`} className="border-dashed">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Penghargaan #{index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(setPenghargaan, index, DEFAULT_PENGHARGAAN)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Nama Penghargaan</Label>
                            <Textarea
                              rows={2}
                              placeholder="SATYALANCANA KARYA SATYA X TAHUN"
                              value={row.nama}
                              onChange={(e) =>
                                updateArrayRow(setPenghargaan, index, 'nama', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Input
                              placeholder="2019"
                              value={row.tahun}
                              onChange={(e) =>
                                updateArrayRow(setPenghargaan, index, 'tahun', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendRow(setPenghargaan, { ...DEFAULT_PENGHARGAAN })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Penghargaan
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {mode === 'create' ? 'Simpan' : 'Simpan Perubahan'}
                </Button>
                <Link href="/profil-pimpinan">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </BlurFade>
    </div>
  );
}
