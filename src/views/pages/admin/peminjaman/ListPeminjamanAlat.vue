<template>
	<div class="list-peminjaman-alat">
		<!-- START: BUTTON GROUP -->
		<div class="button-group d-flex">
			<button
				class="smil-btn smil-bg-info d-lg-none d-sm-block"
				@click="openPopup('filter-data')"
			>
				Filter Data
			</button>
			<button class="smil-btn smil-bg-secondary" @click="openPopup('ruangan')">
				Ruangan Kampus
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
								@filterAction="getListPeminjaman"
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
									<b-dropdown-item @click="tindakPeminjaman(true, indexRow)">
										Approve Request
									</b-dropdown-item>
									<b-dropdown-item @click="tindakPeminjaman(false, indexRow)">
										Reject Request
									</b-dropdown-item>
									<b-dropdown-item>
										Detail Peminjaman
									</b-dropdown-item>
									<b-dropdown-item>
										List Alat Dipinjam
									</b-dropdown-item>
									<b-dropdown-item>
										Informasi Peminjam
									</b-dropdown-item>
									<b-dropdown-item>
										<span class="smil-text-danger">
											Hapus Peminjaman
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

		<!-- START: MODAL POPUP -->
		<b-modal
			ref="modal-popup"
			hide-footer
			hide-header
			centered
			no-close-on-backdrop
			no-close-on-esc
			:size="baseModalType === 'ruangan' ? 'lg' : ''"
		>
			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>

			<base-modal-approve
				v-if="baseModalType === 'approval'"
				:isApprove="isApprove"
				:peminjamanId="selected_pjm.pjm_id"
				:closeModal="closePopup"
				@approvalAlert="approvalAlert"
			/>

			<form-filter-data
				v-if="baseModalType === 'filter-data'"
				title="Filter Data Peminjaman"
				:closeModal="closePopup"
				:formInput="filterData"
				:form="formFilter"
				@submitFilter="getListPeminjaman"
			/>

			<base-modal-list-support
				v-if="baseModalType === 'ruangan'"
				title="Ruangan Kampus"
				supportType="ruangan"
				:closeModal="closePopup"
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
	import BaseModalApprove from '@/components/BaseModal/BaseModalApprove.vue'
	import BaseModalListSupport from '@/components/BaseModal/BaseModalListSupport.vue'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'
	import TableMixins from '@/mixins/TableMixins'
	export default {
		name: 'list-peminjaman-alat',
		mixins: [ModalMixins, TableMixins],
		components: {
			IconComponent,
			FormFilterData,
			BaseFilter,
			BaseModalAlert,
			BaseModalApprove,
			BaseModalListSupport,
		},
		data() {
			return {
				headsTable: [
					{
						label: 'Waktu Peminjaman',
						filter_type: 'date',
						placeholder: 'Filter Waktu Peminjaman',
						model: 'created_at',
						options: null,
					},
					{
						label: 'Waktu Pengembalian',
						filter_type: 'date',
						placeholder: 'Filter Waktu Pengembalian',
						model: 'real_return_date',
						options: null,
					},
					{
						label: 'Nomor Induk Peminjam',
						filter_type: 'search',
						placeholder: 'Filter Nomor Induk Peminjam',
						model: 'nomor_induk',
						options: null,
					},
					{
						label: 'Status Peminjaman',
						filter_type: 'select',
						placeholder: 'Filter Status Peminjaman',
						model: 'pjm_status',
						options: [
							{
								name: 'All',
								value: null,
							},
							{
								name: 'Butuh Persetujuan',
								value: 1,
							},
							{
								name: 'Berhasil',
								value: 2,
							},
							{
								name: 'Ditolak',
								value: 3,
							},
							{
								name: 'Belum Kembali',
								value: 4,
							},
							{
								name: 'Selesai',
								value: 5,
							},
						],
					},
					'',
				],
				listData: [
					{
						id: 1,
						created_at: new Date(),
						real_return_date: new Date(),
						nomor_induk: 'Muhammad Rafly Sadewa',
						pjm_status: 2,
					},
				],
				filterData: {
					created_at: '',
					real_return_date: '',
					nomor_induk: '',
					pjm_status: null,
				},
				formFilter: [
					{
						label: 'Tanggal Peminjaman Alat',
						type: 'date',
						model: 'created_at',
						description: '',
						placeholder: 'Filter Tanggal Peminjaman Alat',
						isRequired: false,
					},
					{
						label: 'Tanggal Pengembalian Alat',
						type: 'date',
						model: 'real_return_date',
						description: '',
						placeholder: 'Filter Tanggal Pengembalian Alat',
						isRequired: false,
					},
					{
						label: 'Nomor Induk Peminjam',
						type: 'text',
						model: 'nomor_induk',
						description: '',
						placeholder: 'Filter Nomor Induk Peminjam',
						isRequired: false,
					},
					{
						label: 'Status Peminjaman',
						type: 'select',
						model: 'pjm_status',
						description: '',
						placeholder: 'Filter Status Peminjaman',
						isRequired: false,
						options: [
							{
								name: 'All',
								value: null,
							},
							{
								name: 'Butuh Persetujuan',
								value: 1,
							},
							{
								name: 'Berhasil',
								value: 2,
							},
							{
								name: 'Ditolak',
								value: 3,
							},
							{
								name: 'Belum Kembali',
								value: 4,
							},
							{
								name: 'Selesai',
								value: 5,
							},
						],
					},
				],
				selected_pjm: {},
				isApprove: '',
			}
		},
		computed: {
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [
						list.created_at, //ID Lokasi
						list.real_return_date, //Nama Lokasi
						list.nomor_induk, //kapasitas
						this.statusPeminjaman(list.pjm_status), //jenis
						'',
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
		async mounted() {
			await this.getListPeminjaman()

			// this.showAlert(false, false, 'Alert Berhasil')
		},
		methods: {
			// Call API
			async getListPeminjaman() {
				// alert(`Get Data Alat ${this.filterData.asal_alat}`)
				this.tableInfo.totalPage =
					this.listData.length < this.tableInfo.listSize
						? 1
						: this.listData.length / this.tableInfo.listSize
				this.tableInfo.listTotal = this.listData.length
				// Nembak API Get List Alat
			},
			// Value Change
			statusPeminjaman(status_id) {
				let listStatus = [
					{
						id: 1,
						text: 'Butuh Persetujuan',
						background: 'smil-bg-warning',
					},
					{
						id: 2,
						text: 'Berhasil',
						background: 'smil-bg-info',
					},
					{
						id: 3,
						text: 'Ditolak',
						background: 'smil-bg-danger',
					},
					{
						id: 4,
						text: 'Belum Kembali',
						background: 'smil-bg-warning',
					},
					{
						id: 5,
						text: 'Selesai',
						background: 'smil-bg-success',
					},
				]

				return listStatus.find((status) => status.id === status_id)
			},
			// Modal Interaction
			approvalAlert(alert) {
				this.showAlert(alert.isProcess, alert.isSuccess, alert.message)
			},
			// Action Dropdown
			lihatDetail(indexData) {},
			tindakPeminjaman(tindakan, row) {
				this.selected_pjm = this.listData[row]
				this.isApprove = tindakan
				this.openPopup('approval')
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
