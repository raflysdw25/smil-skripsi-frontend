<template>
	<div class="list-jenis-alat-lab">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button class="smil-btn smil-bg-primary" @click="openPopup('add')">
				Tambah Data
			</button>
		</div>
		<!-- END: BUTTON GROUP -->

		<!-- START: LIST DATA -->
		<table class="table table-responsive-lg smil-table">
			<!-- START: HEAD -->
			<thead class="smil-thead">
				<tr>
					<th
						v-for="(head, indexHds) in headsTable"
						:key="`header-table-${head.id}-${indexHds}`"
					>
						{{ head.label }}
						<base-filter
							filter_class="d-none d-lg-block"
							:filter_type="head.filter_type"
							:default_value="filterJenis[head.model]"
							:placeholder="head.placeholder"
							:options="head.options"
							:modelFilter="head.model"
						/>
					</th>
				</tr>
			</thead>
			<!-- END: HEAD -->

			<!-- START: EMPTY TABLE -->
			<tbody class="smil-tbody" v-if="listJenisAlat.length === 0">
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
						:style="{ 'padding-bottom': `${listJenisAlat.length * 50}px` }"
					></td>
				</tr>
			</tbody>
			<!-- END: FILLED TABLE -->
		</table>
		<!-- END: LIST DATA -->

		<!-- START: PAGINATION INFO SECTION -->
		<div class="pagination-section">
			<div class="table-counter">
				{{ `${listJenisAlat.length} dari ${listJenisAlat.length} Data` }}
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

	export default {
		name: 'list-jenis-alat-lab',
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAdd,
			BaseModalAlert,
		},
		mixins: [ModalMixins],
		data() {
			return {
				headsTable: [
					{
						id: 1,
						label: 'ID Jenis Alat',
						filter_type: 'search',
						placeholder: 'Filter ID Jenis Alat',
						model: 'id',
						options: null,
					},
					{
						id: 2,
						label: 'Nama Jenis Alat',
						filter_type: 'search',
						placeholder: 'Filter Nama Jenis Alat',
						model: 'nama',
						options: null,
					},
					{
						id: 2,
						label: 'Attribut Spesifikasi',
						filter_type: 'search',
						placeholder: 'Filter Attribut Spesifikasi',
						model: 'attribut',
						options: null,
					},
					'',
				],
				listJenisAlat: [
					{
						id: 1,
						nama_jenis: 'Smartphone',
						attr_spek: ['Processor', 'RAM', 'Storage', 'Kamera'],
					},
				],
				listInfo: {
					listSize: 5,
					listTotal: 0,
					pageNo: 1,
					pageSize: 10,
				},
				filterJenis: {
					id: '',
					nama: '',
					attribut: '',
				},
				formFilter: [
					{
						id: 1,
						label: 'ID Jenis Alat',
						type: 'number',
						model: 'id',
						description: '',
						placeholder: 'Filter ID Jenis Alat',
						isRequired: false,
					},
					{
						id: 2,
						label: 'Nama Jenis Alat',
						type: 'text',
						model: 'nama',
						description: '',
						placeholder: 'Filter Nama Jenis Alat',
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
				this.listJenisAlat.forEach((list, indexList) => {
					let spec_attr = ''
					list.attr_spek.forEach((spec) => {
						if (spec_attr === '') {
							spec_attr += spec
						} else {
							spec_attr += `, ${spec}`
						}
					})
					let rowTable = [
						list.id, //ID Jenis Alat
						list.nama_jenis, //Nama Jenis Alat
						spec_attr, // Attribute Spesifikasi
						indexList,
					]

					listTable.push(rowTable)
				})

				return listTable
			},
			submitRequest() {
				let spec_attr = []
				this.formAdd[1].model.forEach((attr) => {
					if (attr.value !== '') {
						spec_attr.push(attr.value)
					}
				})
				return {
					jenis_name: this.formAdd[0].model,
					spec_attributes: JSON.stringify(spec_attr),
				}
			},
		},
		async mounted() {
			await this.getListJenisAlat()
		},
		methods: {
			// Call API
			async getListJenisAlat() {
				// alert(`Get Data Alat ${this.filterAlat.asal_alat}`)
				this.listInfo.pageSize =
					this.listJenisAlat.length < this.listInfo.listSize
						? 1
						: this.listJenisAlat.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listJenisAlat.length
				// Nembak API Get List Alat
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
			//Table Page Interaction
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
			// Modal Interaction
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
