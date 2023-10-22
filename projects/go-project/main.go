package main

import (
	"calculator"
	"fmt"
)

func main() {
	message := "Hello, World!"
	fmt.Println(message)

	calculatorInstance := calculator.Calculator{}

	num1 := 10
	num2 := 5

	sum := calculatorInstance.Add(num1, num2)

	fmt.Println("sum of %d and %d is %d\n", num1, num2, sum)
}
