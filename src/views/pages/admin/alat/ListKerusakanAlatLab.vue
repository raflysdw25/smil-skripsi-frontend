<template>
	<div class="list-kerusakan-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openPopup('filter-data')"
			>
				Filter Data
			</button>
		</div>
		<!-- END: BUTTON GROUP -->

		<!-- START: LIST DATA -->
		<div class="table-responsive">
			<table class="table smil-table">
				<thead class="smil-thead">
					<tr>
						<th
							v-for="(head, indexHds) in headsTable"
							:key="`header-table-${indexHds}`"
						>
							{{ head.label }}
							<base-filter
								filter_class="d-none d-lg-block"
								@changeValue="changeFilterValue"
								@filterAction="getLaporanKerusakan"
								:filter_type="head.filter_type"
								:default_value="filterData[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>

				<tbody class="smil-tbody">
					<tr v-if="loadingTable">
						<td :colspan="headsTable.length" class="text-center empty-table">
							<b-spinner
								class="icon-table icon-size"
								variant="secondary"
								style=""
							></b-spinner>
							<p class="empty-table-description">
								Sedang Memuat Data...
							</p>
						</td>
					</tr>
					<template v-else>
						<tr v-if="listData.length === 0">
							<td :colspan="headsTable.length" class="text-center empty-table">
								<icon-component
									iconName="empty-files"
									:size="64"
									colorIcon="#c5c5c5"
									iconClass="icon-table"
								/>
								<span class="empty-table-description">
									Tidak ada data yang dapat ditampilkan
								</span>
							</td>
						</tr>
						<tr
							v-else
							v-for="(rows, indexRow) in listTable"
							:key="`content-table-${indexRow}`"
						>
							<td
								v-for="(content, indexContent) in rows"
								:key="`column-${content}${indexContent}`"
								:width="indexContent === rows.length - 1 ? 10 : 200"
							>
								<template v-if="indexContent === rows.length - 1">
									<b-dropdown
										size="lg"
										right
										variant="smil-drop-dots"
										toggle-class="text-decoration-none"
										no-caret
										class="drop-dropdown smil-dot"
									>
										<template v-slot:button-content>
											<b-icon-three-dots-vertical></b-icon-three-dots-vertical>
										</template>
										<b-dropdown-item
											@click="tindakLaporan(indexRow)"
											v-if="listData[indexRow].report_status == 1"
										>
											Tindakan Laporan
										</b-dropdown-item>
										<b-dropdown-item>
											Detail Laporan
										</b-dropdown-item>
										<b-dropdown-item @click="deleteNotif(indexRow)">
											<span class="smil-text-danger">
												Hapus Laporan Kerusakan
											</span>
										</b-dropdown-item>
									</b-dropdown>
								</template>
								<template v-else-if="indexContent === rows.length - 2">
									<span class="smil-status" :class="content.background">
										{{ content.text }}
									</span>
								</template>
								<template v-else-if="indexContent === 3">
									<span class="text-limit">
										{{ content }}
									</span>
								</template>
								<template v-else>
									{{ content }}
								</template>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listData.length} dari ${tableInfo.listTotal} Data` }}
			</div>
			<div class="table-pagination">
				<ul>
					<li>
						<span
							:style="tableInfo.pageNo === 1 ? '' : 'cursor: pointer'"
							@click="previousPage"
							v-if="tableInfo.totalPage > 1"
							:disabled="tableInfo.pageNo === 1"
						>
							<icon-component
								iconName="arrow-left"
								:size="24"
								:colorIcon="tableInfo.pageNo === 1 ? `#C5C5C5` : `#101939`"
							/>
						</span>
					</li>
					<li v-for="num in tableInfo.totalPage" :key="num">
						<a
							style="cursor: pointer"
							class="smil-link"
							@click="jumpPage(num)"
							:class="[num === tableInfo.pageNo ? 'active' : '']"
							>{{ num }}
						</a>
					</li>
					<li>
						<span
							:style="
								tableInfo.totalPage === tableInfo.pageNo
									? ''
									: 'cursor: pointer'
							"
							@click="nextPage"
							v-if="tableInfo.totalPage > 1"
							:disabled="tableInfo.pageNo === tableInfo.totalPage"
						>
							<icon-component
								iconName="arrow-right"
								:size="24"
								:colorIcon="
									tableInfo.pageNo === tableInfo.totalPage
										? `#C5C5C5`
										: `#101939`
								"
							/>
						</span>
					</li>
				</ul>
			</div>
			<div class="table-count">
				Tampilkan
				<select
					class="custom-select"
					v-model="tableInfo.listSize"
					@change="getLaporanKerusakan"
				>
					<option
						:value="count"
						v-for="count in tableCount"
						:key="`page-size-${count}`"
					>
						{{ count }}
					</option>
				</select>
			</div>
		</div>
		<!-- END: PAGINATION INFO SECTION -->

		<!-- START: MODAL POPUP -->

		<b-modal
			ref="modal-popup"
			hide-footer
			hide-header
			centered
			no-close-on-backdrop
			no-close-on-esc
		>
			<!-- START: MODAL FILTER DATA FOR MOBILE -->

			<form-filter-data
				v-if="baseModalType === 'filter-data'"
				title="Filter Data Laporan Kerusakan"
				:closeModal="closePopup"
				:formInput="filterData"
				:form="formFilter"
				@submitFilter="getLaporanKerusakan"
				:activeButton="filterActive"
			/>
			<!-- END: MODAL FILTER DATA FOR MOBILE -->
			<base-modal-add
				v-if="baseModalType === 'action'"
				modalTitle="Tindakan Laporan"
				:formList="formAction"
				:submitFunction="sendTindakanLaporan"
				:closeFunction="closePopup"
				:formFilled="formTindakanFill"
			/>

			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>
		</b-modal>

		<!-- END: MODAL POPUP -->
	</div>
