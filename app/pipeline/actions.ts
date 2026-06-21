"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateDealStage(dealId: string, stageId: string, isWon: boolean, isLost: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("deals")
    .update({
      stage_id: stageId,
      status: isWon ? "won" : isLost ? "lost" : "open",
      closed_at: isWon || isLost ? new Date().toISOString() : null,
    })
    .eq("id", dealId);

  if (error) throw new Error(error.message);

  revalidatePath("/pipeline");
  revalidatePath("/");
}
