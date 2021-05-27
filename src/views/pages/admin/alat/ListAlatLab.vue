<template>
	<div class="list-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex align-items-center">
			<button
				class="smil-btn smil-bg-primary"
				@click="$router.push({ name: 'TambahAlatLab' })"
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
				@click="openPopup('asal')"
			>
				Asal Pengadaan
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
							<template v-if="head !== ''">
								<base-filter
									filter_class="d-none d-lg-block mt-2"
									@changeValue="changeFilterValue"
									@filterAction="getListAlat"
									:filter_type="head.filter_type"
									:default_value="filterData[head.model]"
									:placeholder="head.placeholder"
									:options="head.options"
									:modelFilter="head.model"
								/>
							</template>
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
						>{{ count }}</option
					>
				</select>
			</div>
		</div>
		<!-- END: PAGINATION INFO SECTION -->

		<!-- START: MODAL FILTER DATA FOR MOBILE -->
		<b-modal
			ref="modal-popup"
			no-close-on-backdrop
			no-close-on-esc
			hide-header
			hide-footer
			centered
			:size="baseModalType === 'asal' ? 'lg' : ''"
		>
			<form-filter-data
				v-if="baseModalType === 'filter-data'"
				title="Filter Data Alat"
				:closeModal="closePopup"
				:form="formFilter"
				:formInput="filterData"
				:submitFunction="getListAlat"
				:activeButton="mobileFilterActive"
			/>

			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>

			<base-modal-list-support
				v-if="baseModalType === 'asal'"
				title="Asal Pengadaan Alat"
				supportType="asal"
				:closeModal="closePopup"
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
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert.vue'
	import BaseModalListSupport from '@/components/BaseModal/BaseModalListSupport.vue'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'
	import TableMixins from '@/mixins/TableMixins'
	export default {
		name: 'list-alat-lab',
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAlert,
			BaseModalListSupport,
		},
		mixins: [ModalMixins, TableMixins],
		data() {
			return {
				headsTable: [
					{
						label: 'Nama Alat',
						filter_type: 'search',
						placeholder: 'Filter Nama Alat',
						model: 'alat_name',
						options: null,
					},
					{
						label: 'Jenis Alat',
						filter_type: 'select',
						model: 'jenis_alat_id',
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
						label: 'Asal Pengadaan',
						filter_type: 'select',
						model: 'asal_pengadaan_id',
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
						label: 'Tahun Pengadaan',
						filter_type: 'search',
						placeholder: 'Filter Tahun Pengadaan',
						model: 'alat_year',
						options: null,
					},
					'',
				],
				listData: [
					{
						id: 1,
						alat_name: 'iPhone 7 Plus',
						asal_pengadaan_id: 1,
						alat_year: '2017',
						jenis_alat_id: 1,
					},
					{
						id: 2,
						alat_name: 'ASUS A412DA',
						asal_pengadaan_id: 2,
						alat_year: '2019',
						jenis_alat_id: 2,
					},
				],
				tableInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					totalPage: 10,
				},
				filterData: {
					alat_name: '',
					jenis_alat_id: null,
					asal_pengadaan_id: null,
					alat_year: '',
				},
				formFilter: [
					{
						label: 'Nama Alat',
						type: 'text',
						model: 'alat_name',
						description: '',
						placeholder: 'Filter Nama Alat',
						isRequired: false,
					},
					{
						label: 'Jenis Alat',
						type: 'select',
						model: 'jenis_alat_id',
						description: '',
						placeholder: 'All',
						isRequired: false,
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: true,
							},
						],
					},
					{
						label: 'Asal Pengadaan Alat',
						type: 'select',
						model: 'asal_pengadaan_id',
						description: '',
						placeholder: 'All',
						isRequired: false,
						options: [
							{
								id: null,
								name: 'All',
								value: null,
								disabled: true,
							},
						],
					},
					{
						label: 'Tahun Pengadaan Alat',
						type: 'text',
						model: 'alat_year',
						description: '',
						placeholder: 'Filter Tahun Alat',
						isRequired: false,
					},
				],
				listAsalPengadaanAlat: [],
				listJenisAlat: [],
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.alat_name, //Nama Alat
						this.jenisAlat(list.jenis_alat_id), //Jenis Alat (Ambil berdasarkan table jenis alat)
						this.asalPengadaanData(list.asal_pengadaan_id), //Asal Pengadaan
						list.alat_year,
						indexList, //Index Data
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			mobileFilterActive() {
				let value = this.filterPayload
				return (
					value.alat_name !== '' ||
					value.jenis_id !== null ||
					value.asal_pengadaan_id !== null ||
					value.tahun_alat !== ''
				)
			},
			filterPayload() {
				return this.filterData
			},
		},
		async mounted() {
			await this.getListAlat()
			await this.getListJenisAlat()
			await this.getAsalPengadaanAlat()
		},
		methods: {
			// Call API
			async getListAlat() {
				this.tableInfo.totalPage =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
				// alert(this.filterPayload.alat_name)
			},
			async getListJenisAlat() {
				let jenisAlat = [
					{
						id: 1,
						jenis_name: 'Smartphone',
					},
					{
						id: 2,
						jenis_name: 'Laptop',
					},
				]
				this.listJenisAlat = jenisAlat
				let headsJenisAlat = this.headsTable[1]
				let filterJenisAlat = this.formFilter[1]
				jenisAlat.forEach((jenis, indexJns) => {
					let ja = {
						id: jenis.id,
						name: jenis.jenis_name,
						value: jenis.id,
						disabled: false,
					}
					headsJenisAlat.options.push(ja)
					filterJenisAlat.options.push(ja)
				})
			},
			async getAsalPengadaanAlat() {
				let asalPengadaan = [
					{
						id: 1,
						asal_pengadaan_name: 'Supplier',
					},
					{
						id: 2,
						asal_pengadaan_name: 'Pemerintah Daerah',
					},
				]
				this.listAsalPengadaanAlat = asalPengadaan

				// Simpan sebagai Options
				let headsAsalPengadaan = this.headsTable[2]
				let filterAsalPengadaan = this.formFilter[2]
				asalPengadaan.forEach((asal, indexJns) => {
					let ap = {
						id: asal.id,
						name: asal.asal_pengadaan_name,
						value: asal.id,
						disabled: false,
					}
					headsAsalPengadaan.options.push(ap)
					filterAsalPengadaan.options.push(ap)
				})
			},

			// Value Change
			asalPengadaanData(asalPengadaanId) {
				if (this.listAsalPengadaanAlat.length > 0) {
					return this.listAsalPengadaanAlat.find(
						(asal) => asal.id === asalPengadaanId
					).asal_pengadaan_name
				}
			},
			jenisAlat(jenisAlatId) {
				if (this.listJenisAlat.length > 0) {
					return this.listJenisAlat.find((jenis) => jenis.id === jenisAlatId)
						.jenis_name
				}
			},
			// Action Dropdown
			lihatDetail(indexData) {
				let data = this.listData[indexData]
				this.$router.push({ name: 'DetailAlat', params: { alat_id: 1 } })
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
