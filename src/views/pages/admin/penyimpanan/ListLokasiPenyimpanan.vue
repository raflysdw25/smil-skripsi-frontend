<template>
	<div class="list-lokasi-penyimpanan">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button class="smil-btn smil-bg-primary" @click="openPopup('add')">
				Tambah Data
			</button>
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openPopup('filter-data')"
			>
				Filter Data
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
								@filterAction="getListLokasi"
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
										Lihat QR Code
									</b-dropdown-item>
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
		>
			<base-modal-add
				v-if="baseModalType === 'add'"
				modalTitle="Tambah Jenis Alat"
				:formList="formAdd"
				:submitFunction="sendAddLokasi"
				:closeFunction="closePopup"
				:formFilled="formAddFilled"
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
				title="Filter Data Alat"
				:closeModal="closePopup"
				:formInput="filterData"
				:form="formFilter"
				@submitFilter="getListLokasi"
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
	import ModalMixins from '@/mixins/ModalMixins'
	import TableMixins from '@/mixins/TableMixins'

	export default {
		name: 'list-lokasi-penyimpanan',
		mixins: [ModalMixins, TableMixins],
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAdd,
			BaseModalAlert,
		},
		data() {
			return {
				headsTable: [
					{
						label: 'Nama Lokasi',
						filter_type: 'search',
						placeholder: 'Filter Nama Lokasi',
						model: 'lokasi_name',
						options: null,
					},
					{
						label: 'Kapasitas Total',
						filter_type: 'search',
						placeholder: 'Filter Kapasitas Total',
						model: 'total_capacity',
						options: null,
					},
					{
						label: 'Kapasitas Tersedia',
						filter_type: 'search',
						placeholder: 'Filter Kapasitas Tersedia',
						model: 'available_capacity',
						options: null,
					},

					'',
				],
				listData: [
					{
						id: 1,
						lokasi_name: 'Lemari A',
						total_capacity: 100,
						available_capacity: 100,
						stored_capacity: 0,
						path_qrcode: '',
					},
				],
				filterData: {
					lokasi_name: '',
					total_capacity: '',
					available_capacity: '',
				},
				formFilter: [
					{
						label: 'Nama Lokasi',
						type: 'text',
						model: 'lokasi_name',
						description: '',
						placeholder: 'Filter Nama Lokasi',
						isRequired: false,
					},
					{
						label: 'Kapasistas Total',
						type: 'number',
						model: 'total_capacity',
						description: '',
						placeholder: 'Filter Kapasistas Total',
						isRequired: false,
					},
					{
						label: 'Kapasistas Tersedia',
						type: 'number',
						model: 'available_capacity',
						description: '',
						placeholder: 'Filter Kapasistas Tersedia',
						isRequired: false,
					},
				],
				formAdd: [
					{
						id: 1,
						label: 'Nama Lokasi Penyimpanan',
						type: 'text',
						disabled: false,
						model: '',
						canAddValue: false,
					},
					{
						id: 2,
						label: 'Kapasitas Penyimpanan',
						type: 'number',
						disabled: false,
						model: '',
						canAddValue: false,
					},
					// {
					// 	id: 3,
					// 	label: 'Jenis Alat Disimpan',
					// 	type: 'select',
					// 	options: [
					// 		{
					// 			id: 1,
					// 			text: 'Pilih Jenis Alat Disimpan',
					// 			value: '',
					// 			disabled: true,
					// 		},
					// 	],
					// 	model: [{ id: 1, value: '', disabled: false }],
					// 	canAddValue: true,
					// },
				],
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.lokasi_name, //Nama Lokasi
						list.total_capacity, //kapasitas
						list.available_capacity, //Kapasitas tersedia
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			submitAddRequest() {
				let form = this.formAdd
				return {
					location_name: form[0].model,
					total_capacity: form[1].model !== '' ? parseInt(form[1].model) : null,
					available_capacity:
						form[1].model !== '' ? parseInt(form[1].model) : null,
				}
			},
			formAddFilled() {
				let submit = this.submitAddRequest
				return submit.location_name !== '' && submit.total_capacity !== null
			},
			filterPayload() {
				let filter = this.filterData
				let total =
					filter.total_capacity === '' ? null : parseInt(filter.total_capacity)
				let available =
					filter.available_capacity === ''
						? null
						: parseInt(filter.available_capacity)
				return {
					lokasi_name: filter.lokasi_name,
					total_capacity: total,
					available_capacity: available,
				}
			},
		},
		async mounted() {
			await this.getListLokasi()
			// this.showAlert(false, false, 'Alert Berhasil')
		},
		methods: {
			// Call API
			async getListLokasi() {
				// alert(`Get Data Alat ${this.filterData.asal_alat}`)
				this.tableInfo.totalPage =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
			},
			async sendAddLokasi() {},

			// Value Change

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
