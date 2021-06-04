import Vue from 'vue'
import VueRouter from 'vue-router'
import * as types from '@/store/types'
import { store } from '@/store/store'
import CryptoJS from 'crypto-js'

// Layout
import LayoutPortalAdmin from '@/views/layout/LayoutPortalAdmin.vue'

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
import ListCivitasJurusan from '@/views/pages/admin/staff/ListCivitasJurusan.vue'

import AddStaffJurusan from '@/views/pages/admin/staff/AddStaffJurusan.vue'

Vue.use(VueRouter)

const routes = [
	// App Route

	// Portal Admin
	{
		path: '/',
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
			{
				path: 'supplier/edit/:supplier_id',
				name: 'EditSupplier',
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
				name: 'ListCivitasJurusan',
				component: ListCivitasJurusan,
			},
			{
				path: 'jurusan/add',
				name: 'TambahStaffJurusan',
				component: AddStaffJurusan,
			},
			{
				path: 'jurusan/edit/:staff_nip',
				name: 'EditStaffJurusan',
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
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 0 }
	},
})

router.beforeEach((to, from, next) => {
	let dataUser = $cookies.get('smilAdminAuth')
	let accessToken = $cookies.get('smilAccessToken')
	if (to.name == 'LoginAdmin') {
		if (dataUser && accessToken) {
			next({ name: 'DashboardAdmin' })
		} else {
			next()
		}
	} else {
		if (dataUser && accessToken) {
			let reb64 = CryptoJS.enc.Hex.parse(dataUser)
			let bytes = reb64.toString(CryptoJS.enc.Base64)
			let decrypt = CryptoJS.AES.decrypt(bytes, process.env.VUE_APP_KEY)
			let decryptedData = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8))

			if (Object.keys(decryptedData).length !== 0) {
				let adminData = {
					id: decryptedData.id,
					staff_model: decryptedData.staff_model,
					jabatan_model: decryptedData.jabatan_model,
					active_period: decryptedData.active_period,
					expire_period: decryptedData.expire_period,
				}
				$cookies.set('smilAccessToken', admin.data.access_token, '12h')
				store.dispatch(types.UPDATE_ADMIN, adminData)
				next()
			} else {
				next({ name: 'LoginAdmin' })
			}
		} else {
			next({ name: 'LoginAdmin' })
		}
	}
})

export default router
