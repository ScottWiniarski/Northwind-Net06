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
    [Authorize(Roles = "northwind-customer")]
    public IActionResult Checkout() {
        CheckoutModel checkoutModel = new CheckoutModel();

        checkoutModel.Discounts = _dataContext.Discounts.Where(d => d.StartTime < DateTime.Today && d.EndTime > DateTime.Today);

        int cid = _dataContext.Customers.First(c => c.Email == User.Identity.Name).CustomerId;
        checkoutModel.Cart = _dataContext.CartItems.Include("Product").Where(c => c.CustomerId == cid);

        
        return View(checkoutModel);
    }

    // TODO post order
    //[HttpPost]
    //public IActionResult Checkout(Order)
}