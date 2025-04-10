'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallet/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'DEPOSIT',
          amount: parseInt(amount),
          description: 'واریز وجه به کیف پول',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process deposit');
      }

      toast.success('درخواست واریز با موفقیت ثبت شد');
      router.push('/profile/wallet');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'خطا در پردازش درخواست'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>افزایش موجودی کیف پول</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">مبلغ (تومان)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مبلغ مورد نظر را وارد کنید"
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => router.push('/profile/wallet')}
              >
                انصراف
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={!amount || loading}
              >
                {loading ? 'در حال پردازش...' : 'تایید و پرداخت'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 