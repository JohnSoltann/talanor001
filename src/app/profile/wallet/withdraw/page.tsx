'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallet/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'WITHDRAWAL',
          amount: parseInt(amount),
          description: 'برداشت وجه از کیف پول',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process withdrawal');
      }

      toast.success('درخواست برداشت با موفقیت ثبت شد');
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
          <CardTitle>برداشت از کیف پول</CardTitle>
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
                onClick={handleWithdraw}
                disabled={!amount || loading}
              >
                {loading ? 'در حال پردازش...' : 'تایید و برداشت'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 