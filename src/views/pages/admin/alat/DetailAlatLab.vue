<template>
	<div class="detail-alat-lab">
		<!-- START: HEADER -->
		<div class="header">
			<div class="header-title">
				<h1>{{ alatDetail.nama }}</h1>
				<p class="last-action">
					{{
						alatDetail.updated_at === null
							? `Ditambahkan pada ${alatDetail.created_at}`
							: `Diubah pada ${alatDetail.updated_at}`
					}}
				</p>
			</div>
			<div class="button-group">
				<button class="smil-btn smil-bg-danger">
					Hapus Data
				</button>
				<button class="smil-btn smil-bg-secondary">
					Edit Data
				</button>
				<button
					class="smil-btn smil-bg-primary"
					@click="
						$router.push({
							name: 'UploadFotoAlat',
							params: { alat_id: alatId },
						})
					"
				>
					Upload Foto
				</button>
			</div>
		</div>
		<!-- END: HEADER -->

		<!-- START: CONTENT DETAIL -->
		<div class="content smil-row">
			<div class="col-lg-5 alat-info">
				<table class="table table-borderless">
					<tr>
						<th>Jenis Alat</th>
						<td>{{ alatDetail.jenis_alat }}</td>
					</tr>
					<tr>
						<th>Asal Pengadaan</th>
						<td>{{ alatDetail.asal_pengadaan }}</td>
					</tr>
					<tr>
						<th>Tahun Pengadaan</th>
						<td>{{ alatDetail.tahun_pengadaan }}</td>
					</tr>
					<tr>
						<th>Supplier Alat</th>
						<td>{{ alatDetail.supplier }}</td>
					</tr>
					<tr>
						<th>Jumlah Alat</th>
						<td>{{ alatDetail.jumlah }}</td>
					</tr>
				</table>
			</div>
			<div class="col-lg-7 image-display">
				<h4>Foto Alat</h4>
				<div class="empty-image" v-if="alatDetail.image.length === 0">
					<p>Belum menggunggah foto untuk alat ini</p>
				</div>
			</div>
		</div>
		<!-- END: CONTENT DETAIL -->

		<!-- START: TABEL DETAIL ALAT -->
		<div class="table-detail-content table-responsive-sm">
			<div class="table-title d-flex align-items-center">
				<h4>List Alat Terdaftar</h4>
				<button
					class="smil-btn smil-bg-primary ml-auto"
					@click="openModalPopup('add')"
				>
					Tambah Alat
				</button>
			</div>
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
								@filterAction="getListDetailAlat"
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

		<!-- END: TABEL DETAIL ALAT -->

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
				modalTitle="Tambah Alat Baru"
				:formList="formAdd"
				:closeFunction="closeModalPopup"
				:formFilled="buttonActive"
			/>
		</b-modal>
		<!-- END: MODAL POPUP -->
	</div>
</template>

