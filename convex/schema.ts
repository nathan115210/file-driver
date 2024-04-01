import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export enum FileTypes {
  IMAGE = "image",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  VIDEO = "video",
  AUDIO = "audio",
}

export const fileTypeUnion = v.union(
  v.literal(FileTypes.IMAGE),
  v.literal(FileTypes.DOCUMENT),
  v.literal(FileTypes.SPREADSHEET),
  v.literal(FileTypes.AUDIO),
  v.literal(FileTypes.VIDEO),
);

export const fileTypesMap = {
  //image
  "image/png": FileTypes.IMAGE,
  "image/jpeg": FileTypes.IMAGE,
  "image/apng": FileTypes.IMAGE,
  "image/avif": FileTypes.IMAGE,
  "image/svg+xml": FileTypes.IMAGE,
  "image/webp": FileTypes.IMAGE,
  // document
  "application/pdf": FileTypes.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FileTypes.DOCUMENT,
  "application/msword": FileTypes.DOCUMENT,
  "application/x-abiword": FileTypes.DOCUMENT,
  "application/vnd.amazon.ebook": FileTypes.DOCUMENT,
  "application/x-bzip": FileTypes.DOCUMENT,
  "application/x-bzip2": FileTypes.DOCUMENT,
  "application/x-cdf": FileTypes.DOCUMENT,
  "application/x-csh": FileTypes.DOCUMENT,
  "application/json": FileTypes.DOCUMENT,
  "application/xhtml+xml": FileTypes.DOCUMENT,
  "application/xml": FileTypes.DOCUMENT,
  "application/zip": FileTypes.DOCUMENT,
  //spreadsheet
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FileTypes.SPREADSHEET,
  "text/csv": FileTypes.SPREADSHEET,
  "application/vnd.ms-powerpoint": FileTypes.SPREADSHEET,
  "application/x-sh": FileTypes.SPREADSHEET,
  // video
  "video/mp4": FileTypes.VIDEO,
  "video/quicktime": FileTypes.VIDEO,
  "video/x-msvideo": FileTypes.VIDEO,
  "video/mpeg": FileTypes.VIDEO,
  "video/ogg": FileTypes.VIDEO,
  "video/webm": FileTypes.VIDEO,
  // audio
  "audio/mpeg": FileTypes.AUDIO,
  "audio/wav": FileTypes.AUDIO,
} as Record<string, Doc<"files">["type"]>;

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.optional(v.string()),
    type: fileTypeUnion,
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
    /*clerkId: v.string(),*/
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
