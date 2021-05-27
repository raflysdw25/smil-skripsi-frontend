<template>
	<div class="list-staff-jurusan">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center">
			<h1 class="tab-title">Staff Jurusan</h1>
			<button
				class="smil-btn smil-bg-primary ml-auto"
				@click="$router.push({ name: 'TambahStaffJurusan' })"
			>
				Tambah Data
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
							:key="`header-table-${head.id}-${indexHds}`"
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
										Detail Staff
									</b-dropdown-item>
									<b-dropdown-item>
										Edit Data Staff
									</b-dropdown-item>

									<b-dropdown-item>
										<span class="smil-text-danger">
											Hapus Data Staff
										</span>
									</b-dropdown-item>
								</b-dropdown>
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
							v-if="tableInfo.pageSize > 1"
							:disabled="tableInfo.pageNo === 1"
						>
							<icon-component
								iconName="arrow-left"
								:size="24"
								:colorIcon="tableInfo.pageNo === 1 ? `#C5C5C5` : `#101939`"
							/>
						</span>
					</li>
					<li v-for="num in tableInfo.pageSize" :key="num">
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
								tableInfo.pageSize === tableInfo.pageNo ? '' : 'cursor: pointer'
							"
							@click="nextPage"
							v-if="tableInfo.pageSize > 1"
							:disabled="tableInfo.pageNo === tableInfo.pageSize"
						>
							<icon-component
								iconName="arrow-right"
								:size="24"
								:colorIcon="
									tableInfo.pageNo === tableInfo.pageSize
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
		>
			<form-filter-data
				v-if="baseModalType === 'filter'"
				title="Filter Data Alat"
				:closeModal="closePopup"
				:formInput="filterData"
				:form="formFilter"
				@submitFilter="getListStaffLab"
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
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert.vue'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'
	import TableMixins from '@/mixins/TableMixins'

	export default {
		name: 'list-staff-jurusan',
		mixins: [ModalMixins, TableMixins],
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
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
						label: 'Nama Staff',
						filter_type: 'search',
						placeholder: 'Filter Nama Staff',
						model: 'staff_fullname',
						options: null,
					},
					{
						label: 'Program Studi',
						filter_type: 'select',
						placeholder: 'Filter Program Studi',
						model: 'prodi_id',
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
						label: 'Email',
						filter_type: 'search',
						placeholder: 'Filter Email',
						model: 'email',
						options: null,
					},
					'',
				],
				listData: [
					{
						nip: '3271032506990001',
						staff_fullname: 'Muhammad Rafly Sadewa',
						prodi_id: 1,
						prodi_name: 'Teknik Multimedia Digital',
						email: 'raflysdw25@gmail.com',
						address: 'Jl. Panaragan Penggilingan No. 07',
						phone_number: '081218860714',
					},
				],
				tableInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterData: {
					nip: '',
					staff_fullname: '',
					prodi_id: null,
					email: '',
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
						label: 'Nama Staff',
						type: 'text',
						model: 'staff_fullname',
						description: '',
						placeholder: 'Filter Nama Staff',
						isRequired: false,
					},
					{
						label: 'Program Studi',
						type: 'text',
						model: 'prodi_id',
						description: '',
						placeholder: 'Filter Program Studi',
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
				],
				// Data Add Jenis Alat
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.nip, //NIP
						list.staff_fullname, //Nama Staff
						list.prodi_name, //Program Studi
						list.email, //Email
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
		async mounted() {
			await this.getListStaffLab()
			await this.getProdi()
			// this.showAlert(false, true, 'Alert Berhasil')
		},
		methods: {
			// Call API
			async getListStaffLab() {
				// alert(`Get Data Alat ${this.filterData.asal_alat}`)
				this.tableInfo.pageSize =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
			},
			async getProdi() {
				// Hit API List Jabatan from Jabatan Table
				let prodi = [
					{
						id: 1,
						prodi_name: 'Teknik Multimedia dan Digital',
					},
					{
						id: 2,
						prodi_name: 'Teknik Multimedia Jaringan',
					},
					{
						id: 3,
						prodi_name: 'Teknik Informatika',
					},
					{
						id: 4,
						prodi_name: 'Teknik Jaringan dan Komputer',
					},
				]

				prodi.forEach((pd, indexJns) => {
					this.headsTable[2].options.push({
						id: pd.id,
						name: pd.prodi_name,
						value: pd.id,
						disabled: false,
					})
					this.formFilter[2].options.push({
						id: pd.id,
						name: pd.prodi_name,
						value: pd.id,
						disabled: false,
					})
				})
			},

			// Value Change
			statusAkunStaff(status_id) {
				let listStatus = [
					{
						id: 1,
						text: 'Pending',
						background: 'smil-bg-default',
					},
					{
						id: 2,
						text: 'Punya Akses',
						background: 'smil-bg-success',
					},
					{
						id: 3,
						text: 'Kadaluarse',
						background: 'smil-bg-danger',
					},
					{
						id: 4,
						text: 'Belum Login',
						background: 'smil-bg-default',
					},
				]

				return listStatus.find((status) => status.id === status_id)
			},

			// Action Dropdown
			lihatDetail(indexData) {},
		},
	}
</script>

<style lang="scss" scoped>
	.button-group {
		margin-bottom: 40px;
		.tab-title {
			font-size: 32px;
			color: #101939;
			font-weight: 700;
			margin-bottom: 0;
		}
		button {
			margin-right: 15px;
		}
	}
</style>
