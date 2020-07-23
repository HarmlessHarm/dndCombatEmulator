export const weapons = {
	data() {
		return {
			weaponList: [{
				category: "Simple melee weapons",
				weapons: [
					{ 
						value: "simple_melee", 
						label: "All simple melee"
					},
					{ 
						value: "club", 
						label: "Club",
						damage: "1d4",
						damage_type: "bludgeoning",
						light: true
					},
					{ 
						value: "dagger", 
						label: "Dagger",
						damage: "1d4",
						damage_type: "piercing",
						light: true,
						finesse: true,
						thrown: "20/60" 
					},
					{ 
						value: "greatclub",
						label: "Greatclub",
						damage: "1d8",
						damage_type: "bludgeoning",
						two_handed: true
					},
					{ 
						value: "handaxe", 
						label: "Handaxe",
						damage: "1d6",
						damage_type: "slashing",
						light: true,
						thrown: "20/60"
					},
					{ 
						value: "javelin", 
						label: "Javelin",
						damage: "1d6",
						damage_type: "piercing",
						thrown: "30/120"
					},
					{ 
						value: "light_hammer", 
						label: "Light Hammer",
						damage: "1d4",
						damage_type: "bludgeoning",
						light: true,
						thrown: "20/60"
					},
					{ 
						value: "mace", 
						label: "Mace",
						damage: "1d6",
						damage_type: "bludgeoning"
					},
					{ 
						value: "quarterstaff", 
						label: "Quarterstaff",
						damage: "1d6",
						damage_type: "bludgeoning",
						versatile: "1d8"
					},
					{ 
						value: "sickle", 
						label: "Sickle",
						damage: "1d4",
						damage_type: "slashing",
						light: true
					},
					{ 
						value: "spear", 
						label: "Spear",
						damage: "1d6",
						damage_type: "piercing",
						thrown: "20/60",
						versatile: "1d8"
					}
				]},
				{
				category: "Simple ranged weapons",
				weapons: [
					{ value: 
						"simple_ranged", 
						label: "All simple ranged"
					},
					{ 
						value: "light_crossbow",
						label: "Light Crossbow",
						damage: "1d8",
						damage_type: "piercing",
						range: "80/320",
						ammunition: true,
						loading: true,
						two_handed: true
					},
					{ 
						value: "dart", 
						label: "Dart",
						damage: "1d4",
						damage_type: "piercing",
						thrown: "20/60",
						finesse: true
					},
					{ 
						value: "shortbow", 
						label: "Shortbow",
						damage: "1d6",
						damage_type: "piercing",
						range: "30/120",
						ammunition: true
					},
					{ 
						value: "sling", 
						label: "Sling",
						damage: "1d4",
						damage_type: "bludgeoning",
						range: "30/120",
						ammunition: true,
					}
				]},
				{
				category: "Martial melee weapons",
				weapons: [
					{ value: "martial_melee", label: "All martial melee" },
					{ 
						value: "battleaxe", 
						label: "Battleaxe",
						damage: "1d8",
						damage_type: "slashing",
						versatile: "1d10"
					},
					{ 
						value: "flail", 
						label: "Flail",
						damage: "1d8",
						damage_type: "bludgeoning"
					},
					{ 
						value: "glaive", 
						label: "Glaive",
						damage: "1d10",
						damage_type: "slashing",
						heavy: true,
						reach: true,
						two_handed: true
					},
					{ 
						value: "greataxe", 
						label: "Greataxe",
						damage: "1d12",
						damage_type: "slashing",
						heavy: true,
						two_handed: true
					},
					{ 
						value: "greatsword",
						label: "Greatsword",
						damage: "2d6",
						damage_type: "slashing",
						heavy: true,
						two_handed: true
					},
					{ 
						value: "halberd",
						label: "Halberd",
						damage: "1d10",
						damage_type: "slashing",
						heavy: true,
						reach: true,
						two_handed: true
					},
					{ 
						value: "lance", 
						label: "Lance",
						damage: "1d12",
						damage_type: "piercing",
						reach: true,
						special: true
					},
					{ 
						value: "longsword", 
						label: "Longsword",
						damage: "1d8",
						damage_type: "slashing",
						versatile: "1d10"
					},
					{ 
						value: "maul",
						label: "Maul",
						damage: "2d6",
						damage_type: "bludgeoning",
						heavy: true,
						two_handed: true
					},
					{ 
						value: "morningstar", 
						label: "Morningstar",
						damage: "1d8",
						damage_type: "piercing"
					},
					{ 
						value: "pike", 
						label: "Pike",
						damage: "1d10",
						damage_type: "piercing",
						heavy: true,
						reach: true,
						two_handed: true
					},
					{ 
						value: "rapier", 
						label: "Rapier",
						damage: "2d6",
						damage_type: "piercing",
						heavy: true,
						two_handed: true
					},
					{ 
						value: "scimtar",
						label: "Scimtar",
						damage: "1d6",
						damage_type: "slashing",
						finesse: true,
						light: true
					},
					{ 
						value: "shortsword", 
						label: "Shortsword",
						damage: "1d6",
						damage_type: "slashing",
						finesse: true,
						light: true
					},
					{ 
						value: "trident", 
						label: "Trident",
						damage: "1d6",
						damage_type: "piercing",
						thrown: "20/60",
						versatile: '1d8'
					},
					{ 
						value: "war_pick", 
						label: "War Pick",
						damage: "1d8",
						damage_type: "piercing",
					},
					{ 
						value: "warhammer",
						label: "Warhammer",
						damage: "1d8",
						damage_type: "bludgeoning",
						verstatile: "1d10"
					},
					{ 
						value: "Whip",
						label: "whip",
						damage: "1d4",
						damage_type: "slashing",
						finesse: true,
						reach: true
					}
				]},
				{
				category: "Martial ranged weapons",
				weapons: [
					{ value: "martial_ranged", label: "All martial ranged" },
					{ value: 
						"blowgun",
						label: "Blowgun",
						damage: "1",
						damage_type: "piercing",
						ammunition: true,
						loading: true,
						range: "25/100"
					},
					{ 
						value: "hand_crossbow", 
						label: "Hand Crossbow",
						damage: "1d6",
						damage_type: "piercing",
						ammunition: true,
						loading: true,
						light: true,
						range: "30/120"
					},
					{ 
						value: "heavy_crossbow", 
						label: "Heave Crossbow",
						damage: "1",
						damage_type: "piercing",
						ammunition: true,
						loading: true,
						heavy: true,
						range: "100/400",
						two_handed: true
					},
					{ 
						value: "longbow", 
						label: "Longbow",
						damage: "1",
						damage_type: "piercing",
						ammunition: true,
						heavy: true,
						range: "150/600",
						two_handed: true
					},
					{ 
						value: "net", 
						label: "Net",
						special: true,
						thrown: "5/15"
					}
				]
			}],
		}
	}
}
