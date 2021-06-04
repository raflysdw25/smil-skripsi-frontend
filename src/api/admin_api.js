import { admin_api, auth_admin } from '@/api/config'

export default {
	loginAdmin(loginRequest) {
		return auth_admin.post(`auth`, loginRequest)
	},
	logoutAdmin() {
		return admin_api.post(`auth/logout`)
	},

	// CRUD API
	getListData(type) {
		return admin_api.get(`${type}`)
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
}
