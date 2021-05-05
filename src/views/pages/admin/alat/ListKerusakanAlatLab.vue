<template>
	<div class="list-kerusakan-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openModal('filter')"
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
							v-for="(head, indexHds) in headsAlatLab"
							:key="`header-table-${head.id}-${indexHds}`"
						>
							{{ head.label }}
							<base-filter
								filter_class="d-none d-lg-block"
								@changeValue="changeFilterValue"
								@filterAction="getLaporanKerusakan"
								:filter_type="head.filter_type"
								:default_value="filterLaporanKerusakan[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="listLaporanKerusakan.length === 0">
					<tr>
						<td :colspan="headsAlatLab.length" class="text-center empty-table">
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
				</tbody>
				<tbody class="smil-tbody" v-else>
					<tr
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
									<b-dropdown-item @click="openModal('action')">
										Tindakan Laporan
									</b-dropdown-item>
									<b-dropdown-item>
										Detail Alat
									</b-dropdown-item>
									<b-dropdown-item>
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
							<template v-else>
								{{ content }}
							</template>
						</td>
					</tr>
					<tr>
						<td
							:colspan="Object.keys(headsAlatLab).length"
							:style="{
								'padding-bottom': `${listLaporanKerusakan.length * 50}px`,
							}"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{
					`${listLaporanKerusakan.length} dari ${listLaporanKerusakan.length} Data`
				}}
			</div>
			<div class="table-pagination">
				<ul>
					<li>
						<span
							:style="listInfo.pageNo === 1 ? '' : 'cursor: pointer'"
							@click="previousPage"
							v-if="listInfo.pageSize > 1"
							:disabled="listInfo.pageNo === 1"
						>
							<icon-component
								iconName="arrow-left"
								:size="24"
								:colorIcon="listInfo.pageNo === 1 ? `#C5C5C5` : `#101939`"
							/>
						</span>
					</li>
					<li v-for="num in listInfo.pageSize" :key="num">
						<a
							style="cursor: pointer"
							class="smil-link"
							@click="jumpPage(num)"
							:class="[num === listInfo.pageNo ? 'active' : '']"
							>{{ num }}
						</a>
					</li>
					<li>
						<span
							:style="
								listInfo.pageSize === listInfo.pageNo ? '' : 'cursor: pointer'
							"
							@click="nextPage"
							v-if="listInfo.pageSize > 1"
							:disabled="listInfo.pageNo === listInfo.pageSize"
						>
							<icon-component
								iconName="arrow-right"
								:size="24"
								:colorIcon="
									listInfo.pageNo === listInfo.pageSize ? `#C5C5C5` : `#101939`
								"
							/>
						</span>
					</li>
				</ul>
			</div>
			<div class="table-count">
				Tampilkan
				<select class="custom-select" v-model="listInfo.listSize">
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="20">20</option>
					<option value="25">25</option>
					<option value="30">30</option>
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
				v-if="baseModalType === 'filter'"
				title="Filter Data Alat"
				:closeModal="closeModal"
				:formInput="filterLaporanKerusakan"
				:form="formFilter"
				@submitFilter="submitFilterData"
			/>
			<!-- END: MODAL FILTER DATA FOR MOBILE -->
			<base-modal-add
				v-if="baseModalType === 'action'"
				modalTitle="Tindakan Laporan"
				:formList="formAction"
				:closeFunction="closeModal"
				:formFilled="formTindakanFill"
			/>
		</b-modal>

		<!-- END: MODAL POPUP -->
	</div>
</template>

