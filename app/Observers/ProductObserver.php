<?php

namespace App\Observers;

use App\Models\CartItem;
use App\Models\Product;

class ProductObserver
{
    /**
     * Handle the Product "deleted" event (soft delete).
     * Remove all cart items referencing this product.
     */
    public function deleted(Product $product): void
    {
        CartItem::where('product_id', $product->id)->delete();
    }

    /**
     * Handle the Product "force deleted" event.
     * Cart items are already cleaned up by cascade delete,
     * but this handles edge cases.
     */
    public function forceDeleted(Product $product): void
    {
        CartItem::where('product_id', $product->id)->delete();
    }
}
