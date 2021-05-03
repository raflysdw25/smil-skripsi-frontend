<template>
	<div class="layout-portal-peminjaman">
		<!-- START: Navbar -->
		<menu-navigation :listMenu="menus" type="navbar" />
		<!-- END: Navbar -->

		<!-- START: CONTENT VIEW -->
		<div class="content-peminjaman">
			<router-view />
		</div>
		<!-- END: CONTENT VIEW -->

		<!-- START: FOOTER -->
		<footer-layout />
		<!-- END: FOOTER -->
	</div>
</template>

<script>
	// Components
	import MenuNavigation from '@/components/MenuNavigation.vue'
	import FooterLayout from '@/components/FooterLayout.vue'

	export default {
		name: 'layout-portal-peminjaman',
		components: { MenuNavigation, FooterLayout },
		data() {
			return {
				menus: [
					{
						id: 1,
						text: 'Beranda',
						to: '/',
						icon: {
							iconName: 'scanner',
							size: 24,
							color: '#fff',
						},
					},
					{
						id: 2,
						text: 'Lapor Kerusakan Alat',
						to: '/',
						icon: { iconName: 'fixing-tools', size: 24, color: '#fff' },
					},
					{
						id: 3,
						text: 'Buat Akun',
						icon: {
							iconName: 'users',
							size: 24,
							color: '#fff',
						},
						child: [
							{ id: 1, text: 'Mahasiswa', to: '/' },
							{ id: 2, text: 'Staff/Dosen', to: '/' },
						],
					},
				],
			}
		},
	}
</script>

<style lang="scss" scoped>
	.layout-portal-peminjaman {
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		.content-peminjaman {
			height: 100%;
		}
	}
</style>
