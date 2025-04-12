// This script updates the role of a user to ADMIN
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = "artin42385@gmail.com";
  const adminPassword = "Tal@n0ur2024#Admin";
  
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`No user found with email: ${email}. Creating new admin user...`);
      
      // Hash the password
      const hashedPassword = await hash(adminPassword, 10);
      
      // Create a new admin user
      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'آرتین',
          password: hashedPassword,
          role: 'ADMIN',
          phone: '' // Required field, but empty for now
        }
      });
      
      console.log(`New admin user created with email ${email}`);
      console.log(newUser);
      return;
    }

    // Update existing user to admin role with new password
    const hashedPassword = await hash(adminPassword, 10);
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        role: 'ADMIN',
        password: hashedPassword
      }
    });

    console.log(`User with email ${email} has been updated to ADMIN role with new password`);
    console.log(updatedUser);
  } catch (error) {
    console.error('Error updating/creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 