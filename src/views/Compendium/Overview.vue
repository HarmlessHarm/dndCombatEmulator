<template>
<div class="grid">
	<div class="content">
		<Crumble />
		<h1>Compendium</h1>
		<p>
			All content is provided under terms of the 
			<a href="./SRD-OGL_V5.1.pdf" target="_blank" rel="noopener">Open Gaming License version 1.0a.</a>
		</p>
		<ul class="entities hasImg">
			<li v-for="(item, index) in items" :key="index">
				<i class="img mr-2" :class="item.icon"></i> <router-link :to="$route.path+'/'+item.url">{{ item.name }}</router-link>
			</li>
		</ul>
	</div>
	<Footer />
</div>
</template>

<script>
	import Footer from '@/components/Footer.vue'
	import Crumble from '@/components/crumble/Compendium.vue'

	export default {
		name: 'Compendium',
		components: {
			Crumble,
			Footer,
		},
		metaInfo: {
			title: 'Compendium'
		},
		data() {
			return {
				items: {
					'conditions': { 
						name: 'Conditions',
						url: 'conditions',
						icon: 'fas fa-skull-crossbones',
					},
					'items': { 
						name: 'Items',
						url: 'items',
						icon: 'fas fa-treasure-chest',
					},
					'monsters': { 
						name: 'Monsters',
						url: 'monsters',
						icon: 'fas fa-dragon',
					},
					'spells': { 
						name: 'Spells',
						url: 'spells',
						icon: 'fas fa-wand-magic',
					},
				},
			}
		},
		beforeMount() {
			//Because the component is loaded in another view, 
			//the scroll needs to be reset to 0
			window.scrollTo(0,0);
		},
	}
</script>

<style lang="scss" scoped>
.grid {
	height: calc(100vh - 50px) !important;
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: 3fr 1fr;
	grid-gap: 0;
	grid-template-areas: 
	"container"
	"footer";

	.content {
		padding-top: 30px;
		padding-bottom: 50px;
		line-height: 25px;
		font-size: 15px; 
		font-weight: lighter;

		ul.entities {
			li {
				.img {
					border: none;
					background: none;
					text-align: center;
					font-size: 20px;
					line-height: 48px;
				}
			}
		}
	}
}

</style>