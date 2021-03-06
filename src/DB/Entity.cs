﻿using System;
using System.ComponentModel.DataAnnotations;

namespace DB
{
    public abstract class Entity
    {
        [Required, Key]
        public int Id { get; set; }
        [Required]
        public int State { get; set; } = 0;
        [Required]
        public DateTime CreateDate { get; set; } = DateTime.Now;
    }
}
