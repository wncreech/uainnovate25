using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INNOVATE
{
    public class Transaction
    {
        public string description { get; set; } 
        public double amount { get; set; }
        public DateTime date { get; set; }
        public Transaction(string description, double amount, DateTime date)
        {
            this.description = description;
            this.amount = amount;
            this.date = date;
        }
        public override string ToString()
        {
            return $"{description} - ${amount:F2} on {date.ToShortDateString()}";
        }

    }
}