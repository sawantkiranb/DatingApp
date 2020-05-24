using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class UserLogActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = Convert.ToInt32(context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = context.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await repo.Get(userId);
            user.LastActive = DateTime.Now;
            await repo.SaveALL();

        }
    }
}