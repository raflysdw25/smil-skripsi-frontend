<template>
	<div class="dashboard-admin">
		<!-- START: SECTION STATISTIC -->
		<section class="section-statistic">
			<div class="title-section d-flex">
				<div class="flex-column">
					<h4 class="title">Statistik Laboratorium</h4>
					<p class="title-description">Per {{ currentDate }}</p>
				</div>
				<div class="ml-auto">
					<h4 class="title">{{ statistic.total }}</h4>
					<p class="title-description">Alat Terdaftar</p>
				</div>
			</div>
			<div class="statistic-section">
				<div
					class="statistic-card"
					:class="stc.class"
					v-for="(stc, indexStc) in statisticCount"
					:key="`statistic-${indexStc}-card-${stc.id}`"
				>
					<div class="statistic-info">
						<p class="statistic-count">{{ statistic[stc.modelCount] }}</p>
						<p class="statistic-description">
							{{ stc.text }}
						</p>
					</div>
					<b-icon :icon="stc.icon" class="ml-auto icon-size"></b-icon>
				</div>
			</div>
		</section>
		<!-- END: SECTION STATISTIC -->

		<!-- START: SECTION PEMINJAMAN TABLE SUMMARY -->
		<section class="section-peminjaman-summary">
			<!-- START: TITLE SECTION -->
			<div class="title-section d-flex align-items-start">
				<div class="flex-column">
					<h4 class="title">Peminjaman Alat Terbaru</h4>
					<p class="title-description">Per {{ currentDate }}</p>
				</div>
				<button
					class="smil-btn smil-bg-primary ml-auto"
					@click="$router.push({ name: 'ListPeminjamanAlat' })"
				>
					Selengkapnya
				</button>
			</div>
			<!-- END: TITLE SECTION -->

			<!-- START: TABLE -->
			<table class="table smil-table">
				<thead class="smil-thead">
					<tr>
						<th
							v-for="(head, indexHds) in headsPeminjaman"
							:key="`header-table-${head}-${indexHds}`"
						>
							{{ head }}
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="bodysPeminjaman.length === 0">
					<tr>
						<td
							:colspan="headsPeminjaman.length"
							class="text-center empty-table"
						>
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
						v-for="(body, indexBdy) in bodysPeminjaman"
						:key="`body-table-${body.id}-${indexBdy}`"
					>
						<td
							v-for="(col, indexClmn) in Object.keys(body)"
							:key="`column-${col}${indexClmn}`"
						>
							<template v-if="indexClmn === 5">
								<button class="smil-btn smil-btn-small smil-bg-info">
									Lihat Detail
								</button>
							</template>
							<template v-else>
								{{ body[col] }}
							</template>
						</td>
					</tr>
					<tr>
						<td
							:colspan="Object.keys(bodysPeminjaman[0]).length"
							:style="{ 'padding-bottom': `${bodysPeminjaman.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
			<!-- END: TABLE -->
		</section>
		<!-- END: SECTION PEMINJAMAN TABLE SUMMARY -->

		<!-- START: SECTION KERUSAKAN ALAT TABLE SUMMARY -->
		<section class="section-laporan-kerusakan-summary">
			<!-- START: TITLE SECTION -->
			<div class="title-section d-flex align-items-start">
				<div class="flex-column">
					<h4 class="title">Laporan Kerusakan Alat Terbaru</h4>
					<p class="title-description">Per {{ currentDate }}</p>
				</div>
				<button
					class="smil-btn smil-bg-primary ml-auto"
					@click="$router.push({ name: 'LaporanKerusakanAlat' })"
				>
					Selengkapnya
				</button>
			</div>
			<!-- END: TITLE SECTION -->

			<!-- START: TABLE -->
			<table class="table smil-table">
				<thead class="smil-thead">
					<tr>
						<th
							v-for="(head, indexHds) in headKerusakan"
							:key="`header-table-${head}-${indexHds}`"
						>
							{{ head }}
						</th>
					</tr>
				</thead>
				<tbody class="smil-tbody" v-if="bodysKerusakan.length === 0">
					<tr>
						<td :colspan="headKerusakan.length" class="text-center empty-table">
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
						v-for="(body, indexBdy) in bodysKerusakan"
						:key="`body-table-${body.id}-${indexBdy}`"
					>
						<td
							v-for="(col, indexClmn) in Object.keys(body)"
							:key="`column-${col}${indexClmn}`"
						>
							<template v-if="indexClmn === 5">
								<button class="smil-btn smil-btn-small smil-bg-info">
									Lihat Detail
								</button>
							</template>
							<template v-else>
								{{ body[col] }}
							</template>
						</td>
					</tr>
					<tr>
						<td
							:colspan="Object.keys(bodysKerusakan[0]).length"
							:style="{ 'padding-bottom': `${bodysKerusakan.length * 50}px` }"
						></td>
					</tr>
				</tbody>
			</table>
			<!-- END: TABLE -->
		</section>
		<!-- END: SECTION KERUSAKAN ALAT TABLE SUMMARY -->
	</div>
