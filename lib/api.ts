// API Configuration
const API_URL = '/api/proxy';

export interface Panggilan {
  id?: number;
  tahun_perkara: number;
  nomor_perkara: string;
  nama_dipanggil: string;
  alamat_asal?: string;
  panggilan_1?: string;
  panggilan_2?: string;
  panggilan_ikrar?: string;
  tanggal_sidang?: string;
  pip?: string;
  link_surat?: string;
  link_pbt?: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ItsbatNikah {
  id?: number;
  tahun_perkara: number;
  nomor_perkara: string;
  pemohon_1: string;
  pemohon_2: string;
  tanggal_pengumuman?: string;
  tanggal_sidang?: string;
  link_detail?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgendaPimpinan {
  id?: number;
  tanggal_agenda: string;
  isi_agenda: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilPimpinanRow {
  jenjang?: string;
  institusi?: string;
  tahun?: string;
  jabatan?: string;
  instansi?: string;
  nama?: string;
}

export interface ProfilPimpinan {
  id?: number;
  slug: string;
  nama: string;
  jabatan: string;
  golongan_pangkat?: string | null;
  tmt_jabatan?: string | null;
  foto_url?: string | null;
  profil_link?: string | null;
  status_aktif: boolean;
  status_label?: string | null;
  urutan: number;
  published: boolean;
  riwayat_pendidikan?: Array<{
    jenjang: string;
    institusi: string;
    tahun: string;
  }>;
  riwayat_pekerjaan?: Array<{
    jabatan: string;
    instansi: string;
    tahun: string;
  }>;
  penghargaan?: Array<{
    nama: string;
    tahun: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface Inovasi {
  id: number;
  nama_inovasi: string;
  deskripsi: string;
  kategori: string;
  link_dokumen?: string;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export interface SkInovasi {
  id: number;
  tahun: number;
  nomor_sk: string;
  tentang: string;
  file_path?: string;
  file_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

const normalizeApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const json = await response.json().catch(() => ({}));

  // Our APIs mostly use { success: boolean, ... }
  if (typeof json?.success === 'boolean') {
    return json as ApiResponse<T>;
  }

  // Agenda API currently uses { status: 'success' | 'error', ... }
  if (typeof json?.status === 'string') {
    const ok = json.status === 'success';
    return {
      success: ok,
      data: json.data as T | undefined,
      message: json.message,
      total: json.total,
      current_page: json.current_page,
      last_page: json.last_page,
      per_page: json.per_page,
    };
  }

  return {
    success: response.ok,
    data: json?.data as T | undefined,
    message: json?.message,
  };
};

// Header request dari browser. API key ditambahkan oleh proxy server-side.
const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// ==========================================
// API PANGGILAN GHAIB
// ==========================================

// GET - Ambil semua data
export async function getAllPanggilan(tahun?: number, page = 1): Promise<ApiResponse<Panggilan[]>> {
  let url = `${API_URL}/panggilan?page=${page}`;
  if (tahun) {
    url += `&tahun=${tahun}`;
  }
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

// GET - Ambil satu data
export async function getPanggilan(id: number): Promise<Panggilan | null> {
  const response = await fetch(`${API_URL}/panggilan/${id}`);
  const result: ApiResponse<Panggilan> = await response.json();
  return result.data || null;
}

// POST - Tambah data baru
export async function createPanggilan(data: Panggilan | FormData): Promise<ApiResponse<Panggilan>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/panggilan`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// PUT - Update data
export async function updatePanggilan(id: number, data: Panggilan | FormData): Promise<ApiResponse<Panggilan>> {
  const isFormData = data instanceof FormData;

  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/panggilan/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// DELETE - Hapus data
export async function deletePanggilan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/panggilan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}

// ==========================================
// API ITSBAT NIKAH
// ==========================================

// GET - Ambil semua data Itsbat
export async function getAllItsbat(tahun?: number, page = 1): Promise<ApiResponse<ItsbatNikah[]>> {
  let url = `${API_URL}/itsbat?page=${page}`;
  if (tahun) {
    url += `&tahun=${tahun}`;
  }
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

// GET - Ambil satu data Itsbat
export async function getItsbat(id: number): Promise<ItsbatNikah | null> {
  const response = await fetch(`${API_URL}/itsbat/${id}`);
  const result: ApiResponse<ItsbatNikah> = await response.json();
  return result.data || null;
}

// POST - Tambah data Itsbat
export async function createItsbat(data: ItsbatNikah | FormData): Promise<ApiResponse<ItsbatNikah>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/itsbat`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// PUT - Update data Itsbat
export async function updateItsbat(id: number, data: ItsbatNikah | FormData): Promise<ApiResponse<ItsbatNikah>> {
  const isFormData = data instanceof FormData;
  // NOTE: For file uploads with method PUT/PATCH, some servers might have issues parsing multipart/form-data directly.
  // Laravel/Lumen usually handles POST with _method=PUT better for file uploads.
  // We will force POST and add _method=PUT if it's FormData

  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/itsbat/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// DELETE - Hapus data Itsbat
export async function deleteItsbat(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/itsbat/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}

// ==========================================
// API PANGGILAN E-COURT
// ==========================================

export interface PanggilanEcourt {
  id?: number;
  tahun_perkara: number;
  nomor_perkara: string;
  nama_dipanggil: string;
  alamat_asal?: string;
  panggilan_1?: string;
  panggilan_2?: string;
  panggilan_3?: string;
  panggilan_ikrar?: string;
  tanggal_sidang?: string;
  pip?: string;
  link_surat?: string;
  link_pbt?: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

// GET - Ambil semua data
export async function getAllPanggilanEcourt(tahun?: number, page = 1): Promise<ApiResponse<PanggilanEcourt[]>> {
  let url = `${API_URL}/panggilan-ecourt?page=${page}`;
  if (tahun) {
    url += `&tahun=${tahun}`;
  }
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

// GET - Ambil satu data
export async function getPanggilanEcourt(id: number): Promise<PanggilanEcourt | null> {
  const response = await fetch(`${API_URL}/panggilan-ecourt/${id}`);
  const result: ApiResponse<PanggilanEcourt> = await response.json();
  return result.data || null;
}

// POST - Tambah data baru
export async function createPanggilanEcourt(data: PanggilanEcourt | FormData): Promise<ApiResponse<PanggilanEcourt>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/panggilan-ecourt`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// PUT - Update data
export async function updatePanggilanEcourt(id: number, data: PanggilanEcourt | FormData): Promise<ApiResponse<PanggilanEcourt>> {
  const isFormData = data instanceof FormData;

  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/panggilan-ecourt/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// DELETE - Hapus data
export async function deletePanggilanEcourt(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/panggilan-ecourt/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}

// ==========================================
// API AGENDA PIMPINAN
// ==========================================

export async function getAllAgenda(tahun?: number, bulan?: string, page = 1, perPage: number | 'all' = 10): Promise<ApiResponse<AgendaPimpinan[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (bulan) qs.push(`bulan=${encodeURIComponent(bulan)}`);
  qs.push(`page=${page}`);
  qs.push(`per_page=${encodeURIComponent(String(perPage))}`);
  const url = `${API_URL}/agenda?${qs.join('&')}`;

  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<AgendaPimpinan[]>(response);
}

export async function getAgenda(id: number): Promise<AgendaPimpinan | null> {
  const response = await fetch(`${API_URL}/agenda/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<AgendaPimpinan>(response);
  return result.data || null;
}

export async function createAgenda(data: AgendaPimpinan): Promise<ApiResponse<AgendaPimpinan>> {
  const response = await fetch(`${API_URL}/agenda`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<AgendaPimpinan>(response);
}

export async function updateAgenda(id: number, data: Partial<AgendaPimpinan>): Promise<ApiResponse<AgendaPimpinan>> {
  const response = await fetch(`${API_URL}/agenda/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<AgendaPimpinan>(response);
}

export async function deleteAgenda(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/agenda/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API LHKPN
// ==========================================

export interface LhkpnReport {
  id?: number;
  nip: string;
  nama: string;
  jabatan: string;
  tahun: number;
  jenis_laporan: 'LHKPN' | 'SPT Tahunan';
  tanggal_lapor?: string;
  link_tanda_terima?: string; // URL
  link_pengumuman?: string; // URL
  link_spt?: string; // URL
  link_dokumen_pendukung?: string; // URL
  created_at?: string;
  updated_at?: string;
}

export interface RealisasiAnggaran {
  id?: number;
  dipa: string;
  kategori: string;
  bulan?: number;
  pagu: number;
  realisasi: number;
  sisa?: number;
  persentase?: number;
  tahun: number;
  keterangan?: string;
  link_dokumen?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllLhkpn(tahun?: number, page = 1, q?: string, jenis?: string): Promise<ApiResponse<LhkpnReport[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (q) qs.push(`q=${encodeURIComponent(q)}`);
  if (jenis) qs.push(`jenis=${encodeURIComponent(jenis)}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/lhkpn?${qs.join('&')}`;

  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<LhkpnReport[]>(response);
}

export async function getLhkpn(id: number): Promise<LhkpnReport | null> {
  const response = await fetch(`${API_URL}/lhkpn/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<LhkpnReport>(response);
  return result.data || null;
}

export async function createLhkpn(data: LhkpnReport | FormData): Promise<ApiResponse<LhkpnReport>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/lhkpn`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<LhkpnReport>(response);
}

export async function updateLhkpn(id: number, data: Partial<LhkpnReport> | FormData): Promise<ApiResponse<LhkpnReport>> {
  const isFormData = data instanceof FormData;

  // For file uploads, use POST with _method=PUT
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/lhkpn/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<LhkpnReport>(response);
}

export async function deleteLhkpn(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/lhkpn/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API REALISASI ANGGARAN
// ==========================================

export async function getAllAnggaran(tahun?: number, dipa?: string, bulan?: number, page = 1): Promise<ApiResponse<RealisasiAnggaran[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (dipa) qs.push(`dipa=${encodeURIComponent(dipa)}`);
  if (bulan) qs.push(`bulan=${encodeURIComponent(String(bulan))}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/anggaran?${qs.join('&')}`;

  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<RealisasiAnggaran[]>(response);
}

export async function getAnggaran(id: number): Promise<RealisasiAnggaran | null> {
  const response = await fetch(`${API_URL}/anggaran/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<RealisasiAnggaran>(response);
  return result.data || null;
}

export async function createAnggaran(data: RealisasiAnggaran | FormData): Promise<ApiResponse<RealisasiAnggaran>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/anggaran`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<RealisasiAnggaran>(response);
}

export async function updateAnggaran(id: number, data: Partial<RealisasiAnggaran> | FormData): Promise<ApiResponse<RealisasiAnggaran>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/anggaran/${id}`, {
    method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<RealisasiAnggaran>(response);
}

export async function deleteAnggaran(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/anggaran/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API PAGU ANGGARAN
// ==========================================

export interface PaguAnggaran {
  id?: number;
  dipa: string;
  kategori: string;
  jumlah_pagu: number;
  tahun: number;
}

export interface DipaPok {
  id?: number;
  kode_dipa?: number;
  thn_dipa: number;
  revisi_dipa: string;
  jns_dipa: string;
  tgl_dipa: string;
  alokasi_dipa: number;
  doc_dipa?: string;
  doc_pok?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllPagu(tahun?: number, dipa?: string): Promise<ApiResponse<PaguAnggaran[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (dipa) qs.push(`dipa=${encodeURIComponent(dipa)}`);
  const url = qs.length ? `${API_URL}/pagu?${qs.join('&')}` : `${API_URL}/pagu`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<PaguAnggaran[]>(response);
}

export async function updatePagu(data: PaguAnggaran): Promise<ApiResponse<PaguAnggaran>> {
  const response = await fetch(`${API_URL}/pagu`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<PaguAnggaran>(response);
}

export async function deletePagu(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/pagu/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API DIPA POK
// ==========================================

export async function getAllDipaPok(tahun?: number, page = 1, q?: string): Promise<ApiResponse<DipaPok[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (q) qs.push(`q=${encodeURIComponent(q)}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/dipapok?${qs.join('&')}`;

  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<DipaPok[]>(response);
}

export async function getDipaPok(id: number): Promise<DipaPok | null> {
  const response = await fetch(`${API_URL}/dipapok/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<DipaPok>(response);
  return result.data || null;
}

export async function createDipaPok(data: DipaPok | FormData): Promise<ApiResponse<DipaPok>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/dipapok`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<DipaPok>(response);
}

export async function updateDipaPok(id: number, data: Partial<DipaPok> | FormData): Promise<ApiResponse<DipaPok>> {
  const isFormData = data instanceof FormData;

  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/dipapok/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<DipaPok>(response);
}

export async function deleteDipaPok(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/dipapok/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API ASET BMN
// ==========================================

export const JENIS_LAPORAN_BMN = [
  'Laporan Posisi BMN Di Neraca - Semester I',
  'Laporan Posisi BMN Di Neraca - Semester II',
  'Laporan Posisi BMN Di Neraca - Tahunan',
  'Laporan Barang Kuasa Pengguna - Persediaan - Semester I',
  'Laporan Barang Kuasa Pengguna - Persediaan - Semester II',
  'Laporan Kondisi Barang - Tahunan',
] as const;

export type JenisLaporanBmn = typeof JENIS_LAPORAN_BMN[number];

export interface AsetBmn {
  id?: number;
  tahun: number;
  jenis_laporan: JenisLaporanBmn;
  link_dokumen?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllAsetBmn(tahun?: number): Promise<ApiResponse<AsetBmn[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  const url = qs.length ? `${API_URL}/aset-bmn?${qs.join('&')}` : `${API_URL}/aset-bmn`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<AsetBmn[]>(response);
}

export async function getAsetBmn(id: number): Promise<AsetBmn | null> {
  const response = await fetch(`${API_URL}/aset-bmn/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<AsetBmn>(response);
  return result.data || null;
}

export async function createAsetBmn(data: FormData | AsetBmn): Promise<ApiResponse<AsetBmn>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'POST';
  const body = isFormData ? data : JSON.stringify(data);
  const headers = isFormData ? getHeaders() : { ...getHeaders(), 'Content-Type': 'application/json' };

  const response = await fetch(`${API_URL}/aset-bmn`, {
    method,
    headers,
    body,
  });
  return normalizeApiResponse<AsetBmn>(response);
}

export async function updateAsetBmn(id: number, data: FormData | Partial<AsetBmn>): Promise<ApiResponse<AsetBmn>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  const body = isFormData ? (() => { data.append('_method', 'PUT'); return data; })() : JSON.stringify(data);
  const headers = isFormData ? getHeaders() : { ...getHeaders(), 'Content-Type': 'application/json' };

  const response = await fetch(`${API_URL}/aset-bmn/${id}`, {
    method,
    headers,
    body,
  });
  return normalizeApiResponse<AsetBmn>(response);
}

export async function deleteAsetBmn(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/aset-bmn/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API SAKIP
// ==========================================

export const KATEGORI_INOVASI = [
  'Inovasi Kebijakan',
  'Inovasi Aplikasi',
  'Inovasi Layanan Publik',
  'Aplikasi Ditjen Badilag',
  'Aplikasi PTA Samarinda',
] as const;

export const JENIS_DOKUMEN_SAKIP = [
  'Indikator Kinerja Utama',
  'Rencana Strategis',
  'Program Kerja',
  'Rencana Kinerja Tahunan',
  'Perjanjian Kinerja',
  'Rencana Aksi',
  'Laporan Kinerja Instansi Pemerintah',
] as const;

export type JenisDokumenSakip = typeof JENIS_DOKUMEN_SAKIP[number];

export interface SakipRevision {
  id?: number;
  sakip_id?: number;
  revisi_ke: number;
  tanggal_publish?: string | null;
  keterangan?: string | null;
  link_dokumen?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Sakip {
  id?: number;
  tahun: number;
  jenis_dokumen: JenisDokumenSakip;
  uraian?: string | null;
  link_dokumen?: string | null;
  tanggal_publish?: string | null;
  revisions?: SakipRevision[];
  latest_revision?: SakipRevision | null;
  dokumen_aktif?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllSakip(tahun?: number): Promise<ApiResponse<Sakip[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  const url = qs.length ? `${API_URL}/sakip?${qs.join('&')}` : `${API_URL}/sakip`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<Sakip[]>(response);
}

export async function getSakip(id: number): Promise<Sakip | null> {
  const response = await fetch(`${API_URL}/sakip/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<Sakip>(response);
  return result.data || null;
}

export async function createSakip(data: FormData | Sakip): Promise<ApiResponse<Sakip>> {
  const isFormData = data instanceof FormData;
  const body = isFormData ? data : JSON.stringify(data);

  const response = await fetch(`${API_URL}/sakip`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body,
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<Sakip>(response);
}

export async function updateSakip(id: number, data: FormData | Partial<Sakip>): Promise<ApiResponse<Sakip>> {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/sakip/${id}`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<Sakip>(response);
}

export async function updateSakipRevision(sakipId: number, revisionId: number, data: FormData): Promise<ApiResponse<Sakip>> {
  data.append('_method', 'PUT');
  const response = await fetch(`${API_URL}/sakip/${sakipId}/reviu/${revisionId}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<Sakip>(response);
}

export async function deleteSakipRevision(sakipId: number, revisionId: number): Promise<ApiResponse<Sakip>> {
  const response = await fetch(`${API_URL}/sakip/${sakipId}/reviu/${revisionId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<Sakip>(response);
}

export async function deleteSakip(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/sakip/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API LAPORAN PENGADUAN
// ==========================================

export const MATERI_PENGADUAN = [
  'Pelanggaran Terhadap Kode Etik Atau Pedoman Perilaku Hakim',
  'Penyalahgunaan Wewenang / Jabatan',
  'Pelanggaran Terhadap Disiplin PNS',
  'Perbuatan Tercela',
  'Pelanggaran Hukum Acara',
  'Kekeliruan Administrasi',
  'Pelayanan Publik Yang Tidak Memuaskan',
] as const;

export const BULAN_LAPORAN = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nop','des'] as const;
export const BULAN_LABELS: Record<string, string> = {
  jan:'Jan', feb:'Feb', mar:'Mar', apr:'Apr', mei:'Mei', jun:'Jun',
  jul:'Jul', agu:'Agu', sep:'Sep', okt:'Okt', nop:'Nop', des:'Des',
};

export type LaporanPengaduan = {
  id?: number;
  tahun: number;
  materi_pengaduan: typeof MATERI_PENGADUAN[number];
  jan?: number; feb?: number; mar?: number; apr?: number; mei?: number; jun?: number;
  jul?: number; agu?: number; sep?: number; okt?: number; nop?: number; des?: number;
  laporan_proses?: number; sisa?: number;
  created_at?: string; updated_at?: string;
};

export async function getAllLaporanPengaduan(tahun?: number): Promise<ApiResponse<LaporanPengaduan[]>> {
  const qs = tahun ? `?tahun=${encodeURIComponent(String(tahun))}` : '';
  const response = await fetch(`${API_URL}/laporan-pengaduan${qs}`, { cache: 'no-store' });
  return normalizeApiResponse<LaporanPengaduan[]>(response);
}

export async function getLaporanPengaduan(id: number): Promise<LaporanPengaduan | null> {
  const response = await fetch(`${API_URL}/laporan-pengaduan/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<LaporanPengaduan>(response);
  return result.data || null;
}

export async function createLaporanPengaduan(data: LaporanPengaduan): Promise<ApiResponse<LaporanPengaduan>> {
  const response = await fetch(`${API_URL}/laporan-pengaduan`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }
  return normalizeApiResponse<LaporanPengaduan>(response);
}

export async function updateLaporanPengaduan(id: number, data: Partial<LaporanPengaduan>): Promise<ApiResponse<LaporanPengaduan>> {
  const response = await fetch(`${API_URL}/laporan-pengaduan/${id}`, {
    method: 'PUT',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }
  return normalizeApiResponse<LaporanPengaduan>(response);
}

export async function deleteLaporanPengaduan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/laporan-pengaduan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API KEUANGAN PERKARA
// ==========================================

export interface KeuanganPerkara {
  id?: number;
  tahun: number;
  bulan: number;
  saldo_awal?: number | null;
  penerimaan?: number | null;
  pengeluaran?: number | null;
  url_detail?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const NAMA_BULAN_KEUANGAN = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

export async function getAllKeuanganPerkara(tahun?: number): Promise<ApiResponse<KeuanganPerkara[]>> {
  const qs = tahun ? `?tahun=${encodeURIComponent(String(tahun))}` : '';
  const response = await fetch(`${API_URL}/keuangan-perkara${qs}`, { cache: 'no-store' });
  return normalizeApiResponse<KeuanganPerkara[]>(response);
}

export async function getKeuanganPerkara(id: number): Promise<KeuanganPerkara | null> {
  const response = await fetch(`${API_URL}/keuangan-perkara/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<KeuanganPerkara>(response);
  return result.data || null;
}

async function handleKeuanganResponse(response: Response): Promise<ApiResponse<KeuanganPerkara>> {
  console.log('API Response status:', response.status, response.statusText);
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const text = await response.text();
      console.log('Error response body:', text);
      const err = JSON.parse(text);
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch (e) { 
      console.log('Failed to parse error response:', e);
      /* body kosong atau non-JSON */ 
    }
    return { success: false, message: msg };
  }
  return normalizeApiResponse<KeuanganPerkara>(response);
}

export async function createKeuanganPerkara(data: KeuanganPerkara | FormData): Promise<ApiResponse<KeuanganPerkara>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/keuangan-perkara`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleKeuanganResponse(response);
}

export async function updateKeuanganPerkara(id: number, data: Partial<KeuanganPerkara> | FormData): Promise<ApiResponse<KeuanganPerkara>> {
  const isFormData = data instanceof FormData;
  if (isFormData) (data as FormData).append('_method', 'PUT');
  const response = await fetch(`${API_URL}/keuangan-perkara/${id}`, {
    method: isFormData ? 'POST' : 'PUT',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleKeuanganResponse(response);
}

export async function deleteKeuanganPerkara(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/keuangan-perkara/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API SISA PANJAR
// ==========================================

export type StatusSisaPanjar = 'belum_diambil' | 'disetor_kas_negara';

export interface SisaPanjar {
  id?: number;
  tahun: number;
  bulan: number;
  nomor_perkara: string;
  nama_penggugat_pemohon: string;
  jumlah_sisa_panjar: number;
  status: StatusSisaPanjar;
  tanggal_setor_kas_negara?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const NAMA_BULAN = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

export async function getAllSisaPanjar(
  tahun?: number,
  status?: StatusSisaPanjar,
  bulan?: number,
  page = 1
): Promise<ApiResponse<SisaPanjar[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  if (status) qs.push(`status=${encodeURIComponent(status)}`);
  if (bulan) qs.push(`bulan=${encodeURIComponent(String(bulan))}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/sisa-panjar?${qs.join('&')}`;

  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<SisaPanjar[]>(response);
}

export async function getSisaPanjar(id: number): Promise<SisaPanjar | null> {
  const response = await fetch(`${API_URL}/sisa-panjar/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<SisaPanjar>(response);
  return result.data || null;
}

export async function createSisaPanjar(data: SisaPanjar): Promise<ApiResponse<SisaPanjar>> {
  const response = await fetch(`${API_URL}/sisa-panjar`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<SisaPanjar>(response);
}

export async function updateSisaPanjar(id: number, data: Partial<SisaPanjar>): Promise<ApiResponse<SisaPanjar>> {
  const response = await fetch(`${API_URL}/sisa-panjar/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<SisaPanjar>(response);
}

export async function deleteSisaPanjar(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/sisa-panjar/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API MOU
// ==========================================

export interface Mou {
  id?: number;
  tanggal: string;
  instansi: string;
  tentang: string;
  tanggal_berakhir?: string | null;
  link_dokumen?: string | null;
  tahun: number;
  status?: string;
  sisa_hari?: number | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllMou(tahun?: number, page = 1): Promise<ApiResponse<Mou[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/mou?${qs.join('&')}`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<Mou[]>(response);
}

export async function getMou(id: number): Promise<Mou | null> {
  const response = await fetch(`${API_URL}/mou/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<Mou>(response);
  return result.data || null;
}

export async function createMou(data: Mou | FormData): Promise<ApiResponse<Mou>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/mou`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<Mou>(response);
}

export async function updateMou(id: number, data: Partial<Mou> | FormData): Promise<ApiResponse<Mou>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }
  const response = await fetch(`${API_URL}/mou/${id}`, {
    method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<Mou>(response);
}

export async function deleteMou(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/mou/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API LRA (LAPORAN REALISASI ANGGARAN)
// ==========================================

export interface LraReport {
  id?: number;
  tahun: number;
  jenis_dipa: string;
  periode: string;
  judul: string;
  file_url?: string;
  cover_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// GET - Ambil semua data LRA
export async function getAllLra(tahun?: number, page = 1): Promise<ApiResponse<LraReport[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/lra?${qs.join('&')}`;
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

// GET - Ambil satu data LRA
export async function getLra(id: number): Promise<LraReport | null> {
  const response = await fetch(`${API_URL}/lra/${id}`);
  const result: ApiResponse<LraReport> = await response.json();
  return result.data || null;
}

// POST - Tambah data LRA baru
export async function createLra(data: LraReport | FormData): Promise<ApiResponse<LraReport>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/lra`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// PUT - Update data LRA
export async function updateLra(id: number, data: Partial<LraReport> | FormData): Promise<ApiResponse<LraReport>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }
  const response = await fetch(`${API_URL}/lra/${id}`, {
    method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// DELETE - Hapus data LRA
export async function deleteLra(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/lra/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}

// ==========================================
// API LAPORAN KEUANGAN
// ==========================================

export interface LaporanKeuangan {
  id?: number;
  tahun: number;
  jenis_satker: string;
  periode: string;
  judul: string;
  file_url?: string;
  cover_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// GET - Ambil semua data Laporan Keuangan
export async function getAllLaporanKeuangan(tahun?: number, page = 1): Promise<ApiResponse<LaporanKeuangan[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/laporan-keuangan?${qs.join('&')}`;
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

// GET - Ambil satu data Laporan Keuangan
export async function getLaporanKeuangan(id: number): Promise<LaporanKeuangan | null> {
  const response = await fetch(`${API_URL}/laporan-keuangan/${id}`);
  const result: ApiResponse<LaporanKeuangan> = await response.json();
  return result.data || null;
}

// POST - Tambah data Laporan Keuangan baru
export async function createLaporanKeuangan(data: LaporanKeuangan | FormData): Promise<ApiResponse<LaporanKeuangan>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/laporan-keuangan`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// PUT - Update data Laporan Keuangan
export async function updateLaporanKeuangan(id: number, data: LaporanKeuangan | FormData): Promise<ApiResponse<LaporanKeuangan>> {
  const isFormData = data instanceof FormData;

  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/laporan-keuangan/${id}`, {
    method: method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return response.json();
}

// DELETE - Hapus data Laporan Keuangan
export async function deleteLaporanKeuangan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/laporan-keuangan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}


// ==========================================
// API MEDIASI
// ==========================================

export interface MediasiSk {
  id?: number;
  tahun: number;
  link_sk_hakim?: string | null;
  link_sk_non_hakim?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MediatorBanner {
  id?: number;
  judul: string;
  image_url: string;
  type: 'hakim' | 'non-hakim';
  created_at?: string;
  updated_at?: string;
}

// Mediasi SK Functions
export async function getAllMediasiSk(): Promise<ApiResponse<MediasiSk[]>> {
  const response = await fetch(`${API_URL}/mediasi-sk`, { cache: 'no-store' });
  return normalizeApiResponse<MediasiSk[]>(response);
}

export async function getMediasiSk(id: number): Promise<MediasiSk | null> {
  const response = await fetch(`${API_URL}/mediasi-sk/${id}`);
  const result: ApiResponse<MediasiSk> = await response.json();
  return result.data || null;
}

export async function createMediasiSk(data: FormData): Promise<ApiResponse<MediasiSk>> {
  const response = await fetch(`${API_URL}/mediasi-sk`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<MediasiSk>(response);
}

export async function updateMediasiSk(id: number, data: FormData): Promise<ApiResponse<MediasiSk>> {
  data.append('_method', 'PUT');
  const response = await fetch(`${API_URL}/mediasi-sk/${id}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<MediasiSk>(response);
}

export async function deleteMediasiSk(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/mediasi-sk/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// Mediator Banner Functions
export async function getAllMediatorBanners(): Promise<ApiResponse<MediatorBanner[]>> {
  const response = await fetch(`${API_URL}/mediator-banners`, { cache: 'no-store' });
  return normalizeApiResponse<MediatorBanner[]>(response);
}

export async function getMediatorBanner(id: number): Promise<MediatorBanner | null> {
  const response = await fetch(`${API_URL}/mediator-banners/${id}`);
  const result: ApiResponse<MediatorBanner> = await response.json();
  return result.data || null;
}

export async function createMediatorBanner(data: FormData): Promise<ApiResponse<MediatorBanner>> {
  const response = await fetch(`${API_URL}/mediator-banners`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<MediatorBanner>(response);
}

export async function updateMediatorBanner(id: number, data: FormData): Promise<ApiResponse<MediatorBanner>> {
  data.append('_method', 'PUT');
  const response = await fetch(`${API_URL}/mediator-banners/${id}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<MediatorBanner>(response);
}

export async function deleteMediatorBanner(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/mediator-banners/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API PROFIL PIMPINAN
// ==========================================

export async function getAllProfilPimpinan(params?: { q?: string; published?: boolean }): Promise<ApiResponse<ProfilPimpinan[]>> {
  const qs: string[] = [];
  if (params?.q) qs.push(`q=${encodeURIComponent(params.q)}`);
  if (typeof params?.published === 'boolean') qs.push(`published=${params.published ? '1' : '0'}`);
  const url = qs.length ? `${API_URL}/profil-pimpinan?${qs.join('&')}` : `${API_URL}/profil-pimpinan`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<ProfilPimpinan[]>(response);
}

export async function getProfilPimpinan(idOrSlug: number | string): Promise<ProfilPimpinan | null> {
  const response = await fetch(`${API_URL}/profil-pimpinan/${idOrSlug}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<ProfilPimpinan>(response);
  return result.data || null;
}

export async function createProfilPimpinan(data: FormData): Promise<ApiResponse<ProfilPimpinan>> {
  const response = await fetch(`${API_URL}/profil-pimpinan`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<ProfilPimpinan>(response);
}

export async function updateProfilPimpinan(id: number, data: FormData): Promise<ApiResponse<ProfilPimpinan>> {
  data.append('_method', 'PUT');
  const response = await fetch(`${API_URL}/profil-pimpinan/${id}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });
  return normalizeApiResponse<ProfilPimpinan>(response);
}

export async function deleteProfilPimpinan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/profil-pimpinan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API INOVASI
// ==========================================

// GET - Ambil semua data Inovasi
export async function getAllInovasi(kategori?: string, page = 1): Promise<ApiResponse<Inovasi[]>> {
  const qs: string[] = [];
  if (kategori) qs.push(`kategori=${encodeURIComponent(kategori)}`);
  qs.push(`page=${page}`);
  const url = `${API_URL}/inovasi?${qs.join('&')}`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<Inovasi[]>(response);
}

// GET - Ambil satu data Inovasi
export async function getInovasi(id: number): Promise<Inovasi | null> {
  const response = await fetch(`${API_URL}/inovasi/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<Inovasi>(response);
  return result.data || null;
}

// POST - Tambah data Inovasi baru
export async function createInovasi(data: FormData | Partial<Inovasi>): Promise<ApiResponse<Inovasi>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/inovasi`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<Inovasi>(response);
}

// PUT - Update data Inovasi
export async function updateInovasi(id: number, data: FormData | Partial<Inovasi>): Promise<ApiResponse<Inovasi>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }
  const response = await fetch(`${API_URL}/inovasi/${id}`, {
    method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<Inovasi>(response);
}

// DELETE - Hapus data Inovasi
export async function deleteInovasi(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/inovasi/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API SK INOVASI
// ==========================================

// GET - Ambil semua data SK Inovasi
export async function getAllSkInovasi(tahun?: number, active?: boolean): Promise<ApiResponse<SkInovasi[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${tahun}`);
  if (active !== undefined) qs.push(`active=${active ? 1 : 0}`);
  const url = `${API_URL}/sk-inovasi${qs.length > 0 ? '?' + qs.join('&') : ''}`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<SkInovasi[]>(response);
}

// GET - Ambil satu data SK Inovasi
export async function getSkInovasi(id: number): Promise<SkInovasi | null> {
  const response = await fetch(`${API_URL}/sk-inovasi/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<SkInovasi>(response);
  return result.data || null;
}

// POST - Tambah data SK Inovasi baru
export async function createSkInovasi(data: FormData | Partial<SkInovasi>): Promise<ApiResponse<SkInovasi>> {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}/sk-inovasi`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<SkInovasi>(response);
}

// PUT - Update data SK Inovasi
export async function updateSkInovasi(id: number, data: FormData | Partial<SkInovasi>): Promise<ApiResponse<SkInovasi>> {
  const isFormData = data instanceof FormData;
  const method = isFormData ? 'POST' : 'PUT';
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }
  const response = await fetch(`${API_URL}/sk-inovasi/${id}`, {
    method,
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  return normalizeApiResponse<SkInovasi>(response);
}

// DELETE - Hapus data SK Inovasi
export async function deleteSkInovasi(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/sk-inovasi/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API KELOMPOK JABATAN
// ==========================================

export interface KelompokJabatan {
  id: number;
  nama_kelompok: string;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllKelompokJabatan(): Promise<ApiResponse<KelompokJabatan[]>> {
  const response = await fetch(`${API_URL}/kelompok-jabatan`, { cache: 'no-store' });
  return normalizeApiResponse<KelompokJabatan[]>(response);
}

export async function createKelompokJabatan(data: Partial<KelompokJabatan>): Promise<ApiResponse<KelompokJabatan>> {
  const response = await fetch(`${API_URL}/kelompok-jabatan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<KelompokJabatan>(response);
}

export async function updateKelompokJabatan(id: number, data: Partial<KelompokJabatan>): Promise<ApiResponse<KelompokJabatan>> {
  const response = await fetch(`${API_URL}/kelompok-jabatan/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<KelompokJabatan>(response);
}

export async function deleteKelompokJabatan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/kelompok-jabatan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API JENIS PEGAWAI
// ==========================================

export interface JenisPegawai {
  id: number;
  nama: string;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllJenisPegawai(): Promise<ApiResponse<JenisPegawai[]>> {
  const response = await fetch(`${API_URL}/jenis-pegawai`, { cache: 'no-store' });
  return normalizeApiResponse<JenisPegawai[]>(response);
}

export async function createJenisPegawai(data: Partial<JenisPegawai>): Promise<ApiResponse<JenisPegawai>> {
  const response = await fetch(`${API_URL}/jenis-pegawai`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<JenisPegawai>(response);
}

export async function updateJenisPegawai(id: number, data: Partial<JenisPegawai>): Promise<ApiResponse<JenisPegawai>> {
  const response = await fetch(`${API_URL}/jenis-pegawai/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<JenisPegawai>(response);
}

export async function deleteJenisPegawai(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/jenis-pegawai/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API URAIAN TUGAS
// ==========================================

export interface UraianTugas {
  id: number;
  nama?: string;
  jabatan: string;
  kelompok_jabatan_id: number;
  nip?: string;
  jenis_pegawai_id?: number;
  foto_url?: string;
  link_dokumen?: string;
  uraian_tugas?: string;
  urutan: number;
  kelompok_jabatan?: KelompokJabatan;
  jenis_pegawai?: JenisPegawai;
  created_at?: string;
  updated_at?: string;
}

export async function getAllUraianTugas(kelompokId?: number, q?: string, page = 1, perPage = 10): Promise<ApiResponse<UraianTugas[]>> {
  let url = `${API_URL}/uraian-tugas`;
  const params: string[] = ['paginate=1', `page=${page}`, `per_page=${perPage}`];
  if (kelompokId) params.push(`kelompok_id=${kelompokId}`);
  if (q) params.push(`q=${encodeURIComponent(q)}`);
  if (params.length) url += `?${params.join('&')}`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<UraianTugas[]>(response);
}

export async function getUraianTugas(id: number): Promise<UraianTugas | null> {
  const response = await fetch(`${API_URL}/uraian-tugas/${id}`);
  const result = await normalizeApiResponse<UraianTugas>(response);
  return result.data || null;
}

export async function createUraianTugas(data: Partial<UraianTugas>): Promise<ApiResponse<UraianTugas>> {
  const response = await fetch(`${API_URL}/uraian-tugas`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return normalizeApiResponse<UraianTugas>(response);
}

export async function updateUraianTugas(id: number, data: Partial<UraianTugas>): Promise<ApiResponse<UraianTugas>> {
  // Lumen tidak mem-parse JSON body untuk PUT request.
  // Gunakan POST + _method=PUT (method spoofing) agar body terbaca.
  const payload = { ...data, _method: 'PUT' };
  const response = await fetch(`${API_URL}/uraian-tugas/${id}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* non-JSON body */ }
    return { success: false, message: msg };
  }
  return normalizeApiResponse<UraianTugas>(response);
}

export async function deleteUraianTugas(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/uraian-tugas/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API SURVEY LAPORAN (IKM, IPAK, Tindak Lanjut)
// ==========================================

export const KATEGORI_SURVEY_LAPORAN = [
  { value: 'IKM',           label: 'Survei Kepuasan Masyarakat' },
  { value: 'IPAK',          label: 'Indeks Persepsi Anti Korupsi' },
  { value: 'TINDAK_LANJUT', label: 'Tindak Lanjut Hasil Survei' },
] as const;

export type KategoriSurveyLaporan = typeof KATEGORI_SURVEY_LAPORAN[number]['value'];

/**
 * Pilihan kategori mutu IKM/IPAK sesuai PermenPAN-RB 14/2017.
 * Nilai indeks 0-100. Kategori "Tidak Baik" < 25, "Kurang Baik" 25-64.99,
 * "Baik" 65-76.60, "Sangat Baik" 76.61-88.30, "Sangat Sangat Baik" 88.31-100.
 */
export const KATEGORI_MUTU = [
  { value: 'A', label: 'A — Sangat Baik (88.31–100)' },
  { value: 'B', label: 'B — Baik (76.61–88.30)' },
  { value: 'C', label: 'C — Kurang Baik (65.00–76.60)' },
  { value: 'D', label: 'D — Tidak Baik (25.00–64.99)' },
] as const;

export type KategoriMutu = typeof KATEGORI_MUTU[number]['value'];

export interface SurveyLaporan {
  id?: number;
  kategori: KategoriSurveyLaporan;
  tahun: number;
  periode: string;
  urutan: number;
  // Skor & detail (opsional, NULL untuk laporan lama / Tindak Lanjut)
  nilai_indeks?: number | null;
  kategori_mutu?: string | null;
  jumlah_responden?: number | null;
  unsur_terendah?: string | null;
  unsur_tertinggi?: string | null;
  kesimpulan?: string | null;
  rekomendasi?: string | null;
  gambar_url?: string | null;
  link_dokumen?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllSurveyLaporan(params?: { tahun?: number; kategori?: KategoriSurveyLaporan }): Promise<ApiResponse<SurveyLaporan[]>> {
  const qs: string[] = [];
  if (params?.tahun) qs.push(`tahun=${encodeURIComponent(String(params.tahun))}`);
  if (params?.kategori) qs.push(`kategori=${encodeURIComponent(params.kategori)}`);
  const url = qs.length ? `${API_URL}/survey-laporan?${qs.join('&')}` : `${API_URL}/survey-laporan`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<SurveyLaporan[]>(response);
}

export async function getSurveyLaporan(id: number): Promise<SurveyLaporan | null> {
  const response = await fetch(`${API_URL}/survey-laporan/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<SurveyLaporan>(response);
  return result.data || null;
}

export async function createSurveyLaporan(data: FormData | SurveyLaporan): Promise<ApiResponse<SurveyLaporan>> {
  const isFormData = data instanceof FormData;
  const body = isFormData ? data : JSON.stringify(data);

  const response = await fetch(`${API_URL}/survey-laporan`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body,
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<SurveyLaporan>(response);
}

export async function updateSurveyLaporan(id: number, data: FormData | Partial<SurveyLaporan>): Promise<ApiResponse<SurveyLaporan>> {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/survey-laporan/${id}`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<SurveyLaporan>(response);
}

export async function deleteSurveyLaporan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/survey-laporan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}

// ==========================================
// API SURVEY PEKAN (snapshot mingguan)
// ==========================================

export interface SurveyPekan {
  id?: number;
  tahun: number;
  tanggal_mulai: string; // YYYY-MM-DD
  tanggal_selesai: string;
  gambar_ikm?: string | null;
  link_ikm?: string | null;
  nilai_ikm?: number | null;
  gambar_ipkp?: string | null;
  link_ipkp?: string | null;
  nilai_ipkp?: number | null;
  gambar_ipak?: string | null;
  link_ipak?: string | null;
  nilai_ipak?: number | null;
  total_responden?: number | null;
  catatan?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllSurveyPekan(tahun?: number): Promise<ApiResponse<SurveyPekan[]>> {
  const qs: string[] = [];
  if (tahun) qs.push(`tahun=${encodeURIComponent(String(tahun))}`);
  const url = qs.length ? `${API_URL}/survey-pekan?${qs.join('&')}` : `${API_URL}/survey-pekan`;
  const response = await fetch(url, { cache: 'no-store' });
  return normalizeApiResponse<SurveyPekan[]>(response);
}

export async function getSurveyPekan(id: number): Promise<SurveyPekan | null> {
  const response = await fetch(`${API_URL}/survey-pekan/${id}`, { cache: 'no-store' });
  const result = await normalizeApiResponse<SurveyPekan>(response);
  return result.data || null;
}

export async function createSurveyPekan(data: FormData | SurveyPekan): Promise<ApiResponse<SurveyPekan>> {
  const isFormData = data instanceof FormData;
  const body = isFormData ? data : JSON.stringify(data);

  const response = await fetch(`${API_URL}/survey-pekan`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body,
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<SurveyPekan>(response);
}

export async function updateSurveyPekan(id: number, data: FormData | Partial<SurveyPekan>): Promise<ApiResponse<SurveyPekan>> {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    (data as FormData).append('_method', 'PUT');
  }

  const response = await fetch(`${API_URL}/survey-pekan/${id}`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err?.errors && typeof err.errors === 'object') {
        const firstField = Object.keys(err.errors)[0];
        msg = err.errors[firstField]?.[0] || err?.message || msg;
      } else {
        msg = err?.message || msg;
      }
    } catch { /* body kosong atau non-JSON */ }
    return { success: false, message: msg };
  }

  return normalizeApiResponse<SurveyPekan>(response);
}

export async function deleteSurveyPekan(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_URL}/survey-pekan/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return normalizeApiResponse<null>(response);
}
