<template>
	<div class="list-civitas-jurusan">
		<button class="smil-btn smil-bg-info ml-auto" @click="openPopup('prodi')">
			Program Studi
		</button>
		<div class="tabs-menu">
			<b-tabs content-class="mt-3" lazy>
				<!-- <b-tab title="Staff Jurusan" active>
					<list-staff-jurusan />
				</b-tab>
				<b-tab title="Mahasiswa"> </b-tab> -->
				<b-tab
					:title="tab.title"
					v-for="(tab, idxTab) in tabs"
					:key="`tab-menu-${idxTab}`"
					:active="activeTab === tab.id"
					@click="setActiveTab(tab.id)"
				>
					<list-staff-jurusan v-if="activeTab === 1" />
					<list-mahasiswa v-if="activeTab === 2" />
				</b-tab>
			</b-tabs>
		</div>

		<b-modal
			ref="modal-popup"
			hide-footer
			hide-header
			centered
			no-close-on-backdrop
			no-close-on-esc
			:size="baseModalType === 'prodi' ? 'lg' : ''"
		>
			<base-modal-list-support
				v-if="baseModalType === 'prodi'"
				title="Program Studi TIK"
				supportType="prodi"
				:closeModal="closePopup"
			/>
		</b-modal>
	</div>
</template>

<script>
	// Components
	import ListStaffJurusan from '@/components/Admin/Civitas/ListStaffJurusan'
	import ListMahasiswa from '@/components/Admin/Civitas/ListMahasiswa'
	import BaseModalListSupport from '@/components/BaseModal/BaseModalListSupport.vue'

	// Mixin
	import ModalMixins from '@/mixins/ModalMixins'

	export default {
		name: 'list-civitas-jurusan',
		components: { ListStaffJurusan, ListMahasiswa, BaseModalListSupport },
		mixins: [ModalMixins],
		data() {
			return {
				tabs: [
					{
						id: 1,
						title: 'Staff Jurusan',
					},
					{
						id: 2,
						title: 'Mahasiswa',
					},
				],
				activeTab: 1,
			}
		},
		computed: {},
		methods: {
			setActiveTab(id) {
				this.activeTab = id
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list-civitas-jurusan {
		.tabs-menu {
			margin-top: 20px;
		}
	}
</style>
<style lang="scss">
	.list-civitas-jurusan {
		.nav-tabs {
			border-bottom: none;
			.nav-link {
				border: none;
				color: #696969;
				font-size: 20px;
				padding: 7px 0;
				margin-right: 14px;
				&.active {
					color: #101939;
					font-weight: 700;
					border-bottom: 2px solid;
					border-color: #101939;
				}
			}
		}

		.tab-content {
			padding: 60px 15px;
			padding-top: 60px;
			border: 1px solid #696969;
			max-height: 700px;
			overflow-y: scroll;
		}
	}
</style>