</template>

<script>
	// Components
	import IconComponent from '@/components/IconComponent.vue'
	import FormFilterData from '@/components/FormFilterData.vue'
	import BaseFilter from '@/components/BaseFilter.vue'
	import BaseModalAdd from '@/components/BaseModal/BaseModalAdd.vue'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert.vue'

	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'
	import TableMixins from '@/mixins/TableMixins'

	// API
	import api from '@/api/admin_api'
	export default {
		name: 'list-kerusakan-alat-lab',
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAdd,
			BaseModalAlert,
		},
		mixins: [FormInputMixins, ModalMixins, TableMixins],
		data() {
			return {
				headsTable: [
					{
						label: 'Tanggal Pelaporan',
						filter_type: 'date',
						placeholder: 'Filter Tanggal Pelaporan',
						model: 'report_date',
						options: null,
					},
					{
						label: 'Nomor Induk Pelapor',
						filter_type: 'search',
						placeholder: 'Filter Nomor Induk Pelapor',
						model: 'nomor_induk',
						options: null,
					},
					{
						label: 'Barcode Alat',
						filter_type: 'search',
						placeholder: 'Filter Barcode Alat',
						model: 'barcode_alat',
						options: null,
					},
					{
						label: 'Kronologi',
						filter_type: 'search',
						placeholder: 'Filter Kronologi',
						model: 'chronology',
						options: null,
					},
					{
						label: 'Status Laporan',
						filter_type: 'select',
						model: 'report_status',
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: false,
							},
							{
								id: 1,
								name: 'Menunggu Tindakan',
								value: 1,
								disabled: false,
							},
							{
								id: 2,
								name: 'Diperbaiki',
								value: 2,
								disabled: false,
							},
							{
								id: 3,
								name: 'Tidak Diperbaiki',
								value: 3,
								disabled: false,
							},
						],
					},
					'',
				],
				listData: [
					{
						laporan_id: 1,
						report_date: new Date().toString(),
						barcode_alat: 'BA44BHP',
						nim_mahasiswa: '4617010058',
						nip_staff: null,
						mahasiswa_fullname: 'Muhammad Rafly Sadewa',
						staff_fullname: '',
						report_status: 1,
						chronology:
							'Laptop tiba-tiba blue screen, dan terdengar bunyi di mesin laptop',
						report_action: null,
						report_notes: '',
						created_at: new Date().toString(),
						deleted_at: null,
					},
				],
				filterData: {
					report_date: '',
					nomor_induk: '',
					barcode_alat: '',
					chronology: '',
					report_status: null,
				},
				formFilter: [
					{
						label: 'Tanggal Laporan',
						type: 'date',
						model: 'report_date',
						description: '',
						placeholder: 'Filter Tanggal Laporan',
						isRequired: false,
					},
					{
						label: 'Nomor Induk Pelapor',
						type: 'text',
						model: 'nomor_induk',
						description: '',
						placeholder: 'Filter Nomor Induk Pelapor',
						isRequired: false,
						options: null,
					},
					{
						label: 'Barcode Alat',
						type: 'text',
						model: 'barcode_alat',
						description: '',
						placeholder: 'Filter Barcode Alat',
						isRequired: false,
					},
					{
						label: 'Kronologi',
						type: 'text',
						model: 'chronology',
						description: '',
						placeholder: 'Filter Kronologi',
						isRequired: false,
					},
					{
						label: 'Status Laporan',
						type: 'select',
						model: 'report_status',
						description: '',
						placeholder: 'Filter Status Laporan',
						isRequired: false,
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: false,
							},
							{
								id: 1,
								name: 'Menunggu Tindakan',
								value: 1,
								disabled: false,
							},
							{
								id: 2,
								name: 'Diperbaiki',
								value: 2,
								disabled: false,
							},
							{
								id: 3,
								name: 'Tidak Diperbaiki',
								value: 3,
								disabled: false,
							},
						],
					},
				],
				formAction: [
					{
						id: 1,
						label: 'Tanggal Tindakan',
						type: 'date',
						disabled: true,
						model: this.formatDate(new Date()),
						canAddValue: false,
					},
					{
						id: 2,
						label: 'Nama Alat',
						type: 'text',
						disabled: true,
						model: '',
						canAddValue: false,
					},
					{
						id: 3,
						label: 'Nama Pelapor',
						type: 'text',
						disabled: true,
						model: '',
						canAddValue: false,
					},
					{
						id: 4,
						label: 'Tindakan',
						type: 'radio',

						model: '',
						canAddValue: false,
						child: [
							{ id: 1, text: 'Diperbaiki', value: 2, disabled: false },
							{ id: 2, text: 'Tidak Diperbaiki', value: 3, disabled: false },
						],
					},
					{
						id: 5,
						label: 'Catatan Laporan',
						type: 'text-area',
						disabled: false,
						model: '',
						canAddValue: false,
					},
				],
				// Selected Data
				selected_data: {},
			}
		},
		computed: {
			listTable() {
				let listTable = []
				if (this.listData.length !== 0) {
					this.listData.forEach((list, indexList) => {
						let nama_pelapor =
							list.nim_mahasiswa !== ''
								? `${list.nim_mahasiswa} - ${list.mahasiswa_lapor_model.mahasiswa_fullname}`
								: `${list.nip_staff} - ${list.staff_lapor_model.staff_fullname}`
						let rowTable = [
							this.formatDate(list.report_date, 'DD MMMM YYYY'), //Tanggal Laporan
							nama_pelapor, //Nama Pelapor
							list.barcode_alat, //Barcode Alat
							list.chronology,
							this.statusLaporan(list.report_status),
							indexList, //Index Data
						]

						listTable.push(rowTable)
					})
				}

				return listTable
			},
			filterPayload() {
				let tableInfo = this.tableInfo

				return {
					page_size: tableInfo.listSize,
					sort_by: 'id',
					sort_direction: 'DESC',
					...this.filterData,
				}
			},
			filterActive() {
				let filter = this.filterPayload
				return (
					filter.report_date !== '' ||
					filter.nomor_induk !== '' ||
					filter.barcode_alat !== '' ||
					filter.chronology !== '' ||
					filter.report_status !== null
				)
			},
			formTindakanFill() {
				return this.formAction[3].model !== ''
			},
			submitTindakanRequest() {
				let form = this.formAction
				return {
					action: form[3].model,
					report_notes: form[4].model,
				}
			},
		},
		async mounted() {
			await this.getLaporanKerusakan()
		},
		methods: {
			// Call API
			async getLaporanKerusakan() {
				this.loadingTable = true
				// Nembak API Get List Alat
				try {
					const response = await api.getFilterData(
						'laporan',
						this.tableInfo.pageNo,
						this.filterPayload
					)
					console.log(response)
					this.listData = response.data.result
					let page = response.data.page
					this.tableInfo.totalPage = page.total
					this.tableInfo.listTotal = page.data_total
				} catch (e) {
					console.log(e)
				} finally {
					this.loadingTable = false
				}
			},
			async sendTindakanLaporan() {
				this.closePopup()
				this.showAlert(true)
				try {
					const response = api.reportAction(
						this.selectedRowId,
						this.submitTindakanRequest
					)
					if (response.data.response.code === 200) {
						this.showAlert(false, true, 'Tindakan berhasil dikirimkan')
					}
				} catch (e) {
					console.log(e)
				}
			},
			async deleteLaporan(id) {
				this.showAlert(true)
				try {
					const response = await api.deleteData('laporan', id)
					if (response.data.response.code == 200) {
						this.showAlert(false, true, response.data.response.message)
						this.getLaporanKerusakan()
					} else {
						this.showAlert(false, false, response.data.response.message)
					}
				} catch (e) {
					this.showAlert(false, false, e)
				} finally {
				}
			},

			// Value Change
			statusLaporan(status_id) {
				let listStatusLaporan = [
					{
						id: 1,
						text: 'Menunggu Tindakan',
						background: 'smil-bg-pending',
					},
					{
						id: 2,
						text: 'Diperbaiki',
						background: 'smil-bg-success',
					},
					{
						id: 3,
						text: 'Tidak Diperbaiki',
						background: 'smil-bg-danger',
					},
				]

				return listStatusLaporan.find((status) => status.id === status_id)
			},
			tindakLaporan(row) {
				let report = this.listData[row]
				this.selectedRowId = report.id
				this.formAction[1].model =
					report.barcode_alat_rusak.alat_model.alat_name
				this.formAction[2].model =
					report.nim_mahasiswa !== ''
						? report.mahasiswa_lapor_model.mahasiswa_fullname
						: report.staff_lapor_model.staff_fullname
				this.openPopup('action')
			},
			// Action Dropdown
			lihatDetail(indexData) {
				let data = this.listData[indexData]
				console.log(data)
			},
			// Notification
			deleteNotif(index) {
				let laporan = this.listData[index]
				let pelapor =
					laporan.nim_mahasiswa !== ''
						? laporan.mahasiswa_lapor_model.mahasiswa_fullname
						: laporan.staff_lapor_model.staff_fullname
				let confirm = window.confirm(
					`Apakah anda yakin ingin menghapus laporan dari ${pelapor}?`
				)
				if (confirm) {
					this.deleteLaporan(laporan.id)
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.button-group {
		margin-bottom: 40px;
		button {
			margin-right: 15px;
		}
	}
	.text-limit {
		display: block;
		width: 230px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
