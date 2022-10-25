import { Types } from "mongoose";

export interface typeMessage {
  sender: Types.ObjectId;
  message: string;
  chat: Types.ObjectId;
}

export interface ServerToClientEvents {
  noArg: () => void;
  connected: (message: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receiveComment: (comment: string) => void;
  receiveReply: (comment: string) => void;
}

export interface ClientToServerEvents {
  addComment: (comment: string, room: string) => void;
  addReply: (reply: string, room: string) => void;
  joinPost: (id: string) => void;
  newMessage: (message: typeMessage, room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
  id: string;
}
