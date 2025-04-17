import { model, Schema } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const ChannelModel = model("Channel", channelSchema);
