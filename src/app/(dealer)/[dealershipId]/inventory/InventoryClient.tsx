'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { CreateVehicleModal } from './CreateVehicleModal';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number | null;
  publish_status: string;
  sale_status: string;
  updated_at: string;
}

interface InventoryClientProps {
  dealershipId: string;
  initialInventory: Vehicle[];
  canPublish: boolean;
}

export function InventoryClient({
  dealershipId,
  initialInventory,
  canPublish,
}: InventoryClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishingVehicleId, setPublishingVehicleId] = useState<string | null>(null);

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const handlePublish = useCallback(async (vehicleId: string) => {
    setPublishingVehicleId(vehicleId);

    try {
      const response = await fetch('/api/dealer/publish-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish vehicle');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to publish vehicle:', error);
      alert(error instanceof Error ? error.message : 'Failed to publish vehicle');
    } finally {
      setPublishingVehicleId(null);
    }
  }, [router]);

  return (
    <>
      <div className="p-6 lg:p-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-bold leading-tight tracking-tight">
              Inventory
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              Manage your dealership's vehicle inventory
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Vehicle
          </Button>
        </div>

        {initialInventory.length === 0 ? (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="text-sm font-light text-muted-foreground">
              No vehicles in inventory yet. Click "Create Vehicle" to get
              started.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Vehicle</TableHead>
                  <TableHead className="font-bold">Year</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Publish Status</TableHead>
                  <TableHead className="font-bold">Sale Status</TableHead>
                  <TableHead className="font-bold">Updated</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialInventory.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-light">
                      {vehicle.make} {vehicle.model}
                      {vehicle.trim && (
                        <span className="text-muted-foreground ml-1">
                          {vehicle.trim}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-light">{vehicle.year}</TableCell>
                    <TableCell className="font-light">
                      {vehicle.price ? `$${vehicle.price.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.publish_status === 'published'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {vehicle.publish_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.sale_status === 'available'
                            ? 'default'
                            : vehicle.sale_status === 'sold'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {vehicle.sale_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-light text-muted-foreground">
                      {new Date(vehicle.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {canPublish &&
                        vehicle.publish_status === 'draft' &&
                        vehicle.sale_status !== 'sold' && (
                          <Button
                            size="sm"
                            onClick={() => handlePublish(vehicle.id)}
                            disabled={publishingVehicleId === vehicle.id}
                          >
                            {publishingVehicleId === vehicle.id && (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            )}
                            Publish
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateVehicleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        dealershipId={dealershipId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
