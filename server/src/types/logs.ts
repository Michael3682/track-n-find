import { LOG_TARGETS } from "@prisma/client";

export interface Logs {
    id?: string;
    createdAt?: Date;
    actorId: string;
    actorName: string;
    action: string;
    target?: LOG_TARGETS;
    targetId?: string;
    metaData?: string;
}