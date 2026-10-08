export type ExifData = {
  camera_make: string | null;
  camera_model: string | null;
  lens_model: string | null;
  iso: number | null;
  aperture: number | null;
  shutter_speed: string | null;
  shutter_seconds: number | null;
  focal_length_mm: number | null;
  exposure_compensation: number | null;
  metering_mode: string | null;
  white_balance: string | null;
  taken_at: string | null;
  detected_fields: number;
  has_exif: boolean;
};

export type PhotoUploadResult = {
  id: string;
  original_filename: string;
  format: "JPEG" | "PNG" | "WEBP";
  mime_type: "image/jpeg" | "image/png" | "image/webp";
  file_size: number;
  width: number;
  height: number;
  image_url: string;
  thumbnail_url: string;
  exif: ExifData;
  exif_notice: string | null;
};

