using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(UserLogActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UserController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] UserParams userParams)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.Get(userId);

            userParams.UserId = userFromRepo.Id;

            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = (userFromRepo.Gender == "male") ? "female" : "male";

            var users = await _repo.GetAll(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UsersForListDto>>(users);

            Response.AddPaginationHeader(new PaginationHeader
            {
                PageNumber = users.CurrentPage,
                PageSize = users.PageSize,
                TotalCount = users.TotalCount,
                TotalPages = users.TotalPages
            });

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _repo.Get(id);

            var userToReturn = _mapper.Map<UserForDetailsDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.Get(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if (await _repo.SaveALL())
                return NoContent();

            throw new Exception($"Something went wrong whlie updating user with id : {id}");

        }
    }
}