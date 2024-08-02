import { client, db } from '@/db/db'
import { users, businessTypes, businesses, shifts } from '@/db/schema'
import { randomUUID } from 'crypto'
import { hashPW } from '@/utils/authTools'

// Sample data
async function seedData() {
  try {
    // Insert Business Types
    const [farmType, constructionType] = await db
      .insert(businessTypes)
      .values([{ name: 'Farm' }, { name: 'Construction' }])
      .returning()

    // Insert Users
    const [admin, businessOwner, w3, w4, w9, w0] = await db
      .insert(users)
      .values([
        {
          email: 'admin@example.com',
          password: await hashPW('111'),
          phoneNumber: '111',
          fullName: 'Admin-111',
          role: 'admin',
          isPhoneNumberVerified: true,
        },
        {
          email: 'owner@example.com',
          password: await hashPW('222'),
          phoneNumber: '222',
          fullName: 'Bs-222 Owner',
          role: 'businessOwner',
          isPhoneNumberVerified: true,
        },
        {
          email: 'worker333@example.com',
          password: await hashPW('333'),
          phoneNumber: '333',
          fullName: 'Worker-3',
          role: 'worker',
        },
        {
          email: 'worker2@example.com',
          password: await hashPW('444'),
          phoneNumber: '444',
          fullName: 'Worker4',
          role: 'worker',
        },
        {
          email: 'worker9@example.com',
          password: await hashPW('999'),
          phoneNumber: '999',
          fullName: 'Worker-999',
          role: 'worker',
        },

        {
          email: 'worker0@example.com',
          password: await hashPW('pass'),
          phoneNumber: '000',
          fullName: 'Worker-000',
          role: 'worker',
          isPhoneNumberVerified: true,
        },
      ])
      .returning()

    // Insert Businesses
    const [farm, construction] = await db
      .insert(businesses)
      .values([
        {
          name: 'Green Farm',
          location: '123 Farm Lane',
          contactNumber: '1231231234',
          businessTypeId: farmType.id,
          ownerId: businessOwner.id,
        },
        {
          name: 'Build Co',
          location: '456 Construction Ave',
          contactNumber: '3213214321',
          businessTypeId: constructionType.id,
          ownerId: businessOwner.id,
        },
      ])
      .returning()

    // Insert Shifts
    await db
      .insert(shifts)
      .values([
        {
          employeeId: w3.id,
          businessId: farm.id,
          date: 'Thu Jul 25 2024',
          startTime: '20:54:43',
          endTime: null,
          gpsShiftLocation: '123.456,-78.910',
        },
        {
          employeeId: w4.id,
          businessId: farm.id,
          date: 'Thu Jul 25 2024',
          startTime: '20:54:43',
          endTime: null,
          gpsShiftLocation: '123.456,-78.910',
        },
        {
          employeeId: w0.id,
          businessId: construction.id,
          date: 'Wed Nov 25 2024',
          startTime: '09:00:00',
          endTime: '17:00:00',
          gpsShiftLocation: '123.456,-78.910',
        },
        {
          employeeId: w9.id,
          businessId: construction.id,
          date: 'Wed Nov 25 2024',
          startTime: '09:00:00',
          endTime: '17:00:00',
          gpsShiftLocation: '123.456,-78.910',
        },
      ])
      .returning()
  } catch (err) {
    console.error('Error dropping tables:', err)
  }
}

// Execute the seed function
seedData()
  .then(() => {
    console.log('Seed data inserted successfully.')
  })
  .catch((error) => {
    console.error('Error inserting seed data:', error)
  })
  .finally(() => {
    client.end()
    console.log('db-client ended connection')
  })
