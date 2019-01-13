<template>
	<div id="hasSide">
		<Sidebar/>
		
		<div id="npcs" class="container" v-if="npc || $route.name == 'AddNPC'">
			
			<a class="tab" :class="{ active: !quick }" @click="setQuick(0)">Complete Build</a>
			<a class="tab" :class="{ active: quick }" @click="setQuick(1)">Quick Build</a>

			<b-card header="Copy Existing NPC" v-if="$route.name == 'AddNPC'">
				
				<div class="input-group mb-3">
					<input type="text" v-model="search" @change="searchNPC()" placeholder="Search NPC" class="form-control"/>
					<div class="input-group-append">
						<button class="btn"><i class="fas fa-search"></i></button>
					</div>
				</div>
				<ul class="entities">
					<p v-if="noResult" class="red">{{ noResult }}</p>
					<li v-for="npc in searchResults" class="d-flex justify-content-between">
						<div class="d-flex justify-content-left">
							<a @click="showSlide(npc)" class="mr-2" v-b-tooltip.hover title="Show Info">
								<i class="fas fa-info-circle"></i></a>
							{{ npc.name }}
						</div>
						<a class="" 
							v-b-tooltip.hover title="Copy NPC" 
							@click="copy(npc)">
							<i class="fas fa-copy"></i>
						</a>
					</li>
				</ul>
			</b-card>
			
			<b-card header="Basic Info">
				<b-row>
					<b-col>
						<b-form-input 
							v-b-tooltip.hover title="Name"
							type="text" 
							class="form-control mb-2" 
							:class="{'input': true, 'error': errors.has('name') }" 
							v-model="npc.name" 
							v-validate="'alpha_spaces|required'" 
							name="name" 
							placeholder="Name*"></b-form-input>
						<p class="validate red" v-if="errors.has('name')">{{ errors.first('name') }}</p>

						<b-form-input
							v-if="quick == false"
							v-b-tooltip.hover title="Size"
							type="text" 
							class="form-control mb-2" 
							v-model="npc.size" 
							name="size" 
							placeholder="Size"></b-form-input>

						<b-row v-if="quick == false">
							<b-col sm="6">
								<b-form-input
									v-b-tooltip.hover title="Type"
									type="text" 
									class="form-control mb-2" 
									v-model="npc.type" 
									name="type" 
									placeholder="Type"></b-form-input>
							</b-col>
							<b-col sm="6">
								<b-form-input
									v-b-tooltip.hover title="Subtype"
									type="text"
									class="form-control mb-2"
									v-model="npc.subtype" 
									name="subtype" 
									placeholder="Subtype"></b-form-input>
							</b-col>
						</b-row>

						<b-form-input 
							v-if="quick == false"
							v-b-tooltip.hover title="Alignment"
							type="text" 
							class="form-control mb-2" 
							v-model="npc.alignment" 
							name="alignment" 
							placeholder="Alignment"></b-form-input>

						<b-form-input 
							v-b-tooltip.hover title="Speed"
							type="text" 
							class="form-control mb-2" 
							v-model="npc.speed" 
							name="speed" 
							placeholder="Speed"></b-form-input>

						<b-form-input 
							v-if="quick == false"
							v-b-tooltip.hover title="Senses" 
							type="text" 
							class="form-control mb-2" 
							v-model="npc.senses" 
							name="senses" 
							placeholder="Senses"></b-form-input>

						<b-form-input
							v-if="quick == false"
							v-b-tooltip.hover title="Languages" 
							type="text" 
							class="form-control mb-2" 
							v-model="npc.languages" 
							name="Languages" 
							placeholder="Languages"></b-form-input>

						<b-form-input 
							v-b-tooltip.hover title="Challenge Rating" 
							type="text" 
							class="form-control mb-2" 
							v-model="npc.challenge_rating" 
							name="Challenge Rating" 
							placeholder="Challenge Rating"></b-form-input>

						<b-form-input 
							v-b-tooltip.hover title="Avatar"
							type="text" 
							class="form-control" 
							:class="{'input': true, 'error': errors.has('avatar') }" 
							v-model="npc.avatar" 
							v-validate="'url'" 
							name="avatar" 
							placeholder="Image URL"></b-form-input>
						<p class="validate red" v-if="errors.has('avatar')">{{ errors.first('avatar') }}</p>
					</b-col>

					<b-col sm="3" v-if="npc.avatar">
						<div class="img-container"><img :src="npc.avatar" /></div>
					</b-col>

				</b-row>
			</b-card>

			<b-card header="Health & Armor Class">
				<b-row>
					<b-col md="">
						<b-form-input 
							v-b-tooltip.hover title="Armor Class"
							type="number" 
							class="form-control" 
							:class="{'input': true, 'error': errors.has('ac') }" 
							v-model="npc.ac" 
							v-validate="'required'" 
							name="ac" 
							placeholder="Armor Class"></b-form-input>
						<p class="validate red" v-if="errors.has('ac')">{{ errors.first('ac') }}</p>
					</b-col>
					<b-col md="">
						<b-form-input 
							v-b-tooltip.hover title="Hit Points"
							type="number" 
							class="form-control" 
							:class="{'input': true, 'error': errors.has('Hit Points') }" 
							v-model="npc.maxHp" 
							v-validate="'required'" 
							name="Hit Points" 
							placeholder="Hit Points"></b-form-input>
						<p class="validate red" v-if="errors.has('Hit Points')">{{ errors.first('Hit Points') }}</p>
					</b-col>
					<b-col md="" v-if="quick == false">
						<b-form-input
							v-b-tooltip.hover title="Hit Dice"
							type="text" 
							class="form-control" 
							v-model="npc.hit_dice"  
							name="Hit Dice" 
							placeholder="Hit Dice"></b-form-input>
					</b-col>
				</b-row>
			</b-card>

			<b-row>
				<b-col>
					<b-card header="Ability Scores">
						<b-row class="mb-2" v-for="ability, index in abilities" :key="index">
							<b-col sm="2">
								<label :for="ability.ability">
									<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
										<path :d="ability.icon"></path>
									</svg>
									{{ ability.ability.substring(0,3).toUpperCase() }}
								</label>
							</b-col>
							<b-col sm="8">
								<b-form-input 
									:id="ability.ability" 
									type="number" 
									v-model="npc[ability.ability]" 
									:name="ability.ability" 
									:placeholder="ability.ability.substring(0,3).toUpperCase()"></b-form-input>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
				<b-col>
					<b-card header="Saving Throws" v-if="quick == false">
						<b-row class="mb-2" v-for="ability, index in abilities" :key="index">
							<b-col sm="2">
								<label :for="ability.ability+'_save'">{{ ability.ability.substring(0,3).toUpperCase() }}</label>
							</b-col>
							<b-col sm="8">
								<b-form-input 
									:id="ability.ability+'_save'" 
									type="number" 
									v-model="npc[ability.ability+'_save']" 
									:name="ability.ability" 
									:placeholder="ability.ability.substring(0,3).toUpperCase()"></b-form-input>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
			</b-row>

			<div class="card" v-if="quick == false">
				<div class="card-header">Skills</div>
					<div class="card-body">
						<b-row class="skills" v-for="skill, index in skills" :key="index">
								<b-col sm="2">
									<label class="text-capitalize">{{ skill }}</label>
								</b-col>
								<b-col sm="4">
									<input 
										type="number" 
										class="form-control mr-2 text-capitalize" 
										v-model="npc[skill]" 
										name="skill" 
										:placeholder="skill" />
								</b-col>
						</b-row>
					</div>
			</div>
			
			<b-card header="Resistances & Vulnerabilities" v-if="quick == false">
				<b-form-input type="text"
					v-b-tooltip.hover title="Damage Vulnerabilities" 
					class="form-control mb-2" 
					v-model="npc.damage_vulnerabilities" 
					name="damage_vulnerabilities" 
					placeholder="Damage Vulnerabilities"></b-form-input>
				<b-form-input 
					v-b-tooltip.hover title="Damage Resistances" 
					type="text" 
					class="form-control mb-2" 
					v-model="npc.damage_resistances" 
					name="damage_resistances" 
					placeholder="Damage Resistances"></b-form-input>
				<b-form-input 
					v-b-tooltip.hover title="Damage Immunities" 
					type="text" 
					class="form-control mb-2" 
					v-model="npc.damage_immunities" 
					name="damage_immunities" 
					placeholder="Damage Immunities"></b-form-input>
				<b-form-input 
					v-b-tooltip.hover title="Condition Immnunities" 
					type="text" 
					class="form-control mb-2" 
					v-model="npc.condition_immunities" 
					name="condition_immunities" 
					placeholder="Condition Immunities"></b-form-input>
			</b-card>

			<!-- ACTIONS / ABILITIES -->
			<div class="card" v-for="action, index in actions" :key="index" v-if="quick == false">
				<div class="card-header d-flex justify-content-between">
					{{ action.name }}
					<a 
					class="green" 
					v-b-tooltip.hover title="Add Skill" 
					@click="add(action.type)">
						<i class="fas fa-plus-circle"></i>
					</a>
				</div>
				<div class="card-body">
					<div v-for="ability, index in npc[action.type]" :key="index">
						<h2 class="d-flex justify-content-between">
							{{ index + 1 }}. {{ ability.name }}
							<a @click="remove(index, action.type)" 
								class="red"
								v-b-tooltip.hover title="Remove">
								<i class="fas fa-minus-circle"></i>
							</a>
						</h2>
						<b-row class="mb-2">
							<b-col sm="2">
								<label for="name">Name</label>
							</b-col>
							<b-col sm="10">
								<b-form-input
									id="name"
									type="text" 
									class="form-control" 
									v-model="ability.name" 
									name="name" 
									placeholder="Name"></b-form-input>
							</b-col>
						</b-row>
						<b-row>
							<b-col sm="2" class="mb-2">
								<label for="damage_dice">Damage Dice</label>
							</b-col>
							<b-col sm="10">
								<b-form-input
									id="damage_dice"
									type="text" 
									class="form-control" 
									v-model="ability.damage_dice" 
									name="damage_dice" 
									placeholder="Damage Dice"></b-form-input>
							</b-col>
							<b-col sm="2" class="mb-2">
								<label for="damage_bonus">Damage Bonus</label>
							</b-col>
							<b-col sm="10">
								<b-form-input
									id="damage_bonus"
									type="number" 
									class="form-control" 
									v-model="ability.damage_bonus" 
									name="damage_bonus" 
									placeholder="Damage Bonus"></b-form-input>
							</b-col>
						</b-row>
						<b-row class="mb-2">
							<b-col sm="2">
								<label for="attack_bonus">Attack Bonus</label>
							</b-col>
							<b-col sm="10">
								<b-form-input
									id="attack_bonus"
									type="number" 
									class="form-control" 
									v-model="ability.attack_bonus" 
									name="attack_bonus" 
									placeholder="Attack Bonus"></b-form-input>
							</b-col>
						</b-row>
						<b-row class="mb-2">
							<b-col sm="2">
								<label for="desc">Description</label>
							</b-col>
							<b-col sm="10">
								<b-form-textarea
									id="desc"
									class="form-control" 
									v-model="ability.desc" 
									rows="4"
									name="desc" 
									placeholder="Description"></b-form-textarea>
							</b-col>
						</b-row>
						<hr>
					</div>
				</div>
			</div>

			<div class="mt-2">
				<router-link to="/npcs" class="btn bg-gray mr-2">Cancel</router-link>
				<button v-if="$route.name == 'AddNPC'" class="btn" @click="addNpc()"><i class="fas fa-plus"></i> Add NPC</button>
				<button v-else class="btn" @click="editNpc()"><i class="fas fa-check"></i> Save</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Sidebar from '@/components/SidebarMyContent.vue'
	import { db } from '@/firebase'
	import axios from 'axios'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		name: 'Npcs',
		metaInfo: {
			title: 'NPC\'s'
		},
		components: {
			Sidebar,
		},
		data() {
			return {
				userId: this.$store.getters.getUser.uid,
				npcId: this.$route.params.id,
				quick: false,
				search: '',
				searchResults: [],
				noResult: '',
				npcs: [],
				npcSkills: [],
				skills: [
					'acrobatics',
					'animal Handling',
					'arcana',
					'athletics',
					'deception',
					'history',
					'insight',
					'intimidation',
					'investigation',
					'medicine',
					'nature',
					'perception',
					'performance',
					'persuasion',
					'religion',
					'sleight of Hand',
					'stealth',
					'survival',
				],
				actions: [
					{ type: 'special_abilities', name: 'Special Abilities' },
					{ type: 'actions', name: 'Actions' },
					{ type: 'legendary_actions', name: 'Legendary Actions' }
				],
			}
		},
		firebase() {
			return {
				abilities: db.ref('abilities'),
				npc: {
					source: db.ref(`npcs/${this.userId}/${this.npcId}`),
					asObject: true
				}
			}
		},
		mounted() {
			axios.get("http://www.dnd5eapi.co/api/monsters/")
			.then(response => {this.npcs = response.data.results})
		},
		methods: {
			...mapActions([
				'fetchEncounter',
				'fetchCampaign',
				'setSlide'
			]),
			searchNPC() {
				this.searchResults = []
				for (var i in this.npcs) {
					var m = this.npcs[i]
					if (m.name.toLowerCase().includes(this.search.toLowerCase())) {
						axios.get(m.url).then(response => {
							this.noResult = ''
							this.searchResults.push(response.data)
						})
					}
					if(this.searchResults == '') {
						this.noResult = 'No results for "' + this.search + '"';
					}
				}
			},
			showSlide(npc) {
				event.stopPropagation();
				this.setSlide({
					show: true,
					type: 'npc',
					npc: npc
				})
			},
			copy(npc) {
				this.npc = npc;
				this.npc.ac = npc.armor_class;
				this.npc.maxHp = npc.hit_points;
				
				//Delete unneeded
				delete this.npc.armor_class;
				delete this.npc.hit_points;
				delete this.npc.url;
				delete this.npc.index;
				delete this.npc._id;

				this.searchResults = [];
				this.search = '';
			},
			addNpc() {
				// THIS IS UGLY
				delete this.npc['.value']
				delete this.npc['.key']
				// UGLY ENDS HERE
				this.$validator.validateAll().then((result) => {
					if (result) {
						db.ref('npcs/' + this.userId).push(this.npc);
						this.$router.replace('/npcs')
					} else {
						//console.log('Not valid');
					}
				})
			},
			editNpc() {
				// THIS IS UGLY
				delete this.npc['.key']
				// UGLY ENDS HERE
				this.$validator.validateAll().then((result) => {
					if (result) {
						db.ref(`npcs/${this.userId}/${this.npcId}`).set(this.npc);
						this.$router.replace('/npcs')
					} else {
						//console.log('Not valid');
					}
				})
			},
			add(type) {
				if(type == 'actions') {
					if(this.npc.actions == undefined) {
						this.npc.actions = [];
					}
					this.npc.actions.push({
						name: 'New Action',
					});
				}
				else if(type == 'legendary_actions') {
					if(this.npc.legendary_actions == undefined) {
						this.npc.legendary_actions = [];
					}
					this.npc.legendary_actions.push({
						name: 'New Legendary Action',
					});
				}
				else if(type == 'special_abilities') {
					if(this.npc.special_abilities == undefined) {
						this.npc.special_abilities = [];
					}
					this.npc.special_abilities.push({
						name: 'New Special Ability',
					});
				}
				this.$forceUpdate(); //IMPORTANT
			},
			remove(index, type) {
				if(type == 'actions'){
					this.$delete(this.npc.actions, index);
				}
				else if(type == 'special_abilities'){
					this.$delete(this.npc.special_abilities, index);
				}
				else if(type == 'legendary_actions'){
					this.$delete(this.npc.legendary_actions, index);
				}
				this.$forceUpdate(); //IMPORTANT
			},
			setQuick(input) {
				if(input == 0) {
					this.quick = false
				}
				else {
					this.quick = true
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.container {
	padding:20px;

	ul{
		padding: 0;
	}
	a.tab {
		display: inline-block;
		padding: 10px;
		margin-bottom: 1px;

		&.active {
			background-color: #262626;
			color: #b2b2b2 !important;
		}
	}
	.img-container, img {
		width: 100%;
	}
	label {
		line-height: 37px;
		margin-bottom: 0;

		svg {
			fill: #b2b2b2;
			width: 20px;
			height: 20px;
		}
	}
	.skills {
		line-height: 40px;
	}
}



</style>