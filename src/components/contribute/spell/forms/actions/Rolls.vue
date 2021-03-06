<template>
	<!-- Rolls -->
	<div>
		<div class="hk-card mt-3 rolls">
			<div class="card-header d-flex justify-content-between">
				<span><i class="fas fa-dice-d20"/> Rolls</span>
				<a 
					class="gray-light text-capitalize" 
					@click="newRoll()"
				>
					<i class="fas fa-plus green"></i>
					<span class="d-none d-md-inline ml-1">Add</span>
					<q-tooltip anchor="top middle" self="center middle">
						Add roll
					</q-tooltip>
				</a>
			</div>
		</div>

		<!-- ROLLS TABLE -->
		<hk-table 
			v-if="rolls"
			:items="rolls"
			:columns="rollColumns"
			:showHeader="false"
		>
			<template slot="roll" slot-scope="data">
				{{data.row.projectile_count ? `${data.row.projectile_count}x`: ""}}
				{{data.row.dice_count}}{{data.row.dice_type ? "d" : ""}}{{data.row.dice_type}}{{data.row.fixed_val ? "+" : ""}}{{data.row.fixed_val}} 
			</template>

			<span slot="type" slot-scope="data">
				<span v-if="action_type === 'healing'" class="healing">
					<i class="fas fa-heart" /> Healing
				</span>
				<template v-else>
					<span :class="data.row.damage_type">
						<i :class="damage_type_icons[data.row.damage_type]" /> 
						{{ data.row.damage_type.capitalize() }} 
					</span> damage
				</template>
			</span>

			<template slot="fail" slot-scope="data" v-if="action_type !== 'healing'">
				{{ 
					action_type === "save" 
					? `Save: ${application[data.row.save_fail_mod]}` 
					: `Miss: ${application[data.row.miss_mod]}`
				}}
			</template>

			<!-- ACTIONS -->
			<div slot="actions" slot-scope="data" class="actions">
				<a class="ml-2" @click="editRoll(data.index)">
					<i class="fas fa-pencil-alt"></i>
					<q-tooltip anchor="top middle" self="center middle">
						Edit
					</q-tooltip>
				</a>
				<a class="ml-2" @click="removeRoll(data.index)">
					<i class="fas fa-trash-alt"></i>
					<q-tooltip anchor="top middle" self="center middle">
						Delete
					</q-tooltip>
				</a>
			</div>
		</hk-table>

		<q-dialog square v-model="roll_dialog">
			<div v-if="roll">
				<q-form @submit="saveRoll()">
					<hk-card :header="(edit_index !== undefined) ? 'Edit roll' : 'New roll'" class="mb-0">
						<ActionRoll
							v-model="roll"
							:action_type="action_type"
							:spell="{
								level: level,
								scaling: level_scaling
							}"
							@input="$forceUpdate()"
						/>
						<div slot="footer" class="card-footer d-flex justify-content-end">
							<q-btn class="mr-1" type="cancel" @click="cancelRoll()">Cancel</q-btn>
							<q-btn color="primary" type="submit" :label="(edit_index !== undefined) ? 'Save' : 'Add'" />
						</div>
					</hk-card>
				</q-form>
			</div>
		</q-dialog>
	</div>
</template>

<script>
import { damage_types } from '@/mixins/damageTypes.js';
import ActionRoll from "@/components/ActionRoll"

export default {
	name: 'spell-action-rolls',
	mixins: [damage_types],
	components: {
		ActionRoll
	},
	props: {
		value: Array,
		level_scaling: String,
		level: Number,
		action_type: String,
	},
	computed: {
		rolls: {
			get() {
				return this.value;
			},
			set(newValue) {
				this.$emit("input", newValue);
				this.$forceUpdate();
			}
		}
	},

	data() {
		return {
			edit_index: undefined,
			roll_dialog: false,
			roll: undefined,
			rollColumns: {
				roll: {
					maxContent: true
				},
				type: {
					truncate: true
				},
				fail: {
					truncate: true
				},
				actions: {
					noPadding: true,
					maxContent: true
				}
			},
			application: {
				0: "No effect",
				0.5: "Half damage",
				1: "Full damage"
			},
		};
	},
	methods: {
		newRoll() {
			this.edit_index = undefined; // It's new, so no edit index
			this.roll = {
			}; // Create an empty new roll
			this.roll_dialog = true;
		},
		editRoll(index) {
			this.edit_index = index;
			this.roll = this.rolls[index];
			this.roll_dialog = true;
		},
		saveRoll() {
			if(this.edit_index === undefined) {
				let rolls = (!this.rolls) ? [] : this.rolls;
				rolls.push(this.roll);
				this.rolls = rolls;
			} else {
				this.$set(this.rolls, this.edit_index, this.roll);
			}
			this.roll = {};
			this.roll_dialog = false;
			this.$forceUpdate();
		},
		cancelRoll() {
			this.roll_dialog = false;
			this.edit_index = undefined;
			this.roll = undefined;
		},
		removeRoll(index) {
			this.$delete(this.rolls, index);
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss" scoped>
.hk-card {
		&.rolls {
			margin-bottom: 0;

			.card-header {
				padding: 12px 10px;
				margin-bottom: 1px;
			}
		}
	}
</style>
