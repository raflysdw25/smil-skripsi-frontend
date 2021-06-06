import { admin_api, auth_admin } from '@/api/config'

export default {
	loginAdmin(loginRequest) {
		return auth_admin.post(`auth`, loginRequest)
	},
	logoutAdmin() {
		return admin_api.post(`auth/logout`)
	},
	checkUserAuth() {
		return admin_api.post(`auth/check-auth`)
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
	reportAction(laporanId, reportPayload) {
		return admin_api.put(`laporan/report-action/${laporanId}`, reportPayload)
	},
	getFilterDetailAlat(alatId, page, filterPayload) {
		return admin_api.post(
			`filter/detail-alat/${alatId}?page=${page}`,
			filterPayload
		)
	},

	getLokasiNeed(totalNeed) {
		return admin_api.get(`lokasi/available/${totalNeed}`)
	},

	changeStatusDetailAlat(type, id, payload) {
		return admin_api.put(`detail-alat/update-${type}/${id}`, payload)
	},

	editJabatanStaffLab(id, payload) {
		return admin_api.put(`user/update-jabatan/${id}`, payload)
	},
}