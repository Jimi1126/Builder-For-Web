class Calculator {
  private total: number;
  constructor(total = 0) {
    this.total = total;
  }
  plus(num: number) {
    this.total += num;
    return this;
  }
  minus(num: number) {
    this.total -= num;
    return this;
  }
  mult(num: number) {
    this.total *= num;
    return this;
  }
  div(num: number) {
    this.total /= num;
    return this;
  }
  setTotal(total: number = 0) {
    this.total = total;
    return this;
  }
  value() {
    return Number(this.total.toFixed(2));
  }
}

export function useCalculator() {
  return { Calculator, calculator: new Calculator() };
}
