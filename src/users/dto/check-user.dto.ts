export class CheckUserDto {
    id?: number
    name?: string;
    non_blacklist?: boolean;
    emailVerified?: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
}