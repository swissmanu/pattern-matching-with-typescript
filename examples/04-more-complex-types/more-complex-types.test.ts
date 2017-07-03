import {
  calculatePaymentAmount,
  CashPayment,
  CreditCardPayment,
  Payment
} from './more-complex-types';

const creditCardPayment = new CreditCardPayment(100, 0.02);
const cashPayment = new CashPayment(100, 42);

describe('More Complex Types:', () => {
  describe('PaymentPattern', () => {
    it('should match a CreditCardPayment with CreditCard(card)', () => {
      const cardSpy = jest.fn();
      const cashSpy = jest.fn();

      creditCardPayment.match({
        CreditCard: cardSpy,
        Cash: cashSpy
      });

      expect(cardSpy).toHaveBeenCalledWith(creditCardPayment);
      expect(cashSpy).not.toHaveBeenCalled();
    });

    it('should match a CashPayment with Cash(cash)', () => {
      const cardSpy = jest.fn();
      const cashSpy = jest.fn();

      cashPayment.match({
        CreditCard: cardSpy,
        Cash: cashSpy
      });

      expect(cardSpy).not.toHaveBeenCalled();
      expect(cashSpy).toHaveBeenCalledWith(cashPayment);
    });
  });

  describe('calculatePaymentAmount()', () => {
    it('should add fees multiplied with amount to amount for credit card payments', () => {
      const finalAmount = creditCardPayment.amount + (creditCardPayment.amount * creditCardPayment.fee);
      expect(calculatePaymentAmount(creditCardPayment)).toEqual(finalAmount);
    });

    it('should subtract discount from amount for cash payments', () => {
      const finalAmount = cashPayment.amount - cashPayment.discount;
      expect(calculatePaymentAmount(cashPayment)).toEqual(finalAmount);
    });
  });
});