<script>
	let moment = require('moment')
	// Components
	import IconComponent from '@/components/IconComponent.vue'
	import FormFilterData from '@/components/FormFilterData.vue'
	import BaseFilter from '@/components/BaseFilter.vue'
	import BaseModalAdd from '@/components/BaseModal/BaseModalAdd.vue'
	export default {
		name: 'list-kerusakan-alat-lab',
		components: { IconComponent, FormFilterData, BaseFilter, BaseModalAdd },
		data() {
			return {
				headsAlatLab: [
					{
						id: 1,
						label: 'Tanggal Pelaporan',
						filter_type: 'date',
						placeholder: 'Filter Tanggal Pelaporan',
						model: 'tgl_lapor',
						options: null,
					},
					{
						id: 2,
						label: 'Nama Pelapor',
						filter_type: 'search',
						placeholder: 'Filter Nama Pelapor',
						model: 'nama',
						options: null,
					},
					{
						id: 3,
						label: 'Barcode Alat',
						filter_type: 'search',
						placeholder: 'Filter Barcode Alat',
						model: 'barcode_alat',
						options: null,
					},
					{
						id: 4,
						label: 'Kronologi',
						filter_type: 'search',
						placeholder: 'Filter Tahun Pengadaan',
						model: 'tahun_alat',
						options: null,
					},
					{
						id: 5,
						label: 'Status Laporan',
						filter_type: 'select',
						model: 'status_laporan',
						options: [
							{
								id: 1,
								text: 'All',
								value: '',
								disabled: false,
							},
							{
								id: 2,
								text: 'Menunggu Tindakan',
								value: 1,
								disabled: false,
							},
							{
								id: 3,
								text: 'Diperbaiki',
								value: 2,
								disabled: false,
							},
							{
								id: 4,
								text: 'Tidak Diperbaiki',
								value: 3,
								disabled: false,
							},
						],
					},
					'',
				],
				listLaporanKerusakan: [
					{
						tgl_lapor: new Date().toString(),
						nama_pelapor: 'Muhammad Rafly Sadewa',
						barcode_alat: 'BA44BHP',
						kronologi:
							'Laptop tiba-tiba blue screen, dan terdengar bunyi di mesin laptop',
						status_lapor: 1,
					},
				],
				listInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterLaporanKerusakan: {
					tgl_lapor: '',
					nama: '',
					barcode_alat: '',
					kronologi: '',
					status_laporan: '',
				},
				formFilter: [
					{
						id: 1,
						label: 'ID Alat',
						type: 'number',
						model: 'id',
						description: '',
						placeholder: 'Filter ID Alat',
						isRequired: false,
					},
					{
						id: 2,
						label: 'Nama Alat',
						type: 'text',
						model: 'nama',
						description: '',
						placeholder: 'Filter Nama Alat',
						isRequired: false,
					},
					{
						id: 3,
						label: 'Asal Pengadaan Alat',
						type: 'select',
						model: 'asal_alat',
						description: '',
						placeholder: 'Pilih Asal Pengadaan Alat',
						isRequired: false,
						options: [
							{
								id: 1,
								name: 'Pilih Asal Pengadaan Alat',
								value: '',
								disabled: true,
							},
							{
								id: 2,
								name: 'Barang Habis Pakai',
								value: 'BHP',
								disabled: false,
							},
							{
								id: 3,
								name: 'Hibah Tugas Akhir',
								value: 'HTA',
								disabled: false,
							},
							{
								id: 4,
								name: 'Supplier',
								value: 'SUP',
								disabled: false,
							},
							{
								id: 5,
								name: 'Direktorat PNJ',
								value: 'DRP',
								disabled: false,
							},
							{
								id: 6,
								name: 'Hibah Pemerintah',
								value: 'HPM',
								disabled: false,
							},
						],
					},
					{
						id: 4,
						label: 'Tahun Pengadaan Alat',
						type: 'text',
						model: 'tahun_alat',
						description: '',
						placeholder: 'Filter Tahun Alat',
						isRequired: false,
					},
				],
				// Form Action - Tindakan Kerusakan
				baseModalType: '',
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
						id: 2,
						label: 'Catatan Laporan',
						type: 'text-area',
						disabled: false,
						model: '',
						canAddValue: false,
					},
				],
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listLaporanKerusakan.forEach((list, indexList) => {
					// {
					// 	tgl_lapor: new Date().toString(),
					// 	nama_pelapor: 'Muhammad Rafly Sadewa',
					// 	barcode_alat: 'BA44BHP',
					// 	kronologi: '',
					// 	status_lapor: 1,
					// }
					let rowTable = [
						list.tgl_lapor, //Tanggal Laporan
						list.nama_pelapor, //Nama Pelapor
						list.barcode_alat, //Barcode Alat
						list.kronologi,
						this.statusLaporan(list.status_lapor),
						indexList, //Index Data
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			formTindakanFill() {
				return this.formAction[2].model !== ''
			},
		},
		async mounted() {
			await this.getLaporanKerusakan()
		},
		methods: {
			// Call API
			async getLaporanKerusakan() {
				// alert(`Get Data Alat ${this.filterLaporanKerusakan.asal_alat}`)
				this.listInfo.pageSize =
					this.listLaporanKerusakan.length < this.listInfo.listSize
						? 1
						: this.listLaporanKerusakan.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listLaporanKerusakan.length
				// Nembak API Get List Alat
			},
			submitFilterData(formInput) {
				this.filterLaporanKerusakan = formInput
				alert(this.filterLaporanKerusakan)
				// this.getLaporanKerusakan()
			},
			changeFilterValue(objFilter) {
				this.filterLaporanKerusakan[objFilter.model] = objFilter.value
			},
			// Table Page Interaction
			nextPage() {
				if (this.listInfo.pageNo !== this.listInfo.pageSize) {
					this.listInfo.pageNo += 1
				}
			},
			previousPage() {
				if (this.listInfo.pageNo !== 1) {
					this.listInfo.pageNo -= 1
				}
			},
			jumpPage(pageNo) {
				this.listInfo.pageNo = pageNo
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
			formatDate(date) {
				return moment(date).format('DD-MM-YYYY')
			},
			// Action Dropdown
			lihatDetail(indexData) {
				let data = this.listLaporanKerusakan[indexData]
				console.log(data)
			},
			// Modal Interaction
			openModal(type) {
				this.baseModalType = type
				this.$refs['modal-popup'].show()
			},
			closeModal() {
				this.baseModalType = ''
				this.$refs['modal-popup'].hide()
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
</style>