</template>

<script>
	// Components
	import IconComponent from '@/components/IconComponent.vue'

	export default {
		name: 'dashboard-admin',
		components: { IconComponent },
		data() {
			return {
				months: [
					'Januari',
					'Februari',
					'Maret',
					'April',
					'Mei',
					'Juni',
					'Juli',
					'Agustus',
					'September',
					'Oktober',
					'November',
					'Desember',
				],
				statisticCount: [
					{
						id: 1,
						text: 'Alat Baik',
						class: 'smil-bg-success',
						modelCount: 'baik',
						icon: 'check-circle-fill',
					},
					{
						id: 2,
						text: 'Alat Rusak',
						class: 'smil-bg-danger',
						modelCount: 'rusak',
						icon: 'x-circle-fill',
					},
					{
						id: 3,
						text: 'Alat Diperbaiki',
						class: 'smil-bg-info',
						modelCount: 'perbaiki',
						icon: 'tools',
					},
				],
				headsPeminjaman: [
					'ID Peminjaman',
					'Waktu Peminjaman',
					'Waktu Pengembalian',
					'Nama Peminjam',
					'Status Peminjaman',
					'Alat Dipinjam',
				],
				headKerusakan: [
					'Tanggal Lapor',
					'Nama Pelapor',
					'Barcode Alat',
					'Kronologi Kerusakan',
					'Status Laporan',
				],
			}
		},
		mounted() {},
		computed: {
			currentDate() {
				let today = new Date()
				let day = String(today.getDate()).padStart(2, '0')
				let month = today.getMonth()
				let year = today.getFullYear()

				return `${day} ${this.months[month]} ${year}`
			},
			statistic() {
				return {
					baik: 6459,
					rusak: 34,
					perbaiki: 7,
					total: 6500,
				}
			},
			bodysPeminjaman() {
				return [
					{
						id: 1,
						wkt_pmnjm: new Date().toDateString(),
						wkt_kmbl: new Date().toDateString(),
						nama_pmnjm: 'Muhammad Rafly Sadewa',
						status: 'Belum Kembali',
						detail: 1,
					},
				]
			},
			bodysKerusakan() {
				return []
			},
		},
	}
</script>

<style lang="scss" scoped>
	.title-section {
		.title {
			font-size: 24px;
			font-weight: 700;
		}

		.title-description {
			font-size: 16px;
			color: #c5c5c5;
		}
	}

	.statistic-section {
		display: flex;
		flex-flow: row;
		.statistic-card {
			width: 100%;
			height: 150px;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: left;
			padding: 0 20px;
			margin-right: 34px;
			&:last-child {
				margin-right: 0;
			}

			.statistic-info {
				p {
					margin-bottom: 0;
				}
				.statistic-count {
					font-size: 40px;
					font-weight: bold;
				}
				.statistic-description {
					font-size: 20px;
				}
			}
			.icon-size {
				width: 64px;
				height: 64px;
			}
		}
	}

	section {
		margin-bottom: 40px;
	}

	@media screen and (max-width: 992px) {
		.statistic-section {
			flex-flow: column;
			.statistic-card {
				margin-bottom: 20px;
			}
		}
	}
</style>
