import { Schema, model, Document } from 'mongoose';

export interface IEventChannel extends Document {
    guildId: string;
	channelId: string;
	channelName: string;
}

const eventChannelSchema = new Schema<IEventChannel>({
	guildId: { type: String, required: true, unique: true },
	channelId: { type: String },
	channelName: { type: String },
});

export const EventChannel = model<IEventChannel>('EventChannel', eventChannelSchema);
export default EventChannel;
