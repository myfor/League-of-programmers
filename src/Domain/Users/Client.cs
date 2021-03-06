﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DB;
using Common;
using System.IO;
using Microsoft.EntityFrameworkCore;

namespace Domain.Users
{
    /// <summary>
    /// 客户
    /// </summary>
    public class Client : User
    {
        internal Client(DB.Tables.User userModel) : base(userModel) { }

        private Client() { }

        private Client(int id, string account, string name, RoleCategories role): this()
        {
            Id = id;
            Account = account;
            Name = name;
            Role = role;
        }

        /// <summary>
        /// 获取客户的博文
        /// </summary>
        /// <returns></returns>
        public async Task<Paginator> GetBlogsAsync(int index, int size, int? state, string s)
        {
            var pager = Paginator.New(index, size, 3);
            pager["account"] = Account;
            pager["s"] = s ?? "";
            pager["state"] = state?.ToString() ?? "";

            Blogs.BlogsManager blogsManager = new Blogs.BlogsManager();
            pager = await blogsManager.GetBlogListAsync(Blogs.BlogsManager.ListType.ClientDetailPage, pager);
            return pager;
        }

        /// <summary>
        /// Client: <管理员名>
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return $"{nameof(Client)}: " + base.ToString();
        }

        /// <summary>
        /// post new blog
        /// </summary>
        /// <param name="model"></param>
        /// <returns>(new post id, new post url title)</returns>
        public async Task<(int, string)> WriteBlogAsync(Blogs.Models.NewPost model)
        {
            Blogs.BlogsManager blogsManager = new Blogs.BlogsManager();
            int id = await blogsManager.CreateBlogAsync(model);

            if (id == Blogs.BlogsManager.POST_DEFEATED)
                return (Blogs.BlogsManager.POST_DEFEATED, "");
            return (id, model.Title.Replace(' ', '-'));
        }

        public static explicit operator Client(Administrator administrator)
        {
            return new Client(administrator.Id, administrator.Account, administrator.Name, administrator.Role);
        }
    }
}
