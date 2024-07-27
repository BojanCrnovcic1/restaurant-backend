import * as Validator from "class-validator";
export class AddFoodToCartDto {
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