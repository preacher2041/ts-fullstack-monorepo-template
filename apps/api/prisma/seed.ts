import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const userData = [
	{
		username: 'Joe.Bloggs',
		email: 'joe@bloggs.com',
		firstName: 'Joe',
		lastName: 'Bloggs',
		dob: '1982-03-24',
		password: '$2a$08$xhDa5NAiR./97.JMjLFenurk6zeab3cnlaI4LDGiksmdFATGiTsbG', // &l3tMe1N!
	  },
	  {
		username: 'Jane.Bloggs',
		email: 'jane@bloggs.com',
		firstName: 'Jane',
		lastName: 'Bloggs',
		dob: '1989-08-29',
		password: '$2a$08$xhDa5NAiR./97.JMjLFenurk6zeab3cnlaI4LDGiksmdFATGiTsbG', // &l3tMe1N!
	  }
]

const campaignData = [
	{
		name: 'Shadow of the Zhentarim',
		gm: {
			connect: {
				id: 1
			}
		}
	},
	{
		name: 'The Renaissance Rejects',
		gm: {
			connect: {
				id: 2
			}
		}
	},
]

const worldData = [
	{
		name: 'Ebrea',
		description: 'This is the description of Ebrea',
		history: 'This is the history of Ebrea',
		campaign: {
			connect: {
				id: 1
			}
		}
	},
	{
		name: 'Earth',
		description: 'This is the description of Earth',
		history: 'This is the history of Earth',
		campaign: {
			connect: {
				id: 2
			}
		}
	}
]

const npcData = [
	{
		name: 'Jewel of the Mountain',
		backstory: '',
		ideals: '',
		bonds: '',
		flaws: '',
		motivation: '',
		fear: '',
		location: {
			create: {
				name: 'The Great Plains',
				description: '',
				history: '',
				locationTypes: {
					create: {
						type: 'Area'
					}
				},
				world: {
					connect: {
						id: 1
					}
				}
			}
		},
		world: {
			connect: {
				id: 1
			}
		}
	},
	{
		name: 'Kya Rees',
		backstory: '',
		ideals: '',
		bonds: '',
		flaws: '',
		motivation: '',
		fear: '',
		location: {
			connect: {
				id: 1
			}
		},
		world: {
			connect: {
				id: 1
			}
		}
	},
	{
		name: 'Congolmerate Leader',
		backstory: '',
		ideals: '',
		bonds: '',
		flaws: '',
		motivation: '',
		fear: '',
		location: {
			create: {
				name: 'Silverlight',
				description: '',
				history: '',
				locationTypes: {
					create: {
						type: 'Town'
					}
				},
				world: {
					connect: {
						id: 2
					}
				}
			}
		},
		world: {
			connect: {
				id: 2
			}
		}
	},
]

const relationshipData = [
    {
		npcs: {
			connect: [
				{ id: 1 },
				{ id: 2 }
			]
		},
        relationshipType: {
            create: {
                name: 'Familial'
            }
        }
    }
]

const factionData = [
	{
		name: 'Tabaxi Caravan',
		history: '',
		world: {
			connect: {
				id: 1
			}
		},
		leader: {
            connect: {
                id: 1,
            }
        },
        location: {
            connect: {
                id: 1,
            }
        },
        notableMembers: {
            connect: [
                { id: 1 },
            ]
        },

	},
	{
		name: 'The Conglomerate',
		history: '',
		world: {
			connect: {
				id: 2
			}
		},
		leader: {
            connect: {
                id: 2,
            }
        },
	}
]

const pantheonData = [
	{
		name: 'Ursuper Deities',
		history: '',
		world: {
			connect: {
				id: 1
			}
		},
	}	
]

const deityData = [
	{
		name: 'The Raven Queen',
		history: '',
		pantheon: {
			connect: {
				id: 1
			}
		},
		alignment: {
			connect: {
				id: 1
			}
		},
		world: {
			connect: {
				id: 1
			}
		},

	}
]

const alignmentData = [
	{
		name: 'Neutral',
	}
]

async function main() {
	console.log('Start seeding...')
	for (const u of userData) {
		const user = await prisma.user.create({
			data: u,
		})
		console.log(`Created user with id: ${user.id}`)
	}

	for (const c of campaignData) {
		const campaign = await prisma.campaign.create({
			data: c,
		})
		console.log(`Created campaign with id: ${campaign.id}`)
	}

	for (const w of worldData) {
		const world = await prisma.world.create({
			data: w
		})
		console.log(`Created world with id: ${world.id}`)
	}

	for (const n of npcData) {
		const npc = await prisma.npc.create({
			data: n
		})
		console.log(`Created npcs with id: ${npc.id}`)
	}

	for (const r of relationshipData) {
		const relationship = await prisma.relationship.create({
			data: r
		})
		console.log(`Created relationship with id: ${relationship.id}`)
	}

	for (const f of factionData) {
		const faction = await prisma.faction.create({
			data: f
		})
		console.log(`Created faction with id: ${faction.id}`)
	}

	for (const p of pantheonData) {
		const pantheon = await prisma.pantheon.create({
			data: p
		})
		console.log(`Created pantheon with id: ${pantheon.id}`)
	}

	for (const a of alignmentData) {
		const alignment = await prisma.alignment.create({
			data: a
		})
		console.log(`Created alignment with id: ${alignment.id}`)
	}

	for (const d of deityData) {
		const deity = await prisma.deity.create({
			data: d
		})
		console.log(`Created deity with id: ${deity.id}`)
	}

	console.log('Seeding finished.')
}

main()
.then(async () => {
	await prisma.$disconnect()
})
.catch(async (e) => {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
})