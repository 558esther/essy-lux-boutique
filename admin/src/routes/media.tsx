import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/queries/admin-media";
import type { MediaItem } from "@/lib/types";

export const Route = createFileRoute("/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const queryClient = useQueryClient();
  const { data: media = [], isLoading } = useQuery({ queryKey: ["admin", "media"], queryFn: listMedia });
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, "general");
      }
      toast.success("Image(s) uploaded to your media library.");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMedia(deleteTarget.id, deleteTarget.url);
    toast.success("Image deleted.");
    queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl uppercase tracking-wide">Media Library</h2>
          <p className="text-xs text-muted-foreground">
            Images uploaded here, or through Add Product / Homepage, all live in one place — reuse them instead
            of re-uploading.
          </p>
        </div>
        <Button asChild size="sm" disabled={uploading}>
          <label className="cursor-pointer">
            <UploadCloud className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading media…</p>
      ) : media.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {media.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-md border border-border bg-shell">
              <img src={m.url} alt={m.file_name} className="aspect-square w-full object-cover" />
              <div className="p-2">
                <p className="truncate text-[0.65rem] text-muted-foreground">{m.file_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(m)}
                className="absolute right-1.5 top-1.5 rounded bg-black/55 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this image?"
        description="If this image is still used on a product or page, that spot will show broken until you replace it."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
