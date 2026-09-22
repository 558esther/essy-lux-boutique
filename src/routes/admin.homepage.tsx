import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader, type UploaderImage } from "@/components/admin/ImageUploader";
import { getAllHomepageSections, saveHomepageSection } from "@/lib/queries/admin-homepage";
import { uploadProductImage } from "@/lib/queries/admin-products";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepage,
});

function AdminHomepage() {
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin", "homepage"],
    queryFn: getAllHomepageSections,
  });

  if (isLoading || !sections) {
    return <p className="text-sm text-muted-foreground">Loading homepage content…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl uppercase tracking-wide">Homepage</h2>
        <p className="text-xs text-muted-foreground">
          Edit the homepage copy and images shown to customers — no code changes needed.
        </p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="banner">Brand banner</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroEditor
            initial={sections.hero}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "homepage"] })}
          />
        </TabsContent>
        <TabsContent value="banner">
          <BannerEditor
            initial={sections.banner}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "homepage"] })}
          />
        </TabsContent>
        <TabsContent value="newsletter">
          <NewsletterEditor
            initial={sections.newsletter}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "homepage"] })}
          />
        </TabsContent>
        <TabsContent value="testimonials">
          <TestimonialsEditor
            initial={sections.testimonials}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "homepage"] })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 max-w-2xl space-y-4 rounded-lg border border-border bg-shell p-5">{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>;
}

function HeroEditor({ initial, onSaved }: { initial?: Record<string, string>; onSaved: () => void }) {
  const [heading, setHeading] = useState(initial?.heading ?? "Luxury, carried beautifully.");
  const [description, setDescription] = useState(
    initial?.description ?? "Discover elegant handbags designed to complement your style, confidence and everyday beauty.",
  );
  const [buttonText, setButtonText] = useState(initial?.buttonText ?? "Shop the collection");
  const [image, setImage] = useState<UploaderImage[]>(initial?.imageUrl ? [{ url: initial.imageUrl }] : []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHeading(initial?.heading ?? heading);
    setDescription(initial?.description ?? description);
    setButtonText(initial?.buttonText ?? buttonText);
    if (initial?.imageUrl) setImage([{ url: initial.imageUrl }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  async function save() {
    setSaving(true);
    try {
      await saveHomepageSection("hero", { heading, description, buttonText, imageUrl: image[0]?.url ?? "" });
      toast.success("Hero section updated.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard>
      <div>
        <FieldLabel>Hero heading</FieldLabel>
        <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Hero description</FieldLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <FieldLabel>Button text</FieldLabel>
        <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Hero image</FieldLabel>
        <ImageUploader
          images={image}
          uploadFn={uploadProductImage}
          onAdd={(urls) => setImage(urls.slice(-1).map((url) => ({ url })))}
          onRemove={() => setImage([])}
          onSetMain={() => {}}
        />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save hero section"}
      </Button>
    </SectionCard>
  );
}

function BannerEditor({ initial, onSaved }: { initial?: Record<string, string>; onSaved: () => void }) {
  const [heading, setHeading] = useState(initial?.heading ?? "Carry your confidence.");
  const [subtext, setSubtext] = useState(
    initial?.subtext ?? "Luxury is not only what you wear. It is how you carry yourself.",
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveHomepageSection("banner", { heading, subtext });
      toast.success("Brand banner updated.");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard>
      <div>
        <FieldLabel>Banner heading</FieldLabel>
        <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Banner subtext</FieldLabel>
        <Textarea value={subtext} onChange={(e) => setSubtext(e.target.value)} rows={2} />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save banner"}
      </Button>
    </SectionCard>
  );
}

function NewsletterEditor({ initial, onSaved }: { initial?: Record<string, string>; onSaved: () => void }) {
  const [heading, setHeading] = useState(initial?.heading ?? "Join the Essy-Lux circle");
  const [description, setDescription] = useState(
    initial?.description ?? "Be the first to hear about new arrivals and limited pieces.",
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveHomepageSection("newsletter", { heading, description });
      toast.success("Newsletter section updated.");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard>
      <div>
        <FieldLabel>Heading</FieldLabel>
        <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save newsletter text"}
      </Button>
    </SectionCard>
  );
}

function TestimonialsEditor({ initial, onSaved }: { initial?: Record<string, string>; onSaved: () => void }) {
  const [rows, setRows] = useState(
    [1, 2, 3].map((i) => ({
      quote: initial?.[`quote${i}`] ?? "",
      author: initial?.[`author${i}`] ?? "",
    })),
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const value: Record<string, string> = {};
      rows.forEach((r, i) => {
        value[`quote${i + 1}`] = r.quote;
        value[`author${i + 1}`] = r.author;
      });
      await saveHomepageSection("testimonials", value);
      toast.success("Testimonials updated.");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionCard>
      {rows.map((r, i) => (
        <div key={i} className="space-y-2 border-b border-border pb-4 last:border-0">
          <FieldLabel>Testimonial {i + 1}</FieldLabel>
          <Textarea
            value={r.quote}
            onChange={(e) => setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, quote: e.target.value } : row)))}
            rows={2}
            placeholder="Quote"
          />
          <Input
            value={r.author}
            onChange={(e) => setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, author: e.target.value } : row)))}
            placeholder="Customer name"
          />
        </div>
      ))}
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save testimonials"}
      </Button>
    </SectionCard>
  );
}
