using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveALL();
        Task<PagedList<User>> GetAll(UserParams userParams);
        Task<User> Get(int id);
        Task<Photo> GetPhotoForUser(int id);
    }
}