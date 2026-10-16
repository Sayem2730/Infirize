import { getBrowserClient } from "./supabase-browser";

const BUCKET = "site-images";

async function compress(file: File, maxWidth = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not process the image"))),
      "image/jpeg",
      0.85,
    ),
  );
}

export async function uploadImage(file: File, folder = "projects"): Promise<string> {
  const db = getBrowserClient();
  if (!db) throw new Error("Supabase is not configured");
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image");
  }
  if (file.size > 15 * 1024 * 1024) throw new Error("Image is larger than 15 MB");

  const blob = await compress(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw error;
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function removeImage(url: string | null | undefined) {
  const db = getBrowserClient();
  if (!db || !url) return;
  const marker = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return;
  await db.storage.from(BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))]);
}
