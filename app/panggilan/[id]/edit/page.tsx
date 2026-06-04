'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getPanggilan, updatePanggilan, type Panggilan } from '@/lib/api';
import { getYearOptions, formatDateForInput } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Upload, FileText, ExternalLink } from 'lucide-react';

export default function EditPanggilan() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Panggilan>({
    tahun_perkara: new Date().getFullYear(),
    nomor_perkara: '',
    nama_dipanggil: '',
    alamat_asal: '',
    panggilan_1: '',
    panggilan_2: '',
    panggilan_ikrar: '',
    tanggal_sidang: '',
    pip: '',
    link_surat: '',
    link_pbt: '',
    keterangan: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [pbtFile, setPbtFile] = useState<File | null>(null);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPanggilan(id);
        if (data) {
          setFormData({
            ...data,
            panggilan_1: formatDateForInput(data.panggilan_1),
            panggilan_2: formatDateForInput(data.panggilan_2),
            panggilan_ikrar: formatDateForInput(data.panggilan_ikrar),
            tanggal_sidang: formatDateForInput(data.tanggal_sidang),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Gagal",
            description: "Data tidak ditemukan.",
          });
          router.push('/panggilan');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data.",
        });
      }
      setLoading(false);
    };

    if (id) loadData();
  }, [id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData(prev => ({ ...prev, tahun_perkara: parseInt(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePbtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPbtFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('tahun_perkara', String(formData.tahun_perkara));
      dataToSend.append('nomor_perkara', formData.nomor_perkara);
      dataToSend.append('nama_dipanggil', formData.nama_dipanggil);
      dataToSend.append('alamat_asal', formData.alamat_asal || '');
      dataToSend.append('panggilan_1', formData.panggilan_1 || '');
      dataToSend.append('panggilan_2', formData.panggilan_2 || '');
      dataToSend.append('panggilan_ikrar', formData.panggilan_ikrar || '');
      dataToSend.append('tanggal_sidang', formData.tanggal_sidang || '');
      dataToSend.append('pip', formData.pip || '');
      dataToSend.append('keterangan', formData.keterangan || '');

      if (file) {
        dataToSend.append('file_upload', file);
      }

      if (pbtFile) {
        dataToSend.append('file_upload_pbt', pbtFile);
      }

      const result = await updatePanggilan(id, dataToSend);

      if (result.success) {
        toast({
          title: "Sukses",
          description: "Data berhasil diupdate!",
        });
        setTimeout(() => router.push('/panggilan'), 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: result.message || 'Gagal mengupdate data.',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan. Pastikan API terhubung.",
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center gap-4">
        <Link href="/panggilan">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Data</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Panggilan Ghaib</CardTitle>
          <CardDescription>Perbarui data perkara dan informasi pihak yang dipanggil.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Informasi Perkara */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tahun_perkara">Tahun Perkara *</Label>
                <Select
                  value={formData.tahun_perkara.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearOptions().map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomor_perkara">Nomor Perkara *</Label>
                <Input
                  id="nomor_perkara"
                  name="nomor_perkara"
                  value={formData.nomor_perkara}
                  onChange={handleChange}
                  placeholder="Contoh: 22/Pdt.G/2025/PA.pnj"
                  required
                />
              </div>
            </div>

            {/* Identitas Pihak */}
            <div className="space-y-2">
              <Label htmlFor="nama_dipanggil">Nama Yang Dipanggil *</Label>
              <Input
                id="nama_dipanggil"
                name="nama_dipanggil"
                value={formData.nama_dipanggil}
                onChange={handleChange}
                placeholder="Nama lengkap pihak"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_asal">Alamat Asal</Label>
              <Textarea
                id="alamat_asal"
                name="alamat_asal"
                value={formData.alamat_asal || ''}
                onChange={handleChange}
                placeholder="Alamat lengkap pihak ghaib"
                rows={3}
              />
            </div>

            {/* Jadwal Sidang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panggilan_1">Tanggal Panggilan I</Label>
                <Input
                  type="date"
                  id="panggilan_1"
                  name="panggilan_1"
                  value={formData.panggilan_1 || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panggilan_2">Tanggal Panggilan II</Label>
                <Input
                  type="date"
                  id="panggilan_2"
                  name="panggilan_2"
                  value={formData.panggilan_2 || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panggilan_ikrar">Tanggal Panggilan Ikrar</Label>
                <Input
                  type="date"
                  id="panggilan_ikrar"
                  name="panggilan_ikrar"
                  value={formData.panggilan_ikrar || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggal_sidang">Tanggal Sidang</Label>
                <Input
                  type="date"
                  id="tanggal_sidang"
                  name="tanggal_sidang"
                  value={formData.tanggal_sidang || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Dokumen & Lainnya */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pip">PIP</Label>
                <Input
                  id="pip"
                  name="pip"
                  value={formData.pip || ''}
                  onChange={handleChange}
                  placeholder="Petugas informasi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_upload">Upload Surat Panggilan</Label>

                {formData.link_surat && (
                  <div className="mb-2">
                    <a
                      href={formData.link_surat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" /> Lihat File Saat Ini <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    id="file_upload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Upload file baru untuk mengganti. Max 5MB.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="file_upload_pbt">Upload PBT (Pemberitahuan Isi Putusan)</Label>

                {formData.link_pbt && (
                  <div className="mb-2">
                    <a
                      href={formData.link_pbt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" /> Lihat File PBT Saat Ini <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    id="file_upload_pbt"
                    type="file"
                    onChange={handlePbtFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Upload file baru untuk mengganti. Max 5MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan Tambahan</Label>
              <Textarea
                id="keterangan"
                name="keterangan"
                value={formData.keterangan || ''}
                onChange={handleChange}
                placeholder="Informasi tambahan lain jika ada"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? (
                  <>Menyimpan...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Update Data</>
                )}
              </Button>
              <Link href="/panggilan">
                <Button variant="secondary" type="button" className="w-full md:w-auto">Batal</Button>
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
