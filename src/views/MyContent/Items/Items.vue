<template>
	<div class="content" v-if="tier">
		<h1>Your Items</h1>
		<p>These are your custom Items that you can use in your campaigns.</p>

		<OverEncumbered v-if="overencumbered"/>
		<OutOfSlots 
			v-else-if="content_count.items >= tier.benefits.items"
			type = 'items'
		/>
	
		<template v-if="items">
			<h2 class="mt-3 d-flex justify-content-between">
				<span>
					Items ( 
					<span :class="{ 'green': true, 'red': content_count.items >= tier.benefits.items }">{{ Object.keys(items).length }}</span> 
					/ 
					<i v-if="tier.benefits.items == 'infinite'" class="far fa-infinity"></i>
					<template v-else>{{ tier.benefits.items }}</template>
					)
				</span>
				<router-link v-if="!overencumbered" to="/items/add-item">
					<i class="fas fa-plus green"></i> New Item
				</router-link>
			</h2>

			<hk-table
				:columns="columns"
				:items="_items"
				:perPage="20"
				:search="['name', 'type']"
			>
				<template slot="image" slot-scope="data">
					<div class="image" v-if="data.item" :style="{ backgroundImage: 'url(\'' + data.item + '\')' }"></div>
					<img v-else class="image" src="@/assets/_img/styles/axe.svg" />
				</template>

				<template slot="name" slot-scope="data">
					<router-link class="mx-2" :to="'/items/' + data.row.key">
						{{ data.item }}
						<q-tooltip anchor="top middle" self="center middle">
							Edit
						</q-tooltip>
					</router-link>
				</template>

				<div slot="actions" slot-scope="data" class="actions">
					<router-link class="gray-hover mx-1" :to="'/items/' + data.row.key">
						<i class="fas fa-pencil"></i>
						<q-tooltip anchor="top middle" self="center middle">
							Edit
						</q-tooltip>
					</router-link>
					<a class="gray-hover" @click="confirmDelete($event, data.row.key, data.row.name)">
						<i class="fas fa-trash-alt"></i>
						<q-tooltip anchor="top middle" self="center middle">
							Delete
						</q-tooltip>
					</a>
				</div>
			</hk-table>

			<template v-if="slotsLeft > 0 && tier.benefits.items !== 'infinite'">
				<div 
					class="openSlot"
					v-for="index in slotsLeft"
					:key="'open-slot-' + index"
				>
					<span>Open item slot</span>
					<router-link v-if="!overencumbered" to="/items/add-items">
						<i class="fas fa-plus green"></i>
					</router-link>
				</div>
			</template>
			<template v-if="!tier || tier.name === 'Free'">
				<router-link class="openSlot none" to="/patreon">
					Support us on Patreon for more slots.
				</router-link>
			</template>
		</template>
		<h3 v-else-if="items === null" class="mt-4">
			<router-link v-if="!overencumbered" to="/items/add-item">
				<i class="fas fa-plus green"></i> Create your first item
			</router-link>
		</h3>
		<div v-else class="loader"><span>Loading items...</span></div>
	</div>
</template>

<script>
	import _ from 'lodash'
	import OverEncumbered from '@/components/OverEncumbered.vue'
	import OutOfSlots from '@/components/OutOfSlots.vue'
	import { mapGetters } from 'vuex'
	import { db } from '@/firebase'

	export default {
		name: 'Items',
		metaInfo: {
			title: 'Items'
		},
		components: {
			OverEncumbered,
			OutOfSlots
		},
		data() {
			return {
				userId: this.$store.getters.user.uid,
				columns: {
					image: {
						width: 46,
						noPadding: true
					},
					name: {
						label: 'Name',
						truncate: true
					},
					actions: {
						label: '<i class="far fa-ellipsis-h"></i>',
						noPadding: true,
						right: true,
						maxContent: true
					}
				}
			}
		},
		firebase() {
			return {
				items: db.ref(`custom_items/${this.userId}`)
			}
		},
		computed: {
			...mapGetters([
				'tier',
				'campaigns',
				'overencumbered',
				'content_count',
			]),
			_items: function() {
				return _.chain(this.items)
				.filter(function(item) {
					item.key = item['.key']
					return item
				})
				.orderBy("name", 'asc')
				.value()
			},
			slotsLeft() {
				return this.tier.benefits.items - Object.keys(this.items).length;
			}
		},
		methods: {
			confirmDelete(e, key, item) {
				//Instantly delete when shift is held
				if(e.shiftKey) {
					this.deleteItem(key);
				} else {
					this.$snotify.error('Are you sure you want to delete ' + item + '? It will also remove it from the campaign inventories it is linked to.', 'Delete item', {
						timeout: false,
						buttons: [
							{
								text: 'Yes', action: (toast) => { 
								this.deleteItem(key)
								this.$snotify.remove(toast.id); 
								}, 
								bold: false
							},
							{
								text: 'No', action: (toast) => { 
									this.$snotify.remove(toast.id); 
								}, 
								bold: true
							},
						]
					});
				}
			},
			deleteItem(key) {
				//Remove the item from all inventories
				for(let campaignKey in this.campaigns) {
					let campaign = this.campaigns[campaignKey];

					if(campaign.inventory) {
						for(let itemKey in campaign.inventory.items) {
							let linked_item = campaign.inventory.items[itemKey].linked_item;

							if(linked_item === key){
								db.ref(`campaigns/${this.userId}/${campaignKey}/inventory/items/${itemKey}`).child('linked_item').remove();
							}
						}
					}
				}
				//Remove item
				db.ref('custom_items/' + this.userId).child(key).remove(); 
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container-fluid {
		padding: 20px;

		h2 {
			border-bottom: solid 1px $gray-light;
			padding-bottom: 10px;

			a {
				text-transform: none;
				color: $gray-light !important;

				&:hover {
					text-decoration: none;
				}
			}
		}
	}
</style>