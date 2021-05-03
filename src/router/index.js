import Vue from 'vue'
import VueRouter from 'vue-router'

// Layout
import LayoutPortalAdmin from '@/views/layout/LayoutPortalAdmin.vue'
import LayoutPortalPeminjaman from '@/views/layout/LayoutPortalPeminjaman.vue'

// Pages
import LoginAdmin from '@/views/pages/admin/LoginAdmin.vue'
import DashboardAdmin from '@/views/pages/admin/DashboardAdmin.vue'

// Pages - Alat Lab
import ListAlatLab from '@/views/pages/admin/alat/ListAlatLab.vue'
import ListJenisAlatLab from '@/views/pages/admin/alat/ListJenisAlatLab.vue'
import ListKerusakanAlatLab from '@/views/pages/admin/alat/ListKerusakanAlatLab.vue'
import AddAlatLab from '@/views/pages/admin/alat/AddAlatLab.vue'

// Pages - Supplier
import ListSupplier from '@/views/pages/admin/supplier/ListSupplier.vue'
import AddSupplier from '@/views/pages/admin/supplier/AddSupplier.vue'

// Pages - Peminjaman
import ListPeminjamanAlat from '@/views/pages/admin/peminjaman/ListPeminjamanAlat.vue'

// Pages - Lokasi Penyimpanan
import ListLokasiPenyimpanan from '@/views/pages/admin/penyimpanan/ListLokasiPenyimpanan.vue'

// Pages - Staff Laboratorium
import ListStaffLaboratorium from '@/views/pages/admin/staff/ListStaffLaboratorium.vue'

Vue.use(VueRouter)

const routes = [
	// Portal Peminjaman
	{
		path: '/',
		component: LayoutPortalPeminjaman,
		children: [],
	},
	// Portal Admin
	{
		path: '/admin/',
		component: LayoutPortalAdmin,
		children: [
			// Dashboard
			{
				path: '',
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
