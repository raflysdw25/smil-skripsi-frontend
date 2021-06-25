import { admin_api, auth_admin } from '@/api/config'

export default {
	// User Auth
	loginAdmin(loginRequest) {
		return auth_admin.post(`auth`, loginRequest)
	},
	logoutAdmin() {
		return admin_api.post(`auth/logout`)
	},
	checkUserAuth() {
		return admin_api.post(`auth/check-auth`)
	},
	changePassword(userId, passwordPayload) {
		return admin_api.post(`auth/change-password/${userId}`, passwordPayload)
	},

	// Dashboard
	dashboardAdmin() {
		return admin_api.get(`dashboard`)
	},

	// CRUD API
	getPlainData(type, id = null) {
		// Untuk mendapatkan data detail dan data list tanpa filter
		if (id == null) {
			return admin_api.get(`${type}`)
		} else {
			return admin_api.get(`${type}/${id}`)
		}
	},
	getFilterData(type, page, filterPayload) {
		return admin_api.post(`filter/${type}?page=${page}`, filterPayload)
	},
	getDetailData(type, id) {
		return admin_api.get(`${type}/${id}`)
	},
	createNewData(type, createPayload) {
		return admin_api.post(`${type}`, createPayload)
	},
	deleteData(type, id) {
		return admin_api.delete(`${type}/${id}`)
	},
	editData(type, id, editPayload) {
		return admin_api.put(`${type}/${id}`, editPayload)
	},

	// Custom CRUD

	// Laporan Kerusakan Alat
	reportAction(laporanId, reportPayload) {
		return admin_api.put(`laporan/report-action/${laporanId}`, reportPayload)
	},

	// Lokasi Penyimpanan
	getLokasiNeed(totalNeed) {
		return admin_api.get(`lokasi/available/${totalNeed}`)
	},

	// Detail Alat
	changeStatusDetailAlat(type, id, payload) {
		return admin_api.put(`detail-alat/update-${type}/${id}`, payload)
	},
	getFilterDetailAlat(alatId, page, filterPayload) {
		return admin_api.post(
			`filter/detail-alat/${alatId}?page=${page}`,
			filterPayload
		)
	},

	// Staff Jurusan
	getUnregisterStaff() {
		return admin_api.get(`staff/list/un-register-staff`)
	},

	// Jabatan Staff Laboratorium
	editJabatanStaffLab(id, payload) {
		return admin_api.put(`user/update-jabatan/${id}`, payload)
	},
	getJabatanStaffLab() {
		return admin_api.get(`jabatan/lab/staff-lab`)
	},

	// Peminjaman
	approveAction(peminjamanId, approvePayload) {
		return admin_api.put(
			`peminjaman/approve-action/${peminjamanId}`,
			approvePayload
		)
	},
	confirmBarcodeAlat(payload) {
		return admin_api.post(`peminjaman/cek-alat`, payload)
	},
	registerAlatDipinjam(peminjamanId, listPayload) {
		return admin_api.post(
			`peminjaman/register-alat-dipinjam/${peminjamanId}`,
			listPayload
		)
	},

	// Image Alat
	getImageAlatId(alatId) {
		return admin_api.get(`image-alat/get-by-alat-id/${alatId}`)
	},
}
