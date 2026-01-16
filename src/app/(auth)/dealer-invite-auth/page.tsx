import { Card } from '@/components/ui/card';
import DealerInviteAuthForm from './DealerInviteAuthForm';

export default function DealerInviteAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
        <DealerInviteAuthForm />
      </Card>
    </div>
  );
}
