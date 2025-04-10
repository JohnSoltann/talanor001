import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, amount, description } = await request.json();

    if (!type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the current wallet
      const wallet = await tx.wallet.findUnique({
        where: {
          userId: session.user.id,
        },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Check if there's enough balance for withdrawal
      if (type === 'WITHDRAWAL' && wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: {
          userId: session.user.id,
        },
        data: {
          balance: {
            increment: type === 'DEPOSIT' ? amount : -amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId: session.user.id,
          type,
          amount,
          status: 'PENDING',
          description: description || `${type === 'DEPOSIT' ? 'واریز' : 'برداشت'} وجه`,
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 