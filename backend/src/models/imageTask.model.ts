import mongoose, { Document, Schema } from "mongoose";

// Define the interface for image version metadata
export interface ImageVersion {
  path: string;
  width: number;
  height: number;
  size: number; // in bytes
}

// Define the interface for image task document
export interface ImageTask extends Document {
  task_id: string;
  original_filename: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  original_metadata: {
    width?: number;
    height?: number;
    mimetype?: string;
    exif?: Record<string, any>;
  };
  processed_at?: Date;
  error_message?: string;
  versions?: {
    low?: ImageVersion;
    medium?: ImageVersion;
    high_optimized?: ImageVersion;
  };
  created_at: Date;
}

// Create the schema for image task
const imageTaskSchema = new Schema<ImageTask>(
  {
    task_id: { type: String, required: true, unique: true },
    original_filename: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
      required: true,
    },
    original_metadata: {
      width: Number,
      height: Number,
      mimetype: String,
      exif: Schema.Types.Mixed,
    },
    processed_at: Date,
    error_message: String,
    versions: {
      low: {
        path: String,
        width: Number,
        height: Number,
        size: Number,
      },
      medium: {
        path: String,
        width: Number,
        height: Number,
        size: Number,
      },
      high_optimized: {
        path: String,
        width: Number,
        height: Number,
        size: Number,
      },
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create and export the model
export const ImageTaskModel = mongoose.model<ImageTask>("ImageTask", imageTaskSchema);
