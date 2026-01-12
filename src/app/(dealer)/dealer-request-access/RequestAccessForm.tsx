'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';

interface RequestAccessFormProps {
  userId: string;
  initialEmail: string;
}

export default function RequestAccessForm({ userId, initialEmail }: RequestAccessFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestDetails, setRequestDetails] = useState<{
    dealership_name: string;
    status: string;
    created_at: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createSupabaseBrowser();

    const email = formData.get('email') as string;
    const dealership_code = formData.get('dealership_code') as string;
    const dealership_name = formData.get('dealership_name') as string;
    const requested_role = formData.get('requested_role') as string;
    const message = formData.get('message') as string;

    if (!dealership_code && !dealership_name) {
      setError('Please provide either a dealership code or a dealership name.');
      setIsSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('dealer_access_requests')
      .insert({
        user_id: userId,
        email,
        dealership_code,
        dealership_name,
        requested_role,
        message,
      })
      .select('dealership_name, status, created_at')
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message || 'Failed to submit request. Please try again.');
      return;
    }

    setRequestDetails(data);
    setIsSuccess(true);
  }

  if (isSuccess && requestDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 py-12">
        <div className="w-full max-w-2xl">
          <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717] text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-[#3B82F6]" />
            </div>
            <h2 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-3">
              Request Submitted
            </h2>
            <p className="text-[14px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60 mb-8">
              Your access request has been submitted successfully. You will be notified once it has been reviewed.
            </p>
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] p-6 rounded border border-[#E5E5E5] dark:border-[#262626] text-left">
              <div className="space-y-3">
                <div>
                  <span className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                    Dealership
                  </span>
                  <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] mt-1">
                    {requestDetails.dealership_name || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                    Status
                  </span>
                  <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] mt-1 capitalize">
                    {requestDetails.status}
                  </p>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#171717]/60 dark:text-[#FAFAFA]/60 uppercase tracking-wider">
                    Submitted
                  </span>
                  <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] mt-1">
                    {new Date(requestDetails.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-3">
            Request Dealer Access
          </h1>
          <p className="text-[14px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60">
            Submit your information to request access to a dealership
          </p>
        </div>

        <Card className="p-8 border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#171717]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[14px] font-bold text-[#171717] dark:text-[#FAFAFA]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={initialEmail}
                placeholder="your.email@example.com"
                className="border-[#E5E5E5] dark:border-[#262626] focus:border-[#3B82F6] dark:focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealership_code" className="text-[14px] font-bold text-[#171717] dark:text-[#FAFAFA]">
                Dealership Code
              </Label>
              <Input
                id="dealership_code"
                name="dealership_code"
                type="text"
                placeholder="e.g., ABC123"
                className="border-[#E5E5E5] dark:border-[#262626] focus:border-[#3B82F6] dark:focus:border-[#3B82F6]"
              />
              <p className="text-[12px] font-light text-[#171717]/60 dark:text-[#FAFAFA]/60">
                Optional: Your dealership's internal code or identifier
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealership_name" className="text-[14px] font-bold text-[#171717] dark:text-[#FAFAFA]">
                Dealership Name
              </Label>
              <Input
                id="dealership_name"
                name="dealership_name"
                type="text"
                placeholder="e.g., Carly Auto Group"
                className="border-[#E5E5E5] dark:border-[#262626] focus:border-[#3B82F6] dark:focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requested_role" className="text-[14px] font-bold text-[#171717] dark:text-[#FAFAFA]">
                Requested Role
              </Label>
              <Select name="requested_role">
                <SelectTrigger className="border-[#E5E5E5] dark:border-[#262626] focus:border-[#3B82F6] dark:focus:border-[#3B82F6]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Manager">General Manager</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                  <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                  <SelectItem value="Service Manager">Service Manager</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[14px] font-bold text-[#171717] dark:text-[#FAFAFA]">
                Additional Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Provide any additional context or information..."
                rows={4}
                className="border-[#E5E5E5] dark:border-[#262626] focus:border-[#3B82F6] dark:focus:border-[#3B82F6]"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded">
                <p className="text-[14px] font-light text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
