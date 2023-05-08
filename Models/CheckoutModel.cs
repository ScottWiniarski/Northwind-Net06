public class CheckoutModel {
    public IEnumerable<CartItem> Cart { get; set; }
    public IEnumerable<Discount> Discounts { get; set; }
}