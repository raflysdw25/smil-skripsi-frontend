<template>
	<div class="list-jenis-alat-lab">
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
				<!-- START: HEAD -->
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
								@filterAction="getListJenisAlat"
								:filter_type="head.filter_type"
								:default_value="filterData[head.model]"
								:placeholder="head.placeholder"
								:options="head.options"
								:modelFilter="head.model"
							/>
						</th>
					</tr>
				</thead>
				<!-- END: HEAD -->

				<!-- START: EMPTY TABLE -->
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
				<!-- END: EMPTY TABLE -->

				<!-- START: FILLED TABLE -->
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
				<!-- END: FILLED TABLE -->
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
				:formFilled="buttonActive"
				:submitFunction="sendAddJenis"
				:closeFunction="closePopup"
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
				title="Filter Data Jenis Alat"
				:closeModal="closePopup"
				:form="formFilter"
				:formInput="filterData"
				:submitFunction="submitFilterData"
				:activeButton="activeFilter"
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
		name: 'list-jenis-alat-lab',
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAdd,
			BaseModalAlert,
		},
		mixins: [ModalMixins, TableMixins],
		data() {
			return {
				headsTable: [
					{
						label: 'Nama Jenis Alat',
						filter_type: 'search',
						placeholder: 'Filter Nama Jenis Alat',
						model: 'jenis_name',
						options: null,
					},
					{
						label: 'Attribut Spesifikasi',
						filter_type: 'search',
						placeholder: 'Filter Attribut Spesifikasi',
						model: 'spec_attributes',
						options: null,
					},
					'',
				],
				listData: [
					{
						id: 1,
						jenis_name: 'Smartphone',
						spec_attributes: 'Processor,  RAM, Storage, Kamera',
					},
				],
				filterData: {
					jenis_name: '',
					spec_attributes: '',
				},
				formFilter: [
					{
						label: 'Nama Jenis Alat',
						type: 'text',
						model: 'jenis_name',
						description: '',
						placeholder: 'Filter Nama Jenis Alat',
						isRequired: false,
					},
					{
						label: 'Attribut Spesifikasi',
						type: 'text',
						model: 'spec_attributes',
						description: '',
						placeholder: 'Filter Attribut Spesifikasi',
						isRequired: false,
					},
				],
				baseModalType: '',
				// Data Add Jenis Alat
				formAdd: [
					{
						id: 1,
						label: 'Nama Jenis Alat',
						type: 'text',
						disabled: false,
						model: '',
						canAddValue: false,
					},
					{
						id: 2,
						label: 'Attribut Spesifikasi Alat',
						type: 'text',
						model: [{ id: 1, value: '', disabled: false }],
						canAddValue: true,
					},
				],
				buttonActive: false,
			}
		},
		watch: {
			formAdd: {
				deep: true,
				handler: function() {
					// let attributSpek = this.formAdd[1].model.some((model) => {
					// 	model.value === ''
					// })
					// console.log(attributSpek)
					this.buttonActive = this.formAdd[0].model !== ''
				},
			},
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.jenis_name, //Nama Jenis Alat
						list.spec_attributes, // Attribute Spesifikasi
						indexList,
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			activeFilter() {
				return (
					this.filterPayload.jenis_name !== '' ||
					this.filterPayload.spec_attributes !== ''
				)
			},
			filterPayload() {
				return this.filterData
			},

			submitRequest() {
				// Untuk Tambah Data baru
				let spec_attr = ''
				this.formAdd[1].model.forEach((attr, idxAttr) => {
					if (attr.value !== '') {
						if (idxAttr !== this.formAdd.length) {
							spec_attr += `${attr.value}, `
						} else {
							spec_attr += `${attr.value}`
						}
					}
				})
				return {
					jenis_name: this.formAdd[0].model,
					spec_attributes: spec_attr,
				}
			},
		},
		async mounted() {
			await this.getListJenisAlat()
		},
		methods: {
			// Call API
			async getListJenisAlat() {
				this.tableInfo.totalPage =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
				// alert(this.filterData.jenis_name)
			},
			async sendAddJenis() {
				this.closePopup()
				this.showAlert(true)
				setTimeout(() => {
					alert(
						`${this.submitRequest.jenis_name} - ${this.submitRequest.spec_attributes}`
					)
					this.showAlert(false, true, 'Tambah Jenis Alat Berhasil')
					this.formAdd.forEach((form) => {
						if (typeof form.model !== 'object') {
							form.model = ''
						} else {
							form.model = [
								{
									id: 1,
									value: '',
									disabled: false,
								},
							]
						}
					})
				}, 1500)
			},
			submitFilterData() {
				this.getListJenisAlat(this.mobileFilter)
			},
			//Table Page Interaction
			// nextPage() {
			// 	if (this.tableInfo.pageNo !== this.tableInfo.totalPage) {
			// 		this.tableInfo.pageNo += 1
			// 	}
			// },
			// previousPage() {
			// 	if (this.tableInfo.pageNo !== 1) {
			// 		this.tableInfo.pageNo -= 1
			// 	}
			// },
			// jumpPage(pageNo) {
			// 	this.tableInfo.pageNo = pageNo
			// },
			// Value change
			// changeFilterValue(objFilter) {
			// 	this.filterData[objFilter.model] = objFilter.value
			// },
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
