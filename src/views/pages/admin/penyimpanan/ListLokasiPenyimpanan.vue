<template>
	<div class="list-lokasi-penyimpanan">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button class="smil-btn smil-bg-primary" @click="openModalPopup('add')">
				Tambah Data
			</button>
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openModalPopup('filter')"
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
							:key="`header-table-${head.id}-${indexHds}`"
						>
							{{ head.label }}
							<base-filter
								filter_class="d-none d-lg-block"
								@changeValue="changeFilterValue"
								@filterAction="getListLokasi"
								:filter_type="head.filter_type"
								:default_value="filterLokasi[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="listLokasi.length === 0">
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
							<template v-else>
								{{ content }}
							</template>
						</td>
					</tr>
					<tr>
						<td
							:colspan="Object.keys(headsTable).length"
							:style="{ 'padding-bottom': `${listLokasi.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listLokasi.length} dari ${listLokasi.length} Data` }}
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

		<!-- START: MODAL FILTER DATA FOR MOBILE -->
		<!-- <b-modal
			ref="filterData"
			no-close-on-backdrop
			no-close-on-esc
			hide-header
			hide-footer
			centered
		>
		</b-modal> -->
		<!-- END: MODAL FILTER DATA FOR MOBILE -->

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
				:closeFunction="closeModalPopup"
				:formFilled="buttonActive"
			/>

			<form-filter-data
				v-if="baseModalType === 'filter'"
				title="Filter Data Alat"
				:closeModal="closeModalPopup"
				:formInput="filterLokasi"
				:form="formFilter"
				@submitFilter="submitFilterData"
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
	export default {
		name: 'list-lokasi-penyimpanan',
		components: { IconComponent, FormFilterData, BaseFilter, BaseModalAdd },
		data() {
			return {
				headsTable: [
					{
						id: 1,
						label: 'ID Lokasi',
						filter_type: 'search',
						placeholder: 'Filter ID Lokasi',
						model: 'id',
						options: null,
					},
					{
						id: 2,
						label: 'Nama Lokasi',
						filter_type: 'search',
						placeholder: 'Filter Nama Lokasi',
						model: 'nama',
						options: null,
					},
					{
						id: 3,
						label: 'Kapasitas Tersedia',
						filter_type: 'search',
						placeholder: 'Filter Kapasitas Tersedia',
						model: 'kapasitas',
						options: null,
					},
					{
						id: 4,
						label: 'Jenis Alat Disimpan',
						filter_type: 'search',
						placeholder: 'Filter Jenis Alat Disimpan',
						model: 'jenis',
						options: null,
					},
					{
						id: 5,
						label: 'QR Code Lokasi',
						filter_type: 'search',
						placeholder: 'Filter QR Code Lokasi',
						model: 'qrcode',
						options: null,
					},
					'',
				],
				listLokasi: [
					{
						id: 1,
						nama_lokasi: 'Lemari A',
						kapasitas: 100,
						jenis: 2,
						qrcode: null,
					},
					{
						id: 2,
						nama_lokasi: 'Lemari B',
						kapasitas: 50,
						jenis: 1,
						qrcode: null,
					},
				],
				listInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterLokasi: {
					id: '',
					nama: '',
					kapasitas: '',
					jenis: '',
					qrcode: '',
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
				// Data Add Jenis Alat
				baseModalType: '',
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
					{
						id: 3,
						label: 'Jenis Alat Disimpan',
						type: 'select',
						options: [
							{
								id: 1,
								text: 'Pilih Jenis Alat Disimpan',
								value: '',
								disabled: true,
							},
						],
						model: [{ id: 1, value: '', disabled: false }],
						canAddValue: true,
					},
				],
				buttonActive: false,
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listLokasi.forEach((list, indexList) => {
					let rowTable = [
						list.id, //ID Lokasi
						list.nama_lokasi, //Nama Lokasi
						list.kapasitas, //kapasitas
						list.jenis, //jenis
						list.qrcode, //qrcode
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
		async mounted() {
			await this.getListLokasi()
			await this.getListJenisAlat()
		},
		methods: {
			// Call API
			async getListLokasi() {
				// alert(`Get Data Alat ${this.filterLokasi.asal_alat}`)
				this.listInfo.pageSize =
					this.listLokasi.length < this.listInfo.listSize
						? 1
						: this.listLokasi.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listLokasi.length
				// Nembak API Get List Alat
			},
			async getListJenisAlat() {
				let jenisAlat = [
					{
						id: 1,
						jenis: 'Smartphone',
					},
					{
						id: 2,
						jenis: 'Laptop',
					},
				]

				let listJenis = this.formAdd.find((form) => form.id === 3)
				jenisAlat.forEach((alat, indexJns) => {
					listJenis.options.push({
						id: indexJns + 2,
						text: alat.jenis,
						value: alat.id,
						disabled: false,
					})
				})
			},
			submitFilterData(formInput) {
				this.filterLokasi = formInput
				alert(this.filterLokasi)
				// this.getListLokasi()
			},
			changeFilterValue(objFilter) {
				this.filterLokasi[objFilter.model] = objFilter.value
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

			// Action Dropdown
			lihatDetail(indexData) {},
			// Modal Interaction
			openFilterData() {
				this.$refs['filterData'].show()
			},
			closeFilterData() {
				this.$refs['filterData'].hide()
			},
			// Modal Interaction
			openModalPopup(type) {
				this.baseModalType = type
				this.$refs['modal-popup'].show()
			},
			closeModalPopup() {
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
