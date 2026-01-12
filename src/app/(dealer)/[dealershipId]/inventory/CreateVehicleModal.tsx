'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface DecodedVehicle {
  year: number;
  make: string;
  model: string;
  trim: string;
}

interface CreateVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealershipId: string;
  onSuccess: () => void;
}

export function CreateVehicleModal({
  open,
  onOpenChange,
  dealershipId,
  onSuccess,
}: CreateVehicleModalProps) {
  const [vin, setVin] = useState('');
  const [decodedVehicle, setDecodedVehicle] = useState<DecodedVehicle | null>(
    null
  );
  const [isDecoding, setIsDecoding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecodeVin = async () => {
    if (!vin || vin.length !== 17) {
      setError('VIN must be exactly 17 characters');
      return;
    }

    setIsDecoding(true);
    setError(null);
    setDecodedVehicle(null);

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`
      );
      const data = await response.json();

      if (!data.Results || data.Results.length === 0) {
        setError('Invalid VIN or unable to decode');
        return;
      }

      const result = data.Results[0];

      if (!result.Make || !result.Model || !result.ModelYear) {
        setError('VIN decoded but missing required vehicle information');
        return;
      }

      setDecodedVehicle({
        year: parseInt(result.ModelYear),
        make: result.Make,
        model: result.Model,
        trim: result.Trim || '',
      });
    } catch (err) {
      setError('Failed to decode VIN. Please try again.');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!decodedVehicle) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/dealer/create-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealershipId,
          vin,
          year: decodedVehicle.year,
          make: decodedVehicle.make,
          model: decodedVehicle.model,
          trim: decodedVehicle.trim,
          mileage: null,
          price: null,
          description: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vehicle');
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create vehicle'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setVin('');
    setDecodedVehicle(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Create Vehicle</DialogTitle>
          <DialogDescription className="font-light">
            Enter the VIN to decode vehicle information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="font-light">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="vin" className="font-bold">
              VIN
            </Label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-light"
              disabled={isDecoding || isCreating}
            />
          </div>

          {!decodedVehicle && (
            <Button
              onClick={handleDecodeVin}
              disabled={isDecoding || vin.length !== 17}
              className="w-full"
            >
              {isDecoding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Decode VIN
            </Button>
          )}

          {decodedVehicle && (
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-light text-muted-foreground">Year</span>
                <span className="font-bold">{decodedVehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light text-muted-foreground">Make</span>
                <span className="font-bold">{decodedVehicle.make}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light text-muted-foreground">Model</span>
                <span className="font-bold">{decodedVehicle.model}</span>
              </div>
              {decodedVehicle.trim && (
                <div className="flex justify-between">
                  <span className="font-light text-muted-foreground">Trim</span>
                  <span className="font-bold">{decodedVehicle.trim}</span>
                </div>
              )}
            </div>
          )}

          {decodedVehicle && (
            <Button
              onClick={handleCreateDraft}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Draft Vehicle
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
