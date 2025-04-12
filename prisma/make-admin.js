// This script updates the role of a user to ADMIN
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = "yahyasoltany@gmail.com";
  const adminPassword = "Tal@n0ur2024#Admin";
  
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    // Hash the password
    const hashedPassword = await hash(adminPassword, 10);

    // Update user role to ADMIN and update password
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
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 