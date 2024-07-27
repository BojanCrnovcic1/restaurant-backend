import * as Validator from "class-validator";
export class EditFoodInCartDto {
    foodId: number;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0
    })
    quantity: number;
}