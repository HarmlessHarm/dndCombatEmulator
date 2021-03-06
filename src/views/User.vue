<template>
<div v-if="!loadingCampaigns">
	<div class="top d-flex justify-content-between" v-if="!$route.params.campid">
		<span><i class="fas fa-user"></i> {{ username['.value'] }}</span>
		<Follow v-if="user"/>
	</div>
	<div class="container-fluid" v-if="!$route.params.campid">
	
		<h2>Campaigns</h2>
		<!-- CAMPAIGNS -->
		<div v-if="campaigns" class="row q-col-gutter-md mt-3">
			<div class="col-12 col-md-6 col-lg-4" v-for="campaign in campaigns" :key="campaign['.key']">
				<hk-card :style="{ backgroundImage: 'url(\'' + campaign.background + '\')' }">
					<div slot="header" class="card-header">
						<span class="title">
							<i class="fas fa-dungeon"></i>
							{{ campaign.campaign }}
						</span>
						<span class="live active" v-if="live['.value'] == campaign['.key']">live</span>
					</div>
						
					<!-- SHOW PLAYERS -->
					<template v-if="campaign.players">
						<div class="players">
							<div 
								v-for="(player, key) in campaign.players" 
								:key="key"
								class="img"
							>
								<div v-if="player.avatar" :style="{ backgroundImage: 'url(\'' + player.avatar + '\')' }"></div>
								<img v-else src="@/assets/_img/styles/player.svg" />
								<q-tooltip anchor="top middle" self="center middle">
									{{ player.character_name }}
								</q-tooltip>
							</div>
						</div>

						<h2> {{ Object.keys(campaign.players).length }} players</h2>
					</template>
					<template v-else>

						<div class="no-players"></div>
						<h2>No players added yet</h2>
					</template>
					<div class="d-flex justify-content-center">
						<router-link :to="`/user/${dmId}/${campaign['.key']}`" class="btn">View Campaign</router-link>
					</div>

					<template slot="footer">
						<small class="text-center d-block py-1 bg-gray-active">
							<span class="gray-hover">Started:</span> {{ makeDate(campaign.timestamp) }}
						</small>
					</template>
				</hk-card>
			</div>
		</div>
		<div v-else>
			<p>This user has no public campaigns.</p>
		</div>
	</div>

	<trackCampaign v-else />

</div>
</template>

<script>
	import { db } from '@/firebase'
	import trackCampaign from '@/components/trackCampaign'
	import { general } from '@/mixins/general.js'

	import Follow from '@/components/trackCampaign/Follow.vue'

	export default {
		name: 'TrackUser',
		components: {
			trackCampaign,
			Follow
		},
		mixins: [general],
		metaInfo: {
			title: 'Harmless Key'
		},
		data() {
			return {
				user: this.$store.getters ? this.$store.getters.user : undefined,
				dmId: this.$route.params.userid,
				campaigns: undefined,
				loadingCampaigns: true
			}
		},
		firebase() {
			return {
				username: {
					source: db.ref(`users/${this.dmId}/username`),
					asObject: true,
				},
				live: {
					source: db.ref(`broadcast/${this.dmId}/live`),
					asObject: true,
				}
			}
		},
		mounted() {
			var campaigns = db.ref(`campaigns/${this.dmId}`).orderByChild('private').equalTo(null);
			campaigns.on('value', async (snapshot) => {
				let campaigns = snapshot.val();
				
				//Get Players
				for(let key in snapshot.val()) {
					campaigns[key]['.key'] = key;

					for(let playerKey in campaigns[key].players) {
						let getPlayer = db.ref(`players/${this.dmId}/${playerKey}`);
						await getPlayer.on('value', (snapshot) => {
							campaigns[key].players[playerKey] = snapshot.val()
						});
					}
				}
				this.campaigns = campaigns;
				this.loadingCampaigns = false;
			});
		}
	}
</script>

<style lang="scss" scoped>
.top {
	background: rgba(38, 38, 38, .9);
	text-transform: uppercase;
	height: 65px;
	padding: 10px;
	font-size: 15px;
	line-height: 45px;
}
	.container-fluid {

		&::-webkit-scrollbar { 
			display: none; 
		}
		padding: 30px;

		.hk-card {
			color: $gray-light !important;
			background-size: cover;
			background-position: center bottom;

			.card-header {
				// position: relative;
				background: rgba(38, 38, 38, .9);

				span.title {
					display: block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: calc(100% - 55px);
				}

				.live {
					position: absolute;
					top: 8px;
					right: 8px;
				}
			}
			.card-body {
				height: 200px;
				background: rgba(38, 38, 38, .5);

				h2 {
					text-align: center;
					margin-bottom: 30px;
				}
				.no-players {
					min-height: 65px;
				}
				.players {
					margin-bottom: 20px;
					display: flex;
					justify-content: center;
					flex-wrap: nowrap;

					.img {
						background:$black;
						height: 35px;
						width: 35px;
						border: solid 1px$white;
						margin: 0 10px 10px 0;
						box-sizing: border;

						div {
							width: 100%;
							height: 100%;
							background-size: cover;
							background-position: top center;
							display: block;
						}

						&:last-child {
							margin-right: 0;
						}
					}
				}
			}
			&:hover {
				text-decoration: none;
			}
		}
	}
</style>
