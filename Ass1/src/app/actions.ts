"use server";

import { itemSchema, ItemInput, ActionResult } from "@/lib/schema";

export async function addItemAction(
  data: ItemInput
): Promise<ActionResult<{ id: string; name: string; price: number }>> {
  const result = itemSchema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      errors: formattedErrors as Record<string, string[]>,
      message: "Please enter valid item details.",
    };
  }

  const newItem = {
    id: `item-${Date.now()}`,
    name: result.data.name,
    price: result.data.price,
  };

  return {
    success: true,
    data: newItem,
    message: "Item added successfully",
  };
}
