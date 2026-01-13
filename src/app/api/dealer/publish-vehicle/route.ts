import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type PublishVehicleArgs = {
  p_vehicle_id: string;
};

type PublishVehicleResult = {
  id: string;
  publish_status: 'draft' | 'published' | 'archived';
  updated_at: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServer();
    const body = await request.json();

    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    // Call the RPC
    const { data, error } = await supabase.rpc<
      PublishVehicleArgs,
      PublishVehicleResult
    >('publish_dealer_vehicle', {
      p_vehicle_id: vehicleId,
    });

    if (error) {
      console.error('Failed to publish vehicle:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to publish vehicle' },
        { status: 400 }
      );
    }

    return NextResponse.json({ vehicle: data });
  } catch (error) {
    console.error('Unexpected error publishing vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
