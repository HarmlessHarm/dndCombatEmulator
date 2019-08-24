<template>
<div v-if="campaign">
	<template v-if="!campaign.private">
		<!-- NOT BROADCASTING -->
		<div class="track" :style="{ backgroundImage: 'url(\'' + campaign.background + '\')' }" v-if="!encounter || broadcasting['.value'] != $route.params.campid">
			<div class="top">
				<router-link :to="`/user/${$route.params.userid}`"><i class="fas fa-chevron-left"></i> Back</router-link>
				<span class="title">{{ campaign.campaign }}</span>
				<span>
					<span class="live active" v-if="broadcasting['.value'] == $route.params.campid">live</span>
				</span>
			</div>
			<div class="container-fluid">
				<div class="container entities">
					<CampaignOverview :players="campaign.players" />
				</div>
			</div>
		</div>

		<!-- BROADCASTING -->
		<div class="track" v-else-if="encounter && broadcasting['.value'] == $route.params.campid" :style="{ backgroundImage: 'url(\'' + encounter.background + '\')' }">
			
			<!-- FINISHED -->
			<div v-if="encounter.finished == true">
				<div class="top d-flex justify-content-between">
					<router-link :to="`/user/${$route.params.userid}`"><i class="fas fa-chevron-left"></i> Back</router-link>
					{{ campaign.name }}
					<span>
						<span class="live active" v-if="broadcasting['.value'] == $route.params.campid">live</span>
					</span>
				</div>
				<div class="container-fluid">
					<div class="container entities">
						<h2 class="padding">Encounter Finished</h2>
						<b-row>
							<b-col v-if="playerSettings.loot == true" md="8">
								<Finished :encounter="encounter"/>
							</b-col>
							<b-col>
								<div>
									<Meters :entities="encounter.entities" />
								</div>
							</b-col>
						</b-row>
					</div>
				</div>
			</div>

			<!-- ROLL FOR INITIATIVE -->
			<div v-else-if="encounter.round == 0">
				<div class="top d-flex justify-content-between">
					<router-link :to="`/user/${$route.params.userid}`"><i class="fas fa-chevron-left"></i> Back</router-link>
					{{ campaign.name }}
					<span>
						<span class="live active" v-if="broadcasting['.value'] == $route.params.campid">live</span>
					</span>
				</div>
				<div class="container-fluid">
					<div class="container entities">
						<h2 class="padding">
							<span class="die spin" :style="{ backgroundImage: 'url(' + require('@/assets/_img/logo/logo-icon-no-shield-' + dieColor + '.svg') + ')' }"></span>
							Roll for initiative!
						</h2>
						<CampaignOverview :players="campaign.players" />	
					</div>
				</div>
			</div>

			<!-- ACTIVE ENCOUNTER -->
			<template v-else>
				<Turns 
					:encounter="encounter" 
					:current="_non_hidden_targets[0]"
					:entities_len="Object.keys(_turnCount).length"
					:turn="turn"
					:campPlayers="campaign.players"
				/>
				<div class="container-fluid">
					<div class="container entities">

						<!-- LAST ROLL -->
						<div v-if="encounter.lastRoll" class="lastRoll text-center">
							<i class="fas fa-dice-d20"></i> 

							<!-- To hit -->
							<span v-if="encounter.lastRoll.toHitTotal">
								To hit: 
								<span v-if="encounter.lastRoll.toHitTotal == 'Natural 1' || encounter.lastRoll.toHitTotal == 'Natural 20'"
									:class="{ 'red': encounter.lastRoll.toHitTotal == 'Natural 1', 'green': encounter.lastRoll.toHitTotal == 'Natural 20' }">
									{{ encounter.lastRoll.toHitTotal }}
								</span>
								<template v-else>
									<span v-if="encounter.lastRoll.hitMod">
										{{ encounter.lastRoll.toHit }} + {{ encounter.lastRoll.hitMod }} =
									</span>
									<span class="blue">{{ encounter.lastRoll.toHitTotal }}</span>
								</template>.
							</span>

							<!-- Open Roll -->
							<span v-if="encounter.lastRoll.damageTotal">
								Damage: 
								<span v-if="encounter.lastRoll.damageMod">
									{{ encounter.lastRoll.damage }} + {{ encounter.lastRoll.damageMod }} =
								</span>
								<span class="red">{{ encounter.lastRoll.damageTotal }}</span>.
							</span>
						</div>

						<b-row>
							<b-col>
								<Initiative 
									:encounter="encounter" 
									:targets="_non_hidden_targets"
									:allEntities="_turnCount"
									:turn="turn"
									:campPlayers="campaign.players"
								/>
							</b-col>
							<b-col md="3" v-if="playerSettings.meters === undefined">
								<Meters :entities="encounter.entities" />
							</b-col>
						</b-row>
					</div>
				</div>
			</template>
		</div>
	</template>
	<div class="track" v-else>
		<div class="top d-flex justify-content-between">
			<router-link :to="`/user/${$route.params.userid}`"><i class="fas fa-chevron-left"></i> Back</router-link>
			Not found
			<span>
			</span>
		</div>
		<div class="container-fluid">
			<div class="container entities">
				<h2>Perception check failed</h2>
				<p>It seems we rolled a little low, this campaign can't be found.<br/>
					It is possible the campaign is set to private.</p>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import _ from 'lodash'
	import { db } from '@/firebase'
	import { attributes } from '@/mixins/attributes.js'

	import Follow from '@/components/trackCampaign/Follow.vue'
	import Finished from '@/components/combat/Finished.vue'
	import Turns from '@/components/trackCampaign/Turns.vue'
	import Initiative from '@/components/trackCampaign/Initiative.vue'
	import Meters from '@/components/trackCampaign/Meters.vue'
	import CampaignOverview from '@/components/trackCampaign/CampaignOverview.vue'

	export default {
		name: 'app',
		mixins: [attributes],
		components: {
			Follow,
			Finished,
			Turns,
			Initiative,
			Meters,
			CampaignOverview,
		},
		metaInfo: {
			title: 'Harmless Key'
		},
		data() {
			return {
				user: this.$store.getters.getUser,
				userId: this.$route.params.userid,
				encounter: undefined,
				campaign: undefined,
				counter: 0,
				tier: undefined,
			}
		},
		firebase() {
			return {
				players: {
					source: db.ref(`players/${this.userId}`),
					asObject: true,
				},
				npcs: {
					source: db.ref(`npcs/${this.userId}`),
					asObject: true,
				},
				npcSettings: {
					source: db.ref(`settings/${this.userId}/track/npc`),
					asObject: true,
				},
				playerSettings: {
					source: db.ref(`settings/${this.userId}/track/player`),
					asObject: true,
				},
				broadcasting: {
					source: db.ref(`broadcast/${this.userId}/live`),
					asObject: true
				},
			}
		},
		beforeMount() {
			this.fetch_encounter()
		},
		computed: {
			//All entities, without hidden entities
			_turnCount() {
				return _.chain(this.encounter.entities)
				.filter(function(entity, key) {
					entity.key = key
					return entity.active && !entity.down && !entity.hidden;
				})
				.orderBy(function(entity) {
					return entity.name
				}, 'asc')
				.orderBy(function(entity){
					return parseInt(entity.initiative)
				} , 'desc')
				.value()
			},
			_allEntities: function() {
				return _.chain(this.encounter.entities)
				.filter(function(entity, key) {
					entity.key = key
					return entity.active && !entity.down;
				})
				.orderBy(function(entity) {
					return entity.name
				}, 'asc')
				.orderBy(function(entity){
					return parseInt(entity.initiative)
				} , 'desc')
				.value()
			},
			_targets: function() {
				let t = this.encounter.turn
				let turns = Object.keys(this._allEntities)
				let order = turns.slice(t).concat(turns.slice(0,t))
				return Array.from(order, i => this._allEntities[i])
			},
			_non_hidden: function() {
				return _.chain(this.encounter.entities)
				.filter(function(entity, key) {
					entity.key = key
					return entity.active && !entity.down && !entity.hidden;
				})
				.orderBy(function(entity) {
					return entity.name
				}, 'asc')
				.orderBy(function(entity){
					return parseInt(entity.initiative)
				} , 'desc')
				.value()
			},
			_hidden_count: function() {
				return _.filter(this.encounter.entities, function(entity, key) {
					entity.key = key
					return entity.active && !entity.down && entity.hidden;
				}).length
			},
			_non_hidden_targets: function() {
				let t = this.turn
				let turns = Object.keys(this._non_hidden)
				let order = turns.slice(t).concat(turns.slice(0,t))
				return Array.from(order, i => this._non_hidden[i])
			},
			turn() {	
				let t = this.encounter.turn
				let hidden = 0
				for (let i = 0; i <= t; i++) {
					if (this._allEntities[i].hidden) {
						hidden++;
					}
				}
				// If more hidden then turn it's still turn 0
				if (t - hidden < 0) {
					return 0
				}
				return t - hidden
			},
			//Random die color
			dieColor() {
				let number = Math.ceil(Math.random() * 6)

				switch(number) {
					case 1: return 'blue';
					case 2: return 'cyan';
					case 3: return 'green';
					case 4: return 'orange';
					case 5: return 'red';
					case 6: return 'yellow';
				}
			}
		},
		methods: {
			fetch_encounter() {
				var track = db.ref(`broadcast/${this.userId}`);
				track.on('value' , (snapshot) => {
					let campId = this.$route.params.campid

					if(snapshot.val()) {
						let encId = snapshot.val().encounter

						let encounter = db.ref(`encounters/${this.userId}/${campId}/${encId}`)

						encounter.on('value' , (snapshot) => {
							this.encounter = snapshot.val()
						});
					}
					//Get campaign for player curHP/tempHP/ACBonus
					let fetchCampaign = db.ref(`campaigns/${this.userId}/${campId}`);

					fetchCampaign.on('value' , (snapshot) => {				
						this.campaign = snapshot.val();
					});
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.track {
		height: calc(100vh - 50px);
		background-size: cover;
		background-position: center bottom;
		background-color: #191919;
		overflow-y: scroll;

		.top {
			background: rgba(38, 38, 38, .9);
			text-transform: uppercase;
			height: 65px;
			padding: 10px;
			font-size: 15px;
			line-height: 45px;
			display: grid;
			grid-template-columns: max-content auto min-content;
			grid-template-rows: auto;
			grid-gap: 0;
			grid-template-areas: 
			"back title live";

			.title {
				padding-left: 20px;
				text-align: center;
				white-space: nowrap; 
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.live {
				margin: 10px 0;
				height: 25px;
				line-height: 25px;
				padding: 0 10px;
			}
		}

		&::-webkit-scrollbar { 
			display: none; 
		}

		h2.padding {
			font-size:25px !important;
			line-height: 25px !important;
			text-align: center;
			padding-top: 20px;
			text-shadow: 0 0 8px #000;
			color: #fff;
		}

		.loader:before {
			width: 80px;
			height: 80px;
			margin-top: -85px;
			margin-left: -40px;
			border-width: 5px;
			animation-duration: 1.5s;
		}

		.container-fluid {
			background-color:rgba(0, 0, 0, 0.3);
			height: calc(100vh - 115px);
			overflow-y: scroll;
			padding-bottom: 110px;

			&::-webkit-scrollbar { 
				display: none; 
			}
			.lastRoll {
				background: rgba(0, 0, 0, .6);
				padding: 5px;
			}
		}
		.damage {
			max-width: 370px;
			padding: 20px;
			background: rgba(80, 80, 80, .5) !important;
		}
	}
	.no-broadcast {
		padding-bottom: 110px !important;
	}
	.die {
		display: inline-block;
		width: 55px; 
		height: 55px;
		background-size: 55px 55px;
		background-position: center;
		background-repeat: no-repeat;
		vertical-align: -18px;

		&.spin {
			margin-right: 10px;
			font-size: 40px;
			animation: spin 1.5s ease infinite;
		}
	}
	@keyframes spin {
		0%, 30% { transform: rotate(0deg); }
		70%, 100% { transform: rotate(360deg); }
	}
</style>