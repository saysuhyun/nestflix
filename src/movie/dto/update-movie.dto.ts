import { Equals, IsDefined, IsNotEmpty, IsOptional, IsIn, IsBoolean, ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint, Validate, ValidationOptions, registerDecorator } from "class-validator";

enum MovieGenre {
    Fantasy = 'fantasy',
    Action = 'action',
}

// 커스텀 Validator 
@ValidatorConstraint()
class PasswordValidatior implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        /// 비밀번호 길이 4-8
        return value.length > 4 && value.length < 8;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        // 실제 입력된 값 표시 가능 
        return '비밀버호 길이는 4-8자 입니다. 입력된 비밀번호 : ($value)';
    }

}

// 위의 Validate를 사용해서 보다 간편하게 파라미터 유효성 검사가 가능하도록 설정 
function IsPasswordValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            // target, popertyName, options까지는 공통 값으로 똑같이 정의 
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PasswordValidatior,
        })
    };
}


export class UpdateMovieDto {

    @IsNotEmpty() // 만약 값이 있다면 null이면 안 됨 
    @IsOptional() // 값은 있어도 되고 없어도 되는 옵션값 
    title?: string; // 둘 중 어떤 값이 될지 모르니까 

    @IsNotEmpty()
    @IsOptional()
    genre?: string;


    //--- 기본 ---- 
    //@IsDefined() // null 혹은 undefined인가 확인 
    //@IsOptional() // 같이 써야 효과적 , 만약 값자체에 정의가 안 되어있다면 다른 유효성검사 안함 값 있으면 그 외 정의된 유효성 검사 실행 
    //@Equals('code') // 파라미터가 code와 같은지 아닌지 파악후 아니면 에러 
    //@NotEqulas('code') // 파라미터가 code인 경우 에러 
    //@IsEmpty() // null이나 undefiend인 경우 혹은 '' 인 경우 통과 isdefined 반대  + 공백까지 
    //@IsNotEmpty()
    //@IsIn(['action', 'fatasy']) // 값이 배열에 있는 값중 하나여야만 한다 
    //@IsNotIn(['actuib','fantasy'])

    // --- 타입 ---- 
    //@IsBoolean() // boolean값이니? 
    //@IsString()
    //@IsNumber() // 숫자인지 
    //@IsInt() // 정수 체크 
    //@IsArray() // 배열인가 
    //@IsEnum(MovieGenre) // eunm에서 정의된 값인가 
    //@IsDate() // 날짜 객체인지 
    //@IsDateString()  // 날짜 형식 문자열인지 ex2024, 2024-07, 2025-02-03T12:00:00.000Z ,


    //---숫자---
    //@IsDivisibleBy(5)  뭐로 나눌 수 있는가  ex 5로 나눌수 있는 값인가 
    //@IsPositive() 양수인가 
    //@IsNegative() 음수인가 
    //@Min(100) 최소 100보다 커야함 
    //@Max(100) 최대 100보다 작아야함 

    //--- 문자열 ---- 
    //@Contains('code') code라는 문자를 포함하고 있는가 
    //@NotContains('code')
    //@IsAlphanumeric() 알파벳 혹은 숫자로 이루어져있는가
    //@IsCreditCard() 카드형식의 숫자인가
    //@IsHexColor() 컴퓨터에서 색깔 표현하는 형식인가 FEFEFE 이런 식 6자리 16진수
    //@MaxLength(16) 최대 길이 
    //@MinLength(4) 최소 길이  MaxLength 랑 MinLength 합치면 비번쓸때 유용 
    //@IsUUID() 랜덤한 숫자 아이디 고유값
    //@IsLatLong()  위도 경도 

    // --- 커스텀 --- 
    // 파라미터로 들어가는 값이 위에 있는 ValidationOption으로 들어감 
    @IsPasswordValid({
        message: '다른 메세지 '
    })
    test: string;
}