<template>
	<div class="container-fluid">
		<template v-if="!$route.params.id">
		<Crumble />
		<h1 class="mb-3 d-flex justify-content-between">
			<span>
				<i class="fab fa-patreon"></i> Patrons ( {{ Object.keys(patrons).length }} )
			</span>
			<router-link to="/admin/patrons/new" class="btn" ><i class="fas fa-plus"></i> New</router-link>
		</h1>

		<b-row>
			<b-col sm="8">
				<b-row>
					<b-col sm="8">
						<b-input-group class="mb-3">
							<input class="form-control" type="text" autocomplete="off" v-model="search" @keyup="searchCondition()" placeholder="Search patrons" />
							<b-input-group-append>
								<button class="btn" @click="searchCondition()"><i class="fas fa-search"></i></button>
							</b-input-group-append>
						</b-input-group>
					</b-col>
					<b-col class="text-right">
						<h2>{{ Object.keys(patrons).length }} patrons.</h2>
					</b-col>
				</b-row>

				<p v-if="noResult" class="red">{{ noResult }}</p>
				<p v-if="searching && !noResult" class="green">{{ Object.keys(searchResults).length }} patrons found</p>

				<div class="table-responsive">
					<b-table 
						:busy="isBusy"
						:items="searchResults" 
						:fields="fields"
						:per-page="15"
						:current-page="current"
					>	
						<template slot="index" slot-scope="data">
							{{ data.index + 1 }}
						</template>

						<!-- EMAIL -->
						<router-link :to="'/admin/patrons/' + data.item['.key']" slot="email" slot-scope="data">{{ data.value }}</router-link>

						<!-- TIER -->
						<span slot="tier_title" slot-scope="data">
							<span 
								:class="{
									'blue': data.value == 'Folk Hero',
									'purple': data.value == 'Noble',
									'orange': data.value == 'Deity'
								}">{{ data.value }}</span>
						</span>

						<!-- END DATE -->"
						<span slot="pledge_end" slot-scope="data">
							<span :class="{'red': data.value < new Date() }">
								{{ makeDate(data.value) }}
							</span>
						</span>

						<!-- STATUS -->
						<span slot="last_charge_status" slot-scope="data">
							<span :class="{'green': data.value == 'Paid', 'red': data.value == 'Declined' }">
								{{ data.value }}
							</span>
						</span>

						<!-- LOADER -->
						<div slot="table-busy" class="loader">
							<span>Loading patrons....</span>
						</div>
					</b-table>
				</div>
			
				<b-pagination v-if="!isBusy && Object.keys(searchResults).length > 15" align="center" :total-rows="Object.keys(searchResults).length" v-model="current" :per-page="15" />
			</b-col>
			<b-col>
				<Notifications />
			</b-col>
		</b-row>
		</template>

		<!-- SHOW Patron -->
		<template v-else>
			<Patron :id="$route.params.id" />
		</template>
	</div>
</template>

<script>
	import { db } from '@/firebase'
	import Crumble from '@/components/crumble/Compendium.vue'
	import Patron from '@/components/Admin/Patrons/Patron.vue'
	import Notifications from '@/components/Admin/Patrons/Notifications.vue'
	import { mapActions } from 'vuex'

	export default {
		name: 'Patrons',
		components: {
			Crumble,
			Patron,
			Notifications
		},
		metaInfo: {
			title: 'Admin | Patrons'
		},
		data() {
			return {
				id: this.$route.params.id,
				current: 1,
				fields: {
					'index': {
						label: '#'
					},
					'full_name': {
						label: 'Name',
						sortable: true
					},
					email: {
						label: 'Email',
						sortable: true
					},
					pledge_end: {
						label: 'End Date',
						sortable: true
					},
					last_charge_status: {
						label: 'Last Charge',
						sortable: true
					}
				},
				search: '',
				searching: '',
				searchResults: [],
				noResult: '',
				isBusy: true,
			}
		},
		firebase() {
			return {
				patrons: {
					source: db.ref('new_patrons').orderByChild('email'),
					readyCallback: () => this.isBusy = false
				},
			}
		},
		beforeMount() {
			this.searchResults = this.patrons
		},
		methods: {
			...mapActions([
				'setSlide'
			]),
			searchCondition() {
				this.current = 1;
				this.searchResults = []
				this.searching = true
				for (var i in this.patrons) {
					var u = this.patrons[i]
					if (u.email.toLowerCase().includes(this.search.toLowerCase()) && this.search != '') {
						this.noResult = ''
						this.searchResults.push(u)
					}
				}
				if(this.searchResults == '' && this.search != '') {
					this.noResult = 'No results for "' + this.search + '"';
				}
				if(this.search == '') {
					this.searchResults = this.patrons
					this.searching = false
				}
			},
			makeDate(input) {
				let monthNames = [
					"January", "February", "March",
					"April", "May", "June", "July",
					"August", "September", "October",
					"November", "December"
				];

				let d = new Date(input)

				let date = d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();

				return date
			}
		}
	}
</script>

<style lang="scss" scoped>
.container-fluid {
	padding: 20px;
}

</style>