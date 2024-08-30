/* import { createConnection } from 'typeorm'
import * as faker from 'faker'
import { User } from 'src/modules/user/entities/user.entity'

async function seed () {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'db', // Utilisez le nom de service Docker pour la base de données
      port: 5432,
      username: 'caaliope',
      password: 'caaliope_dev*2024!',
      database: 'database_caaliope_dev',
      entities: [User]
    })

    const userRepository = connection.getRepository(User)

    for (let i = 0; i < 10; i++) {
      const user = userRepository.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password() // Assurez-vous que le mot de passe est hashé si nécessaire
      })

      await userRepository.save(user)
      console.log(`Utilisateur ${i + 1} créé.`)
    }

    await connection.close()
    console.log('Seeding terminé.')
  } catch (error) {
    console.error('Erreur lors du seeding :', error)
  }
}

seed()
 */
