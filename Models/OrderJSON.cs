public class OrderJSON {

    public OrderJSON(string customerEmail){
        CustomerEmail = customerEmail;
        OrderDetails = new List<OrderDetailsJSON>();
    }
    public string CustomerEmail { get; set; }
    public ICollection<OrderDetailsJSON> OrderDetails { get; set; }
}

public class OrderDetailsJSON {
    public int ProductId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Discount { get; set; }
}