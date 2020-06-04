export interface Message {
  id: number;
  senderId: number;
  senderKnownAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientKnownAs: string;
  recipientPhotoUrl: string;
  messageSent: Date;
  isRead: boolean;
  dateRead: Date;
  content: string;
}
