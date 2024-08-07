// // Uncomment if needed to seed - priortized test-deploy over fixing this
// import { client, db } from '@/db/db'
// import { users, businessTypes, businesses, shifts } from '@/db/schema'
// import { hashPW } from '@/auth/authTools'

// // Sample data
// async function seedData() {
//   try {
//     // Insert Business Types
//     const [farmType, constructionType] = await db
//       .insert(businessTypes)
//       .values([{ name: 'Farm' }, { name: 'Construction' }])
//       .returning()

//     // Insert Users

//     const [admin, businessOwner, w3, w4, w9, w0] = await db
//       .insert(users)
//       .values([
//         {
//           email: 'admin@example.com',
//           password: await hashPW('111'),
//           phoneNumber: '111',
//           name: 'Admin-111',
//           role: 'admin',
//         },
//         {
//           email: 'owner@example.com',
//           password: await hashPW('222'),
//           phoneNumber: '222',
//           name: 'Bs-222 Owner',
//           role: 'businessOwner',
//         },
//         {
//           email: 'worker333@example.com',
//           password: await hashPW('333'),
//           phoneNumber: '333',
//           name: 'Worker-3',
//           role: 'worker',
//         },
//         {
//           email: 'worker2@example.com',
//           password: await hashPW('444'),
//           phoneNumber: '444',
//           name: 'Worker4',
//           role: 'worker',
//         },
//         {
//           email: 'worker9@example.com',
//           password: await hashPW('999'),
//           phoneNumber: '999',
//           name: 'Worker-999',
//           role: 'worker',
//         },
//         {
//           email: 'worker0@example.com',
//           password: await hashPW('pass'),
//           phoneNumber: '000',
//           name: 'Worker-000',
//           role: 'worker',
//         },
//       ])
//       .returning()

//     // Insert Businesses
//     const [farm, construction] = await db
//       .insert(businesses)
//       .values([
//         {
//           name: 'Green Farm',
//           location: '123 Farm Lane',
//           contactNumber: '1231231234',
//           businessTypeId: farmType.id,
//           ownerId: businessOwner.id,
//         },
//         {
//           name: 'Build Co',
//           location: '456 Construction Ave',
//           contactNumber: '3213214321',
//           businessTypeId: constructionType.id,
//           ownerId: businessOwner.id,
//         },
//       ])
//       .returning()

//     // Insert Shifts
//     await db
//       .insert(shifts)
//       .values([
//         {
//           employeeId: w3.id,
//           businessId: farm.id,
//           date: 'Thu Jul 25 2024',
//           startTime: '20:54:43',
//           endTime: null,
//           gpsShiftLocation: '123.456,-78.910',
//         },
//         {
//           employeeId: w4.id,
//           businessId: farm.id,
//           date: 'Thu Jul 25 2024',
//           startTime: '20:54:43',
//           endTime: null,
//           gpsShiftLocation: '123.456,-78.910',
//         },
//         {
//           employeeId: w0.id,
//           businessId: construction.id,
//           date: 'Wed Nov 25 2024',
//           startTime: '09:00:00',
//           endTime: '17:00:00',
//           gpsShiftLocation: '123.456,-78.910',
//         },
//         {
//           employeeId: w9.id,
//           businessId: construction.id,
//           date: 'Wed Nov 25 2024',
//           startTime: '09:00:00',
//           endTime: '17:00:00',
//           gpsShiftLocation: '123.456,-78.910',
//         },
//       ])
//       .returning()
//   } catch (err) {
//     console.error('Error dropping tables:', err)
//   }
// }

// // Execute the seed function
// seedData()
//   .then(() => {
//     console.log('Seed data inserted successfully.')
//   })
//   .catch((error) => {
//     console.error('Error inserting seed data:', error)
//   })
//   .finally(() => {
//     client.end()
//     console.log('db-client ended connection')
//   })
