import Vue from 'vue'
import VueRouter from 'vue-router'

// Layout
import LayoutPortalAdmin from '@/views/layout/LayoutPortalAdmin.vue'
import LayoutPortalPeminjaman from '@/views/layout/LayoutPortalPeminjaman.vue'

// ADMIN

// Pages
import LoginAdmin from '@/views/pages/admin/LoginAdmin.vue'
import DashboardAdmin from '@/views/pages/admin/DashboardAdmin.vue'

// Pages - Alat Lab
import ListAlatLab from '@/views/pages/admin/alat/ListAlatLab.vue'
import ListJenisAlatLab from '@/views/pages/admin/alat/ListJenisAlatLab.vue'
import ListKerusakanAlatLab from '@/views/pages/admin/alat/ListKerusakanAlatLab.vue'
import AddAlatLab from '@/views/pages/admin/alat/AddAlatLab.vue'
import UploadImage from '@/views/pages/admin/alat/UploadImage.vue'
import DetailAlatLab from '@/views/pages/admin/alat/DetailAlatLab.vue'

// Pages - Supplier
import ListSupplier from '@/views/pages/admin/supplier/ListSupplier.vue'
import AddSupplier from '@/views/pages/admin/supplier/AddSupplier.vue'

// Pages - Peminjaman
import ListPeminjamanAlat from '@/views/pages/admin/peminjaman/ListPeminjamanAlat.vue'

// Pages - Lokasi Penyimpanan
import ListLokasiPenyimpanan from '@/views/pages/admin/penyimpanan/ListLokasiPenyimpanan.vue'

// Pages - Staff Laboratorium
import ListStaffLaboratorium from '@/views/pages/admin/staff/ListStaffLaboratorium.vue'
import AddStaffLaboratorium from '@/views/pages/admin/staff/AddStaffLaboratorium.vue'

// Pages - Staff Jurusan
import ListStaffJurusan from '@/views/pages/admin/staff/ListStaffJurusan.vue'
import AddStaffJurusan from '@/views/pages/admin/staff/AddStaffJurusan.vue'

// PEMINJAMAN

// Pages
import BerandaPeminjaman from '@/views/pages/peminjaman/BerandaPeminjaman.vue'
import LaporKerusakanAlat from '@/views/pages/peminjaman/LaporKerusakanAlat.vue'
import BuatAkunMahasiswa from '@/views/pages/peminjaman/BuatAkunMahasiswa.vue'
import ActionPeminjaman from '@/views/pages/peminjaman/ActionPeminjaman.vue'

Vue.use(VueRouter)

const routes = [
	// App Route

	// Portal Peminjaman
	{
		path: '/',
		component: LayoutPortalPeminjaman,
		children: [
			// Beranda
			{
				path: '',
				name: 'BerandaPeminjaman',
				component: BerandaPeminjaman,
			},
			// Form Peminjaman & Pengembalian
			{
				path: '/:actionType',
				name: 'ActionPeminjaman',
				component: ActionPeminjaman,
			},
			// Form Laporan Kerusakan
			{
				path: '/lapor-kerusakan',
				name: 'LaporKerusakanAlat',
				component: LaporKerusakanAlat,
			},
			// Form Buat Akun Mahasiswa
			{
				path: '/buat-akun',
				name: 'BuatAkunMahasiswa',
				component: BuatAkunMahasiswa,
			},
		],
	},
	// Portal Admin
	{
		path: '/admin/',
		component: LayoutPortalAdmin,
		children: [
			// Dashboard
			{
				path: 'dashboard',
				name: 'DashboardAdmin',
				component: DashboardAdmin,
			},
			// Pagegroup - Alat Lab
			{
				path: 'alatlab/list',
				name: 'ListAlatLaboratorium',
				component: ListAlatLab,
			},
			{
				path: 'alatlab/jenis',
				name: 'JenisAlatLaboratorium',
				component: ListJenisAlatLab,
			},
			{
				path: 'alatlab/laporan/kerusakan',
				name: 'LaporanKerusakanAlat',
				component: ListKerusakanAlatLab,
			},
			{
				path: 'alatlab/tambah',
				name: 'TambahAlatLab',
				component: AddAlatLab,
			},
			{
				path: 'alatlab/upload/image/:alat_id',
				name: 'UploadFotoAlat',
				component: UploadImage,
			},
			{
				path: 'alatlab/list/detail/:alat_id',
				name: 'DetailAlat',
				component: DetailAlatLab,
			},
			// Pagegroup - Supplier
			{
				path: 'supplier',
				name: 'ListSupplier',
				component: ListSupplier,
			},
			{
				path: 'supplier/tambah',
				name: 'TambahSupplier',
				component: AddSupplier,
			},
			// Pagegroup - Peminjaman
			{
				path: 'peminjaman',
				name: 'ListPeminjamanAlat',
				component: ListPeminjamanAlat,
			},
			// Pagegroup - Lokasi Penyimpanan
			{
				path: 'penyimpanan',
				name: 'ListLokasiPenyimpanan',
				component: ListLokasiPenyimpanan,
			},
			// Pagegroup - Staff Laboratorium
			{
				path: 'staff',
				name: 'ListStaffLaboratorium',
				component: ListStaffLaboratorium,
			},
			{
				path: 'staff/add',
				name: 'TambahStaffLaboratorium',
				component: AddStaffLaboratorium,
			},
			// Pagegroup - Staff Jurusan
			{
				path: 'jurusan',
				name: 'ListStaffJurusan',
				component: ListStaffJurusan,
			},
			{
				path: 'jurusan/add',
				name: 'TambahStaffJurusan',
				component: AddStaffJurusan,
			},
		],
	},
	{
		path: '/login',
		name: 'LoginAdmin',
		component: LoginAdmin,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
