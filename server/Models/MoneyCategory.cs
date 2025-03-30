using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace INNOVATE
{
    public class MoneyCategory
    {
        public string title { get; set; }
        public string emojiIcon { get; set; }

        public double dollarAmount { get; set; }

        public bool isFixed { get; set; }

        public int catId { get; set; }

        public bool deleted { get; set; }

        public List<Transaction> transactions { get; set; }

        public MoneyCategory() {
            title = "Untitled";
            emojiIcon = "‼️";
            dollarAmount = 0;
            isFixed = false;
            transactions = new List<Transaction>();
            deleted = false;
        }

        public MoneyCategory(string title, string emojiIcon, double dollarGoal, bool isFixed, int catId) {
            this.title = title;
            this.emojiIcon = emojiIcon;
            this.dollarAmount = dollarGoal;
            this.isFixed = isFixed;
            transactions = new List<Transaction>();
            this.catId = catId;
            deleted = false;
        }

        public void AddTransaction(Transaction transaction)
        {
            transactions.Add(transaction);
        }

        public override string ToString() 
        {
            string mystring = title + $" {emojiIcon} - " + $"{dollarAmount:F2}"; 
            return mystring;
        }

        public void DeleteCat() {
            deleted = !deleted;
        }
    }

    

}