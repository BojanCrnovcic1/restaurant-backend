import * as Validator from "class-validator";

export class UserRegisterDto {
    @Validator.IsNotEmpty({ message: 'Email should not be empty' })
    @Validator.IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Validator.IsNotEmpty({ message: 'Password should not be empty' })
    @Validator.IsString({ message: 'Password should be a string' })
    @Validator.Length(6, 128, { message: 'Password should be between 6 and 128 characters' })
    password: string;

    @Validator.IsNotEmpty({ message: 'Forename should not be empty' })
    @Validator.IsString({ message: 'Forename should be a string' })
    @Validator.Length(3, 64, { message: 'Forename should be between 3 and 64 characters' })
    forename: string;

    @Validator.IsNotEmpty({ message: 'Surname should not be empty' })
    @Validator.IsString({ message: 'Surname should be a string' })
    @Validator.Length(3, 64, { message: 'Surname should be between 3 and 64 characters' })
    surname: string;

    @Validator.IsNotEmpty({ message: 'Phone number should not be empty' })
    phoneNumber: string;

    @Validator.IsNotEmpty({ message: 'Postal address should not be empty' })
    @Validator.IsString({ message: 'Postal address should be a string' })
    @Validator.Length(10, 512, { message: 'Postal address should be between 10 and 512 characters' })
    postalAddress: string;
}
