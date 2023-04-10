using Microsoft.AspNetCore.Mvc;

public class AccountController : Controller
{
    public IActionResult Login(string returnUrl)
    {
        // return url remembers the user's original request
        ViewBag.returnUrl = returnUrl;
        return View();
    }

    public ViewResult AccessDenied() => View();
}