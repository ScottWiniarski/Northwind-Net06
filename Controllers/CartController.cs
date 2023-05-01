using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class CartController : Controller{
    private DataContext _dataContext;
    private UserManager<AppUser> _userManager;
    public CartController(DataContext db, UserManager<AppUser> usrMgr)
    {
        _dataContext = db;
        _userManager = usrMgr;
    }
    [Authorize(Roles = "northwind-customer")]
    public IActionResult Index() {
        int cid = _dataContext.Customers.First(c => c.Email == User.Identity.Name).CustomerId;
        return View(_dataContext.CartItems.Include("Product").Where(c => c.CustomerId == cid));
    }
    
    [HttpPost, Route("cart/updatequantity")]
        // adds a row to the cartitem table
        public CartItem Post([FromBody] CartItemJSON cartItem) => _dataContext.UpdateQuantity(cartItem);
}