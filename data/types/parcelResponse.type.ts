export interface ParcelResponse {
    foreignBarcode: string;
    isSendOnParcel: boolean;
    isEasipikParcel: boolean;
    isPaid: boolean;
    requiresPayment: boolean;
    canBePaidOnline: boolean;
    requiresCustomsDeclaration: boolean;
    canBeDeclaredOnline: boolean;
    movements: Movement[];
    isForeign: boolean;
    isForeignOutgoing: boolean;
    destination: string;
    obfuscatedRecipient: string;
    isUntrackable: boolean;
    eligibleForRedelivery: boolean;
    eligibleForEmailUpdatesSignUp: boolean;
}

export interface Movement {
    code: string;
    description: string;
    location: string;
    date: string;
    isForeignMovement: boolean;
}