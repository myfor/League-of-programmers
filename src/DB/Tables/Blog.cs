﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DB.Tables
{
    public class Blog : Entity
    {
        [Required]
        public int AuthorId { get; set; }
        public User Author { get; set; }
        [Required, StringLength(64)]
        public string Title { get; set; } = "";
        
        [Required]
        public string Content { get; set; } = "";
        [Required]
        public int Views { get; set; } = 0;
        public string TargetIds { get; set; } = "";
        [Required]
        public int Likes { get; set; } = 0;
        public List<Comment> Comments { get; set; }
    }
}
