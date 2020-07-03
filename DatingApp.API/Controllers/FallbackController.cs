using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            var path = @"D:\Asp.Net Core and Angular\DatingApp.API\wwwroot\index.html";
            return PhysicalFile(path, "text/HTML");
        }
    }
}