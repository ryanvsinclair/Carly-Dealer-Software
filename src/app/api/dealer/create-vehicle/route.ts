import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type CreateVehicleArgs = {
  p_vin: string;
  p_year: number;
  p_make: string;
  p_model: string;
  p_trim: string | null;
  p_mileage: number;
  p_price: number;
  p_description: string | null;
  p_dealership_id: string;
};

type VehicleRow = {
  id: string;
  publish_status: string;
  sale_status: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServer();
    const body = await request.json();

    const {
      dealershipId,
      vin,
      year,
      make,
      model,
      trim,
      mileage,
      price,
      description,
    } = body;

    // Call the RPC
    const { data, error } = await supabase.rpc<
      CreateVehicleArgs,
      VehicleRow
    >("create_dealer_vehicle", {
      p_dealership_id: dealershipId,
      p_vin: vin,
      p_year: year,
      p_make: make,
      p_model: model,
      p_trim: trim || null,
      p_mileage: mileage,
      p_price: price,
      p_description: description,
    });

    if (error) {
      console.error("Failed to create vehicle:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create vehicle" },
        { status: 400 },
      );
    }

    return NextResponse.json({ vehicle: data });
  } catch (error) {
    console.error("Unexpected error creating vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
