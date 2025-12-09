import { ItemStatus, ItemType } from "@prisma/client";

export interface Item {
    id?: string;
    name: string;
    description: string;
    category: string;
    date_time: Date;
    location: string;
    attachments: string[] | undefined;
    status: ItemStatus;
    type: ItemType;
    associated_person: string;   
}

export type Claim = { 
    itemId: string, 
    claimerId: string,
    claimerName: string,
    claimedAt: string,
    claimedFrom: string,
    reporterId: string,
    conversationId: string,
    credentials: {},
}