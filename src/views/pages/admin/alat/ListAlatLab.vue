<template>
	<div class="list-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-primary"
				@click="$router.push({ name: 'TambahAlatLab' })"
			>
				Tambah Data
			</button>
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openFilterData()"
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
							v-for="(head, indexHds) in headsAlatLab"
							:key="`header-table-${head.id}-${indexHds}`"
						>
							{{ head.label }}
							<base-filter
								filter_class="d-none d-lg-block"
								@changeValue="changeFilterValue"
								@filterAction="getListAlat"
								:filter_type="head.filter_type"
								:default_value="filterAlat[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="listAlatLab.length === 0">
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
							:width="indexContent === rows.length - 1 ? 10 : null"
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
									<b-dropdown-item @click="lihatDetail(content)">
										Lihat Detail Alat
									</b-dropdown-item>
									<b-dropdown-item
										@click="
											$router.push({
												name: 'UploadFotoAlat',
												params: { alat_id: 1 },
											})
										"
									>
										Upload Foto Alat
									</b-dropdown-item>
									<b-dropdown-item>
										Edit Data Alat
									</b-dropdown-item>
									<b-dropdown-item>
										<span class="smil-text-danger">
											Hapus Data Alat
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
							:colspan="Object.keys(headsAlatLab).length"
							:style="{ 'padding-bottom': `${listAlatLab.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listAlatLab.length} dari ${listAlatLab.length} Data` }}
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
		<b-modal
			ref="filterData"
			no-close-on-backdrop
			no-close-on-esc
			hide-header
			hide-footer
			centered
		>
			<form-filter-data
				title="Filter Data Alat"
				:closeModal="closeFilterData"
				:formInput="filterAlat"
				:form="formFilter"
				@submitFilter="submitFilterData"
			/>
		</b-modal>
		<!-- END: MODAL FILTER DATA FOR MOBILE -->
	</div>
</template>

<script>
	// Components
	import IconComponent from '@/components/IconComponent.vue'
	import FormFilterData from '@/components/FormFilterData.vue'
	import BaseFilter from '@/components/BaseFilter.vue'
	export default {
		name: 'list-alat-lab',
		components: { IconComponent, FormFilterData, BaseFilter },
		data() {
			return {
				headsAlatLab: [
					{
						id: 1,
						label: 'ID Alat',
						filter_type: 'search',
						placeholder: 'Filter ID Alat',
						model: 'id',
						options: null,
					},
					{
						id: 2,
						label: 'Nama Alat',
						filter_type: 'search',
						placeholder: 'Filter Nama Alat',
						model: 'nama',
						options: null,
					},
					{
						id: 3,
						label: 'Jenis Alat',
						filter_type: 'select',
						model: 'jenis_alat_id',
						options: [
							{
								id: 1,
								text: 'All',
								value: '',
								disabled: false,
							},
						],
					},
					{
						id: 4,
						label: 'Asal Pengadaan',
						filter_type: 'select',
						model: 'asal_alat',
						options: [
							{
								id: 1,
								text: 'All',
								value: '',
								disabled: true,
							},
							{
								id: 2,
								text: 'Barang Habis Pakai',
								value: 'BHP',
								disabled: false,
							},
							{
								id: 3,
								text: 'Hibah Tugas Akhir',
								value: 'HTA',
								disabled: false,
							},
							{
								id: 4,
								text: 'Supplier',
								value: 'SUP',
								disabled: false,
							},
							{
								id: 5,
								text: 'Direktorat PNJ',
								value: 'DRP',
								disabled: false,
							},
							{
								id: 6,
								text: 'Hibah Pemerintah',
								value: 'HPM',
								disabled: false,
							},
						],
					},
					{
						id: 5,
						label: 'Tahun Pengadaan',
						filter_type: 'search',
						placeholder: 'Filter Tahun Pengadaan',
						model: 'tahun_alat',
						options: null,
					},
					'',
				],
				listAlatLab: [
					{
						id: 1,
						nama_alat: 'iPhone 7 Plus',
						asal_alat: 'BHP',
						tahun: '2017',
						jenis_alat_id: 1,
					},
					{
						id: 2,
						nama_alat: 'ASUS A412DA',
						asal_alat: 'HTA',
						tahun: '2019',
						jenis_alat_id: 2,
					},
				],
				listInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterAlat: {
					id: '',
					nama: '',
					jenis_alat_id: '',
					asal_alat: '',
					tahun_alat: '',
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
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listAlatLab.forEach((list, indexList) => {
					let rowTable = [
						list.id, //ID Alat
						list.nama_alat, //Nama Alat
						this.jenisAlat(list.jenis_alat_id), //Jenis Alat (Ambil berdasarkan table jenis alat)
						this.asalPengadaanAlat(list.asal_alat), //Asal Pengadaan
						list.tahun,
						indexList, //Index Data
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
		async mounted() {
			await this.getListAlat()
			await this.getListJenisAlat()
		},
		methods: {
			// Call API
			async getListAlat() {
				// alert(`Get Data Alat ${this.filterAlat.asal_alat}`)
				this.listInfo.pageSize =
					this.listAlatLab.length < this.listInfo.listSize
						? 1
						: this.listAlatLab.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listAlatLab.length
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

				let headsJenisAlat = this.headsAlatLab.find((head) => head.id === 3)
				jenisAlat.forEach((alat, indexJns) => {
					headsJenisAlat.options.push({
						id: indexJns + 2,
						text: alat.jenis,
						value: alat.id,
						disabled: false,
					})
				})
			},
			submitFilterData(formInput) {
				this.filterAlat = formInput
				alert(this.filterAlat)
				// this.getListAlat()
			},
			changeFilterValue(objFilter) {
				this.filterAlat[objFilter.model] = objFilter.value
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
			asalPengadaanAlat(value) {
				let asal = ''
				switch (value) {
					case 'BHP':
						asal = 'Barang Habis Pakai'
						break
					case 'HTA':
						asal = 'Hibah Tugas Akhir'
						break
					case 'SUP':
						asal = 'Supplier'
						break
					case 'DRP':
						asal = 'Direktorat PNJ'
						break
					case 'HPM':
						asal = 'Hibah Pemerintah'
						break
					default:
						asal = 'Tidak Diketahui'
						break
				}
				return asal
			},
			jenisAlat(jenis_alat_id) {
				// Nembak API List Jenis Alat berdasarkan ID
				let listJenis = [
					{
						id: 1,
						jenis: 'Smartphone',
					},
					{
						id: 2,
						jenis: 'Laptop',
					},
				]

				return listJenis.find((jenis) => jenis.id === jenis_alat_id).jenis
			},
			// Action Dropdown
			lihatDetail(indexData) {
				let data = this.listAlatLab[indexData]
				console.log(data)
			},
			// Modal Interaction
			openFilterData() {
				this.$refs['filterData'].show()
			},
			closeFilterData() {
				this.$refs['filterData'].hide()
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