<script>
	// Components
	import IconComponent from '@/components/IconComponent.vue'
	import BaseFilter from '@/components/BaseFilter.vue'
	import BaseModalAdd from '@/components/BaseModal/BaseModalAdd.vue'
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'detail-alat-lab',
		components: { IconComponent, BaseFilter, BaseModalAdd },
		mixins: [FormInputMixins],
		data() {
			return {
				alatDetail: {
					nama: 'Busa Peredam',
					jenis_alat: 'Camera / Multimedia',
					asal_pengadaan: 'Barang Hibah Pemerintah',
					tahun_pengadaan: '2020',
					supplier: 'PEMERINTAH KOTA DEPOK',
					jumlah: 2,
					created_at: this.formatDate(new Date(), 'DD MMMM YYYY HH:ss A'),
					updated_at: null,
					image: [],
				},
				// Detail Alat Tabel
				headsAlatLab: [
					{
						id: 1,
						label: 'Barcode Alat',
						filter_type: 'search',
						placeholder: 'Filter Barcode Alat',
						model: 'barcode',
						options: null,
					},
					{
						id: 2,
						label: 'Kondisi Alat',
						filter_type: 'select',
						placeholder: 'Filter Kondisi Alat',
						model: 'kondisi_alat',
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
						id: 3,
						label: 'Ketersediaan Alat',
						filter_type: 'select',
						model: 'ketersediaan_alat',
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
						label: 'Lokasi Penyimpanan',
						filter_type: 'select',
						model: 'lokasi_id',
						options: [
							{
								id: 1,
								text: 'All',
								value: '',
								disabled: false,
							},
						],
					},

					'',
				],
				listAlatLab: [
					{
						id: 1,
						nama_alat: 'iPhone 7 Plus',
						asal_alat: 'BHP',

						jenis_alat_id: 1,
					},
					{
						id: 2,
						nama_alat: 'ASUS A412DA',
						asal_alat: 'HTA',

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
					barcode: '',
					kondisi_alat: '',
					ketersediaan_alat: '',
					lokasi_id: '',
				},
				// Popup Interaction
				formAdd: [
					{
						id: 1,
						label: 'Jumlah Alat',
						type: 'number',
						disabled: false,
						model: '',
						canAddValue: false,
					},

					{
						id: 2,
						label: 'Lokasi Penyimpanan',
						type: 'select',
						options: [
							{
								id: 1,
								text: 'Pilih Lokasi Penyimpanan',
								value: '',
								disabled: true,
							},
						],
						model: [{ id: 1, value: '', disabled: false }],
						canAddValue: false,
					},
				],
				baseModalType: '',
				buttonActive: false,
			}
		},
		mounted() {
			this.getListDetailAlat()
			this.getListLokasi()
		},
		methods: {
			// API
			async getListDetailAlat() {
				// alert(`Get Data Alat ${this.filterAlat.asal_alat}`)
				this.listInfo.pageSize =
					this.listAlatLab.length < this.listInfo.listSize
						? 1
						: this.listAlatLab.length / this.listInfo.listSize
				this.listInfo.listTotal = this.listAlatLab.length
				// Nembak API Get List Alat
			},
			async getListLokasi() {},
			// DETAIL TABEL CONTENT
			changeFilterValue(objFilter) {
				this.filterAlat[objFilter.model] = objFilter.value
			},
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
			// Popup Interaction
			openModalPopup(type) {
				this.baseModalType = type
				this.$refs['modal-popup'].show()
			},
			closeModalPopup() {
				this.baseModalType = ''
				this.$refs['modal-popup'].hide()
			},
		},
		computed: {
			alatId() {
				return this.$route.params.alat_id
			},
			listTable() {
				let listTable = []
				this.listAlatLab.forEach((list, indexList) => {
					let rowTable = [
						list.id, //ID Alat
						list.nama_alat, //Nama Alat
						list.jenis_alat_id, //Jenis Alat (Ambil berdasarkan table jenis alat)
						list.asal_alat, //Asal Pengadaan
						indexList, //Index Data
					]

					listTable.push(rowTable)
				})

				return listTable
			},
		},
	}
</script>

<style lang="scss" scoped>
	.detail-alat-lab {
		height: 100vh;
		.header {
			display: flex;
			align-items: center;
			.header-title {
				h1 {
					font-size: 24px;
					font-weight: 700;
				}
				.last-action {
					font-size: 14px;
					color: #c5c5c5;
				}
			}
			.button-group {
				margin-left: auto;
				display: flex;
				flex-flow: row;
				button {
					margin-left: 12px;
				}
			}
		}

		.content {
			margin-top: 40px;
			.image-display {
				h4 {
					font-weight: 700;
					font-size: 16px;
					margin-bottom: 0;
				}
				.empty-image {
					font-size: 16px;
					color: #c5c5c5;
					margin-top: 15px;
				}
			}
			.alat-info {
				th,
				td {
					font-size: 16px;
				}
			}
		}

		.table-detail-content {
			margin-top: 60px;
			.table-title {
				margin-bottom: 40px;
			}
			h4 {
				font-size: 16px;
				font-weight: 700;
			}
		}
	}
</style>

<style lang="scss">
	.detail-alat-lab {
		.col-lg-12,
		.col-lg-5,
		.col-lg-7 {
			padding-left: 0;
		}

		.alat-info {
			.table {
				th,
				td {
					padding-left: 0;
					padding-top: 15px;
					padding-bottom: 15px;
				}

				tr {
					&:first-child {
						th,
						td {
							padding-top: 0;
						}
					}
				}
			}
		}
	}
</style>
