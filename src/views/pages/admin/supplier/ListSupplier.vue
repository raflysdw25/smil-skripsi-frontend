<template>
	<div class="list-supplier">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-primary"
				@click="$router.push({ name: 'TambahSupplier' })"
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
							v-for="(head, indexHds) in headsSupplier"
							:key="`header-table-${head.id}-${indexHds}`"
						>
							{{ head.label }}
							<base-filter
								filter_class="d-none d-lg-block"
								@changeValue="changeFilterValue"
								@filterAction="getListSupplier"
								:filter_type="head.filter_type"
								:default_value="filterSupplier[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="listSupplier.length === 0">
					<tr>
						<td :colspan="headsSupplier.length" class="text-center empty-table">
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
									<b-dropdown-item @click="lihatDetail(content)">
										Lihat Detail Supplier
									</b-dropdown-item>
									<b-dropdown-item>
										Edit Supplier
									</b-dropdown-item>
									<b-dropdown-item>
										<span class="smil-text-danger">
											Hapus Supplier
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
							:colspan="Object.keys(headsSupplier).length"
							:style="{ 'padding-bottom': `${listSupplier.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listSupplier.length} dari ${listSupplier.length} Data` }}
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
				:formInput="filterSupplier"
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
		name: 'list-supplier',
		components: { IconComponent, FormFilterData, BaseFilter },
		data() {
			return {
				headsSupplier: [
					{
						id: 1,
						label: 'ID Supplier',
						filter_type: 'search',
						placeholder: 'Filter ID Supplier',
						model: 'id',
						options: null,
					},
					{
						id: 2,
						label: 'Nama Supplier',
						filter_type: 'search',
						placeholder: 'Filter Nama Supplier',
						model: 'nama',
						options: null,
					},
					{
						id: 3,
						label: 'Alamat Supplier',
						filter_type: 'search',
						placeholder: 'Filter Alamat Supplier',
						model: 'alamat',
						options: null,
					},
					'',
				],
				listSupplier: [
					{
						id: 1,
						nama_supplier: 'iPhone 7 Plus',
						alamat_supplier:
							'Jl. Panaragan Penggilingan No 07 RT 01 RW 06 Bogor Tengah',
					},
					{
						id: 2,
						nama_supplier: 'ASUS A412DA',
						alamat_supplier:
							'Jl. Panaragan Penggilingan No 07 RT 01 RW 06 Bogor Tengah',
					},
				],
				listInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterSupplier: {
					id: '',
					nama: '',
					alamat: '',
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
				this.listSupplier.forEach((list, indexList) => {
					let rowTable = [
						list.id, //ID Alat
						list.nama_supplier, //Nama Supplier
						list.alamat_supplier, //Alamat Supplier
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
		async mounted() {
			await this.getListSupplier()
			// await this.getListJenisAlat()
		},
		methods: {
			// Call API
			async getListSupplier() {
				// alert(`Get Data Alat ${this.filterSupplier.asal_alat}`)
				this.listInfo.pageSize =
					this.listSupplier.length < this.listInfo.listSize
						? 1
						: this.listSupplier.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listSupplier.length
				// Nembak API Get List Alat
			},

			submitFilterData(formInput) {
				this.filterSupplier = formInput
				alert(this.filterSupplier)
				// this.getListSupplier()
			},
			changeFilterValue(objFilter) {
				this.filterSupplier[objFilter.model] = objFilter.value
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
