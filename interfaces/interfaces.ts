export interface IUserDTO {
    id: string;
    email: string;
    suscription: ISubscriptionDTO | null;
    phone?: string;
    name: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
    endedAt: string;
}

export interface ISubscriptionDTO {
    id: string;
    name: string;
    link: string;
    email: string;
    password: string;
    status: "active" | "blocked" | "expired" | "canceled";
    blockedAt?: string;
    endedAt: string;
    createdAt: string;
    updatedAt: string;
}
