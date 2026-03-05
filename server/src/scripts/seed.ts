import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // Create a mock user if not exists
  let user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Test Setup User',
        email: 'test@example.com',
        password: '$2b$10$YourHashedPasswordHereForTesting', // Only for dev seeding
      }
    });
    console.log(`Created test user: ${user.email}`);
  }

  // Define some mock jobs
  const jobsData = [
    {
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      location: 'Remote',
      salary: '₹18L - ₹25L',
      type: 'Full-time',
      platform: 'LinkedIn',
      description: 'We are looking for a highly skilled Senior React Developer...',
      requirements: ['React', 'TypeScript', 'Node.js'],
    },
    {
      title: 'Frontend Engineer (Vue.js)',
      company: 'InnovateHub',
      location: 'Bangalore, India',
      salary: '₹12L - ₹18L',
      type: 'Full-time',
      platform: 'Naukri',
      description: 'Join our team to build scalable frontend applications...',
      requirements: ['Vue.js', 'JavaScript', 'CSS'],
    },
    {
      title: 'Full Stack JavaScript Trainee',
      company: 'StartupX',
      location: 'Mumbai, India',
      type: 'Internship',
      platform: 'Internshala',
      description: 'Looking for eager learners to join our startup...',
      requirements: ['JavaScript', 'HTML/CSS', 'Enthusiasm'],
    }
  ];

  for (const job of jobsData) {
    const existingJob = await prisma.job.findFirst({
      where: { title: job.title, company: job.company }
    });

    if (!existingJob) {
      await prisma.job.create({ data: job });
    }
  }

  console.log('Jobs seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
