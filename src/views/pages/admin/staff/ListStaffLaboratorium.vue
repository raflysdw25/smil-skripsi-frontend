<template>
	<div class="list-staff-laboratorium">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-primary"
				@click="$router.push({ name: 'TambahStaffLaboratorium' })"
			>
				Tambah Data
			</button>
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openPopup('filter-data')"
			>
				Filter Data
			</button>
			<button
				class="smil-btn smil-bg-secondary ml-auto"
				@click="openPopup('jabatan')"
			>
				Struktural Lab
			</button>
		</div>
		<!-- END: BUTTON GROUP -->

		<!-- START: LIST DATA -->
		<div class="table-responsive-sm">
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
								@filterAction="getListStaffLab"
								:filter_type="head.filter_type"
								:default_value="filterData[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="listData.length === 0">
					<tr>
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
									<b-dropdown-item>
										Cetak QR Code
									</b-dropdown-item>
									<b-dropdown-item>
										List Alat Tersimpan
									</b-dropdown-item>
									<b-dropdown-item>
										Edit Data Lokasi
									</b-dropdown-item>
									<b-dropdown-item>
										<span class="smil-text-danger">
											Hapus Data Lokasi
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
							:colspan="Object.keys(headsTable).length"
							:style="{ 'padding-bottom': `${listData.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listData.length} dari ${listData.length} Data` }}
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
				<select class="custom-select" v-model="tableInfo.listSize">
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
			:size="baseModalType === 'jabatan' ? 'lg' : ''"
		>
			<base-modal-list-support
				v-if="baseModalType === 'jabatan'"
				title="Struktural Laboratorium"
				supportType="jabatan"
				:closeModal="closePopup"
			/>

			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>

			<form-filter-data
				v-if="baseModalType === 'filter-data'"
				title="Filter Data Staff Laboratorium"
				:closeModal="closePopup"
				:formInput="filterData"
				:form="formFilter"
				@submitFilter="getListStaffLab"
				:activeButton="filterActive"
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
	import BaseModalListSupport from '@/components/BaseModal/BaseModalListSupport.vue'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert.vue'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'
	import FormInputMixins from '@/mixins/FormInputMixins'
	import TableMixins from '@/mixins/TableMixins'
	export default {
		name: 'list-staff-laboratorium',
		mixins: [ModalMixins, FormInputMixins, TableMixins],
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAdd,
			BaseModalListSupport,
			BaseModalAlert,
		},
		data() {
			return {
				headsTable: [
					{
						label: 'Nomor Induk Pegawai',
						filter_type: 'search',
						placeholder: 'Filter Nomor Induk Pegawai',
						model: 'nip',
						options: null,
					},
					{
						label: 'Jabatan Staff',
						filter_type: 'select',
						placeholder: 'Filter Jabatan Staff',
						model: 'jabatan_id',
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: false,
							},
						],
					},
					{
						label: 'Hak Akses Admin',
						filter_type: 'select',
						placeholder: 'Filter Hak Akses Admin',
						model: 'hak_akses',
						options: [
							{
								name: 'All',
								value: null,
							},
							{
								name: 'Punya Akses',
								value: 1,
							},
							{
								name: 'Kadaluarsa',
								value: 2,
							},
							{
								name: 'Belum Login',
								value: 3,
							},
						],
					},
					'',
				],
				listData: [
					{
						nip: '3271032506990001',
						staff_fullname: 'Muhammad Rafly Sadewa',
						email: 'raflysdw25@gmail.com',
						jabatan_id: 1,
						active_period: new Date(['2021', '06', '25']).toString(),
						first_login: true, //Didapatkan dari backend, dengan melihat apakah passwordnya masih default 'admin'
					},
				],

				listJabatan: [],
				filterData: {
					nip: '',
					jabatan_id: null,
					hak_akses: null,
				},
				formFilter: [
					{
						label: 'Nomor Induk Pegawai',
						type: 'text',
						model: 'nip',
						description: '',
						placeholder: 'Filter Nomor Induk Pegawai',
						isRequired: false,
					},
					{
						label: 'Jabatan Staff',
						type: 'select',
						model: 'jabatan_id',
						description: '',
						placeholder: 'Pilih Jabatan Staff',
						isRequired: false,
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: false,
							},
						],
					},
					{
						label: 'Hak Akses Admin',
						type: 'select',
						model: 'hak_akses',
						description: '',
						placeholder: 'Filter Hak Akses Admin',
						isRequired: false,
						options: [
							{
								name: 'All',
								value: null,
							},
							{
								name: 'Punya Akses',
								value: 1,
							},
							{
								name: 'Kadaluarsa',
								value: 2,
							},
							{
								name: 'Belum Login',
								value: 3,
							},
						],
					},
				],
				buttonActive: false,
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.nip, //Nip Peminjam Alat
						this.getJabatan(list.jabatan_id), //kapasitas
						this.statusAkunStaff(list.active_period, list.first_login), //jenis
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			filterActive() {
				let filter = this.filterPayload
				return (
					filter.nip !== '' ||
					filter.jabatan_id !== null ||
					filter.hak_akses !== null
				)
			},
			filterPayload() {
				return {
					nip: this.filterData.nip,
					jabatan_id: this.filterData.jabatan_id,
					hak_akses: this.filterData.hak_akses,
				}
			},
		},
		async mounted() {
			await this.getListStaffLab()
			await this.getListJabatan()
			// this.showAlert(false, false, 'Alert Berhasil')
		},
		methods: {
			// Call API
			async getListStaffLab() {
				// alert(`Get Data Alat ${this.filterData.asal_alat}`)
				this.tableInfo.totalPage =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
			},
			async getListJabatan() {
				// Hit API List Jabatan from Jabatan Table
				let jabatanStaff = [
					{
						id: 1,
						jabatan_name: 'Kepala Laboratorium',
						value: 1,
					},
					{
						id: 2,
						jabatan_name: 'Pranata Laboratorium Pendidikan',
						value: 2,
					},
				]

				this.listJabatan = jabatanStaff

				jabatanStaff.forEach((jabatan) => {
					this.headsTable[1].options.push({
						id: jabatan.id,
						name: jabatan.jabatan_name,
						value: jabatan.id,
					})
					this.formFilter[1].options.push({
						id: jabatan.id,
						name: jabatan.jabatan_name,
						value: jabatan.id,
					})
				})

				let filter
			},

			// Value Change
			statusAkunStaff(activePeriod, isFirstLogin) {
				// Menentukan status dari akun berdasarkan active_period akun
				let currentDate = this.formatDate(new Date())
				let rangeDate = this.dateRange(
					currentDate,
					this.formatDate(activePeriod)
				)
				let status_id = null
				if (rangeDate > 0) {
					status_id = isFirstLogin ? 4 : 2
				} else {
					status_id = 3
				}

				let listStatus = [
					{
						id: 1,
						text: 'Pending',
						background: 'smil-bg-pending',
					},
					{
						id: 2,
						text: 'Punya Akses',
						background: 'smil-bg-success',
					},
					{
						id: 3,
						text: 'Kadaluarsa',
						background: 'smil-bg-danger',
					},
					{
						id: 4,
						text: 'Belum Login',
						background: 'smil-bg-pending',
					},
				]

				return listStatus.find((status) => status.id === status_id)
			},
			getJabatan(jabatanId) {
				if (this.listJabatan.length > 0) {
					return this.listJabatan.find((jabatan) => jabatan.id === jabatanId)
						.jabatan_name
				}
			},

			// Action Dropdown
			lihatDetail(indexData) {},
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
