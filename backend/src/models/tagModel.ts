import { Schema, model, Document } from "mongoose";

// Define the Tag interface extending Document
export interface ITag extends Document {
  name: string;
  color: string;
}

// Define the Tag schema using ITag
const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

// Create the Tag model
const TagModel = model<ITag>("Tag", TagSchema);

export default TagModel;
export { TagSchema }; // Export the schema for reuse
