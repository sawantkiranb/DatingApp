using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> Get(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetAll(UserParams userParams)
        {
            var users = _context.Users
            .OrderByDescending(u => u.Created)
            .AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            var minDate = DateTime.Now.AddYears(-userParams.maxAge);
            var maxDate = DateTime.Now.AddYears(-userParams.minAge);

            users = users.Where(u => u.DateOfBirth >= minDate && u.DateOfBirth < maxDate);

            switch (userParams.OrderBy)
            {
                case "created":
                    users = users.OrderByDescending(u => u.Created);
                    break;
                case "lastActive":
                    users = users.OrderByDescending(u => u.LastActive);
                    break;
            }

            if (userParams.Likees)
            {
                var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userParams.UserId);

                var likeeList = user.Likees.Where(u => u.LikerId == userParams.UserId).Select(u => u.LikeeId);

                users = users.Where(u => likeeList.Contains(u.Id));
            }

            if (userParams.Likers)
            {
                var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userParams.UserId);

                var likerList = user.Likers.Where(i => i.LikeeId == userParams.UserId).Select(u => u.LikerId);
                users = users.Where(u => likerList.Contains(u.Id));
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<Photo> GetPhotoForUser(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Like> GetLike(int userId, int likeeId)
        {
            return await _context.Likes.FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == likeeId);
        }

        public async Task<bool> SaveALL()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {

                case "Inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.IsRead == false && m.RecipientDeleted == false);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);

            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
            .Where(m => m.SenderId == userId && m.RecipientId == recipientId || m.SenderId == recipientId && m.RecipientId == userId)
            .OrderByDescending(u => u.MessageSent)
            .ToListAsync();

            return messages;
        }
    }
}