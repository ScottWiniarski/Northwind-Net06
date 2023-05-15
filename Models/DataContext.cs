using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
  public DataContext(DbContextOptions<DataContext> options) : base(options) { }

  public DbSet<Product> Products { get; set; }
  public DbSet<Category> Categories { get; set; }
  public DbSet<Discount> Discounts { get; set; }
  public DbSet<Customer> Customers { get; set; }
  public DbSet<CartItem> CartItems { get; set; }
  public DbSet<Order> Orders { get; set; }
  public DbSet<OrderDetails> OrderDetails { get; set; }

  public void AddCustomer(Customer customer)
  {
    Customers.Add(customer);
    SaveChanges();
  }
  public void EditCustomer(Customer customer)
  {
    var customerToUpdate = Customers.FirstOrDefault(c => c.CustomerId == customer.CustomerId);
    customerToUpdate.Address = customer.Address;
    customerToUpdate.City = customer.City;
    customerToUpdate.Region = customer.Region;
    customerToUpdate.PostalCode = customer.PostalCode;
    customerToUpdate.Country = customer.Country;
    customerToUpdate.Phone = customer.Phone;
    customerToUpdate.Fax = customer.Fax;
    SaveChanges();
  }

  public void UpdateQuantity(CartItemUpdateJSON item){
    CartItem cartItem = CartItems.FirstOrDefault(ci => ci.CartItemId == item.id);
    cartItem.Quantity = item.qty;
    SaveChanges();
  }

  public void RemoveFromCart(CartItemUpdateJSON item){
    CartItem cartItem = CartItems.FirstOrDefault(ci => ci.CartItemId == item.id);
    CartItems.Remove(cartItem);
    SaveChanges();
  }

  public CartItem AddToCart(CartItemJSON cartItemJSON)
  {
    int CustomerId = Customers.FirstOrDefault(c => c.Email == cartItemJSON.email).CustomerId;
    int ProductId = cartItemJSON.id;
    // check for duplicate cart item
    CartItem cartItem = CartItems.FirstOrDefault(ci => ci.ProductId == ProductId && ci.CustomerId == CustomerId);
    if (cartItem == null)
    {
      // this is a new cart item
      cartItem = new CartItem()
      {
        CustomerId = CustomerId,
        ProductId = cartItemJSON.id,
        Quantity = cartItemJSON.qty
      };
      CartItems.Add(cartItem);
    }
    else
    {
      // for duplicate cart item, simply update the quantity
      cartItem.Quantity += cartItemJSON.qty;
    }

    SaveChanges();
    cartItem.Product = Products.Find(cartItem.ProductId);
    return cartItem;
  }

  public Order CreateOrder(OrderJSON orderJSON){
    var Customer = Customers.FirstOrDefault(c => c.Email == orderJSON.CustomerEmail);
    var orderDate = DateTime.Today;
    decimal orderTotal = 0;

    foreach(OrderDetailsJSON details in orderJSON.OrderDetails){
      orderTotal += details.UnitPrice * details.Quantity;
    }

    //Create Order
    var newOrder = new Order() {
      CustomerId = Customer.CustomerId,
      EmployeeId = 1,
      OrderDate = orderDate,
      RequiredDate = ShippingPolicy.RequiredDate(orderDate),
      ShippedDate = ShippingPolicy.ShippedDate(orderDate),
      ShipVia = ShippingPolicy.ShippingVia(),
      Freight = ShippingPolicy.FreightCost(orderTotal),
      ShipName = Customer.CompanyName,
      ShipAddress = Customer.Address,
      ShipCity = Customer.City,
      ShipRegion = Customer.Region,
      ShipPostalCode = Customer.PostalCode,
      ShipCountry = Customer.Country,
      OrderDetails = new List<OrderDetails>()
    };

    Orders.Add(newOrder);

    foreach(OrderDetailsJSON details in orderJSON.OrderDetails){
      newOrder.OrderDetails.Add(new OrderDetails() {
        OrderId = newOrder.OrderId,
        ProductId = details.ProductId,
        UnitPrice = details.UnitPrice,
        Quantity = details.Quantity,
        Discount = details.Discount
      });
    }

    OrderDetails.AddRange(newOrder.OrderDetails);

    SaveChanges();

    return newOrder;
  }
}
