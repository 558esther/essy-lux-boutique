import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  type OrderStatus,
  type ProductStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const PRODUCT_STYLES: Record<ProductStatus, string> = {
  draft: "bg-muted text-muted-foreground border-transparent",
  published: "bg-[oklch(0.9_0.06_150)] text-[oklch(0.3_0.08_150)] border-transparent",
  out_of_stock: "bg-[oklch(0.9_0.08_60)] text-[oklch(0.4_0.1_60)] border-transparent",
  archived: "bg-secondary text-secondary-foreground border-transparent",
};

const ORDER_STYLES: Record<OrderStatus, string> = {
  new: "bg-[oklch(0.88_0.07_250)] text-[oklch(0.35_0.1_250)] border-transparent",
  confirmed: "bg-[oklch(0.9_0.06_150)] text-[oklch(0.3_0.08_150)] border-transparent",
  processing: "bg-[oklch(0.9_0.08_79.5)] text-[oklch(0.4_0.1_79.5)] border-transparent",
  ready_for_delivery: "bg-accent text-accent-foreground border-transparent",
  delivered: "bg-[oklch(0.9_0.06_150)] text-[oklch(0.3_0.08_150)] border-transparent",
  cancelled: "bg-[oklch(0.9_0.1_25)] text-[oklch(0.4_0.14_25)] border-transparent",
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Badge className={cn(PRODUCT_STYLES[status])}>{PRODUCT_STATUS_LABELS[status]}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={cn(ORDER_STYLES[status])}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
