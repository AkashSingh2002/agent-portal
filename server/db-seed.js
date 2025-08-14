const { initializeDatabase } = require('./database/init');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await initializeDatabase();
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📊 Sample data includes:');
    console.log('   • Test agent: test@brandmetrics.com / agent123');
    console.log('   • Sample payroll records for various time periods');
    console.log('   • Sample customer orders and projects');
    console.log('');
    console.log('🚀 You can now start the application with: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
