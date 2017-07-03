interface PaymentPattern<T> {
  CreditCard: (card: CreditCardPayment) => T;
  Cash: (cash: CashPayment) => T;
}

interface PaymentMatcher {
  match<T>(p: PaymentPattern<T>): T;
}

export abstract class Payment implements PaymentMatcher {
  constructor(public readonly amount: number) {}
  abstract match<T>(p: PaymentPattern<T>): T;
}

export class CreditCardPayment extends Payment {
  constructor(amount: number, public readonly fee: number) {
    super(amount);
  }

  match<T>(p: PaymentPattern<T>): T {
    return p.CreditCard(this);
  }
}

export class CashPayment extends Payment {
  constructor(amount: number, public readonly discount: number) {
    super(amount);
  }

  match<T>(p: PaymentPattern<T>): T {
    return p.Cash(this);
  }
}

export function calculatePaymentAmount(payment: Payment) {
  return payment.match({
    CreditCard: card => card.amount + (card.amount * card.fee),
    Cash: cash => cash.amount - cash.discount
  });
}
