import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean existing data
  await prisma.price.deleteMany()
  await prisma.mandi.deleteMany()
  await prisma.crop.deleteMany()
  await prisma.cropCategory.deleteMany()
  await prisma.district.deleteMany()
  await prisma.state.deleteMany()

  const statesData = [
    {
      name: 'Maharashtra',
      code: 'MH',
      districts: ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad'],
    },
    {
      name: 'Delhi',
      code: 'DL',
      districts: ['North Delhi', 'South Delhi', 'East Delhi'],
    },
    {
      name: 'Punjab',
      code: 'PB',
      districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    },
    {
      name: 'Haryana',
      code: 'HR',
      districts: ['Karnal', 'Panipat', 'Rohtak', 'Hisar'],
    },
    {
      name: 'Uttar Pradesh',
      code: 'UP',
      districts: ['Agra', 'Kanpur', 'Lucknow', 'Varanasi', 'Meerut'],
    },
    {
      name: 'Gujarat',
      code: 'GJ',
      districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    },
    {
      name: 'Madhya Pradesh',
      code: 'MP',
      districts: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'],
    },
    {
      name: 'Karnataka',
      code: 'KA',
      districts: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru'],
    },
    {
      name: 'Tamil Nadu',
      code: 'TN',
      districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    },
    {
      name: 'Andhra Pradesh',
      code: 'AP',
      districts: ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    },
  ]

  const createdStates = []
  for (const s of statesData) {
    const state = await prisma.state.create({
      data: {
        name: s.name,
        code: s.code,
        districts: {
          create: s.districts.map((d) => ({ name: d })),
        },
      },
      include: { districts: true },
    })
    createdStates.push(state)
  }

  // Categories
  const categories = [
    'Cereals',
    'Vegetables',
    'Fruits',
    'Pulses',
    'Oilseeds',
    'Spices',
    'Fibers',
  ]
  const createdCats = []
  for (const c of categories) {
    const cat = await prisma.cropCategory.create({ data: { name: c } })
    createdCats.push(cat)
  }

  // 50 Crops
  const cropNames = [
    { name: 'Wheat', cat: 'Cereals', msp: 2125 },
    { name: 'Rice', cat: 'Cereals', msp: 2040 },
    { name: 'Maize', cat: 'Cereals', msp: 1962 },
    { name: 'Bajra', cat: 'Cereals', msp: 2350 },
    { name: 'Jowar', cat: 'Cereals', msp: 2970 },
    { name: 'Ragi', cat: 'Cereals', msp: 3578 },
    { name: 'Barley', cat: 'Cereals', msp: 1735 },
    { name: 'Oats', cat: 'Cereals', msp: 1600 },

    { name: 'Tomato', cat: 'Vegetables', msp: null },
    { name: 'Onion', cat: 'Vegetables', msp: null },
    { name: 'Potato', cat: 'Vegetables', msp: null },
    { name: 'Cabbage', cat: 'Vegetables', msp: null },
    { name: 'Cauliflower', cat: 'Vegetables', msp: null },
    { name: 'Brinjal', cat: 'Vegetables', msp: null },
    { name: 'Capsicum', cat: 'Vegetables', msp: null },
    { name: 'Carrot', cat: 'Vegetables', msp: null },
    { name: 'Radish', cat: 'Vegetables', msp: null },
    { name: 'Spinach', cat: 'Vegetables', msp: null },
    { name: 'Lady Finger', cat: 'Vegetables', msp: null },
    { name: 'Pumpkin', cat: 'Vegetables', msp: null },
    { name: 'Garlic', cat: 'Vegetables', msp: null },

    { name: 'Apple', cat: 'Fruits', msp: null },
    { name: 'Banana', cat: 'Fruits', msp: null },
    { name: 'Mango', cat: 'Fruits', msp: null },
    { name: 'Orange', cat: 'Fruits', msp: null },
    { name: 'Grapes', cat: 'Fruits', msp: null },
    { name: 'Papaya', cat: 'Fruits', msp: null },
    { name: 'Pomegranate', cat: 'Fruits', msp: null },
    { name: 'Guava', cat: 'Fruits', msp: null },
    { name: 'Pineapple', cat: 'Fruits', msp: null },

    { name: 'Gram', cat: 'Pulses', msp: 5335 },
    { name: 'Tur', cat: 'Pulses', msp: 6600 },
    { name: 'Urad', cat: 'Pulses', msp: 6600 },
    { name: 'Moong', cat: 'Pulses', msp: 7755 },
    { name: 'Masur', cat: 'Pulses', msp: 6000 },

    { name: 'Groundnut', cat: 'Oilseeds', msp: 5850 },
    { name: 'Soybean', cat: 'Oilseeds', msp: 4300 },
    { name: 'Mustard', cat: 'Oilseeds', msp: 5450 },
    { name: 'Sunflower', cat: 'Oilseeds', msp: 6400 },
    { name: 'Sesame', cat: 'Oilseeds', msp: 7830 },
    { name: 'Nigerseed', cat: 'Oilseeds', msp: 7287 },

    { name: 'Turmeric', cat: 'Spices', msp: null },
    { name: 'Chilli', cat: 'Spices', msp: null },
    { name: 'Coriander', cat: 'Spices', msp: null },
    { name: 'Cumin', cat: 'Spices', msp: null },
    { name: 'Black Pepper', cat: 'Spices', msp: null },
    { name: 'Cardamom', cat: 'Spices', msp: null },

    { name: 'Cotton', cat: 'Fibers', msp: 6080 },
    { name: 'Jute', cat: 'Fibers', msp: 4750 },
    { name: 'Silk', cat: 'Fibers', msp: null },
  ]

  const createdCrops = []
  for (const c of cropNames) {
    const catId = createdCats.find((cat) => cat.name === c.cat).id
    const crop = await prisma.crop.create({
      data: {
        name: c.name,
        categoryId: catId,
        mspPrice: c.msp,
        unit: 'Quintal',
      },
    })
    createdCrops.push(crop)
  }

  // 30 Mandis
  const createdMandis = []
  for (let i = 0; i < 35; i++) {
    const state = createdStates[i % createdStates.length]
    const district = state.districts[i % state.districts.length]
    const mandi = await prisma.mandi.create({
      data: {
        name: `APMC ${district.name} ${i}`,
        city: district.name,
        stateId: state.id,
        districtId: district.id,
        latitude: 20.0 + Math.random() * 10,
        longitude: 70.0 + Math.random() * 10,
      },
    })
    createdMandis.push(mandi)
  }

  // 120 Prices
  const today = new Date()
  const pricesToCreate = []
  for (let i = 0; i < 150; i++) {
    const mandi =
      createdMandis[Math.floor(Math.random() * createdMandis.length)]
    const crop = createdCrops[Math.floor(Math.random() * createdCrops.length)]
    const date = new Date(today)
    date.setDate(date.getDate() - Math.floor(Math.random() * 10))

    const basePrice = crop.mspPrice || Math.random() * 5000 + 1000
    const modalPrice = basePrice + (Math.random() * 500 - 250)

    // Check if unique constraint is violated in generation, usually random enough but let's be careful
    pricesToCreate.push({
      mandiId: mandi.id,
      cropId: crop.id,
      date: date,
      modalPrice: Math.round(modalPrice),
      minPrice: Math.round(modalPrice * 0.9),
      maxPrice: Math.round(modalPrice * 1.1),
      arrivalQuantity: Math.round(Math.random() * 1000),
    })
  }

  // Handle unique constraint (mandiId, cropId, date) by creating one by one and catching or filtering
  const uniqueMap = new Set()
  for (const p of pricesToCreate) {
    const key = `${p.mandiId}-${p.cropId}-${p.date.toISOString()}`
    if (!uniqueMap.has(key)) {
      uniqueMap.add(key)
      await prisma.price.create({ data: p })
    }
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
