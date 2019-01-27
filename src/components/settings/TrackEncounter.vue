<template>
	<section id="track">
		<b-card header="Track Encounter Settings">
			<p class="mb-5">Track encounter is what we call the link you can share with your party, 
				or put up on a second screen for your party to see. 
				In here players can follow the encounter, 
				see who's turn it is and what the status of the entities within the encounter is. 
				Below you can determine what should be visible on the track encounter screen.
			</p>

			<h3>General</h3>
			<ul class="settings">
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-swords"></i> Damage Meters</span>

					<div>
						<div v-show="player.meters === false">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('unset', 'player', 'meters')" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="player.meters === undefined">
							<a v-b-tooltip.hover title="Hide" @click="set('set', 'player', 'meters', false)" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-treasure-chest"></i> Loot</span>

					<div>
						<div v-show="!player.loot">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('set', 'player', 'loot', true)" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="player.loot == true">
							<a v-b-tooltip.hover title="Hide" @click="set('unset', 'player', 'loot')" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
			</ul>

			<h3>NPC settings</h3>
			<ul class="settings">
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-heart"></i> Health</span>

					<div>
						<div v-show="!npc.health">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('set', 'npc', 'health', true)" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="npc.health == true">
							<a v-b-tooltip.hover title="Hide" @click="set('unset', 'npc', 'health')" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-shield"></i> Armor Class</span>

					<div>
						<div v-show="!npc.ac">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('set', 'npc', 'ac', true)" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="npc.ac == true">
							<a v-b-tooltip.hover title="Hide" @click="set('unset', 'npc', 'ac')" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
				<li class="d-flex justify-content-between">
					<span>Conditions</span>

					<div>
						<div v-show="npc.conditions === false">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('unset', 'npc', 'conditions')" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="npc.conditions === undefined">
							<a v-b-tooltip.hover title="Hide" @click="set('set', 'npc', 'conditions', false)" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
			</ul>

			<h3>Player settings</h3>
			<ul class="settings">
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-heart"></i> Health</span>

					<div>
						<div v-show="player.health === false">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('unset', 'player', 'health')" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="player.health === undefined">
							<a v-b-tooltip.hover title="Hide" @click="set('set', 'player', 'health', false)" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
				<li class="d-flex justify-content-between">
					<span><i class="fas fa-shield"></i> Armor Class</span>

					<div>
						<div v-show="player.ac === false">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('unset', 'player', 'ac')" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="player.ac === undefined">
							<a v-b-tooltip.hover title="Hide" @click="set('set', 'player', 'ac', false)" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
				<li class="d-flex justify-content-between">
					Conditions

					<div>
						<div v-show="player.conditions === false">
							<span v-b-tooltip.hover title="Hidden" class="red mr-2"><i class="fas fa-eye-slash"></i></span>
							<a v-b-tooltip.hover title="Show" @click="set('unset', 'player', 'conditions')" class="gray-light"><i class="fas fa-eye"></i></a>
						</div>
						<div v-show="player.conditions === undefined">
							<a v-b-tooltip.hover title="Hide" @click="set('set', 'player', 'conditions', false)" class="gray-light mr-2"><i class="fas fa-eye-slash"></i></a>
							<span v-b-tooltip.hover title="Shown" class="green"><i class="fas fa-eye"></i></span>
						</div>
					</div>
				</li>
			</ul>


			<a class="btn" @click="setDefault()">Set default</a>
		</b-card>
	</section>
</template>

<script>
	import { db } from '@/firebase';

	export default {
		name: 'Track',
		data(){
			return {
				userId: this.$store.getters.getUser.uid,
			}
		},
		firebase() {
			return {
				npc: {
					source: db.ref(`settings/${this.userId}/track/npc`),
					asObject: true,
				},
				player: {
					source: db.ref(`settings/${this.userId}/track/player`),
					asObject: true,
				}	
			}
		},
		methods: {
			set(action, entity, type, value) {
				if(action == 'set') {
					db.ref(`settings/${this.userId}/track/${entity}/${type}`).set(value);
				}
				if(action == 'unset') {
					db.ref(`settings/${this.userId}/track/${entity}/${type}`).remove();
				}
			},
			setDefault() {
				db.ref(`settings/${this.userId}/track`).remove();
			}
		}
	}
</script>

<style lang="scss" scoped>
	ul.settings {
		border-top: solid 1px #302f2f;;
		padding: 0;
		list-style: none;
		margin-bottom: 60px;

		li {
			font-size: 13px;
			padding: 15px 5px;
			border-bottom: solid 1px #302f2f;
		}
	}
</style>