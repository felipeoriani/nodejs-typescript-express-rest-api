import { PrismaClient, TaskStatus, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()
const taskStatus = [TaskStatus.done, TaskStatus.inProgress, TaskStatus.done, TaskStatus.archived]

async function getUser(username: string): Promise<User> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (user) return user

  return await prisma.user.create({
    data: {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: `${username}@email.com`,
      username,
      password: '12345',
      super: username === 'admin',
    },
  })
}

async function createTask(userId: string): Promise<void> {
  const title = faker.lorem.words(3)
  const description = faker.lorem.sentence()
  const status = taskStatus[Math.floor(Math.random() * taskStatus.length)]

  await prisma.task.create({
    data: {
      title,
      description,
      createdAt: new Date(),
      status,
      userId,
    },
  })
}

async function main() {
  const admin = await getUser('admin')
  const user = await getUser('user')

  const tasksPromises: Promise<void>[] = []
  for (let i = 0; i < 50; i++) {
    tasksPromises.push(createTask(i % 2 === 0 ? admin.id : user.id))
  }

  await Promise.all(tasksPromises)
}

main()
  .then(async () => {
    console.log('Seed executed successfully!')
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
