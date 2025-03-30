using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;

namespace INNOVATE
{
    public class User {

        //default constructor 
        //name Mommy calls the user
        public string userName { get; set; }

        //filename for save data
        public string fileName { get; set; }

        //base savings goals - can be changed, 50/30/20 by default, must add to 100
        public int needsPercentGoal { get; set; }
        public double needsDollarGoal { get; set; }
        public int wantsPercentGoal { get; set; }
        public double wantsDollarGoal { get; set; }
        public int savingsPercentGoal { get; set; }
        public double savingsDollarGoal { get; set; }

        //
        //this is ZERO-BASED monthly budgeting - everything including savings is accounted for
        public double totalMonthlyIncome { get; set; }

        //calculated by summing up all Categories
        public double monthlyNeedsTotal{ get; set; }

        public double monthlyWantsTotal{ get; set; }

        public double monthlySavingsTotal{ get; set; }

        public List<MoneyCategory> IncomeCats { get; set; }
        public List<MoneyCategory> NeedsCats { get; set; }
        public List<MoneyCategory> WantsCats { get; set; }
        public List<MoneyCategory> SavingsCats { get; set; }

        public void Recalculate() {
            Console.WriteLine("adding");
            totalMonthlyIncome = 0;
            for (int i = 0; i < IncomeCats.Count; i++) {
                IncomeCats[i].dollarAmount = 0;
                for (int j = 0; j < IncomeCats[i].transactions.Count; j++) {
                    IncomeCats[i].dollarAmount += IncomeCats[i].transactions[j].amount;
                }
                totalMonthlyIncome += IncomeCats[i].dollarAmount;
            }
            monthlyNeedsTotal = 0;
            for (int i = 0; i < NeedsCats.Count; i++) {
                NeedsCats[i].dollarAmount = 0;
                for (int j = 0; j < NeedsCats[i].transactions.Count; j++) {
                    NeedsCats[i].dollarAmount += NeedsCats[i].transactions[j].amount;
                }
                monthlyNeedsTotal+= NeedsCats[i].dollarAmount;
            }
            monthlyWantsTotal = 0;
            for (int i = 0; i < WantsCats.Count; i++) {
                WantsCats[i].dollarAmount = 0;
                for (int j = 0; j < WantsCats[i].transactions.Count; j++) {
                    WantsCats[i].dollarAmount += WantsCats[i].transactions[j].amount;
                }
                monthlyWantsTotal+= WantsCats[i].dollarAmount;
            }
            monthlySavingsTotal = 0;
            for (int i = 0; i < SavingsCats.Count; i++) {
                SavingsCats[i].dollarAmount = 0;
                for (int j = 0; j < SavingsCats[i].transactions.Count; j++) {
                    SavingsCats[i].dollarAmount += SavingsCats[i].transactions[j].amount;
                }
                monthlySavingsTotal += SavingsCats[i].dollarAmount;
            }
            needsDollarGoal = totalMonthlyIncome * (needsPercentGoal / 100.0);
            wantsDollarGoal = totalMonthlyIncome * (wantsPercentGoal / 100.0);
            savingsDollarGoal = totalMonthlyIncome * (savingsPercentGoal / 100.0);

            Console.WriteLine(monthlySavingsTotal);
        }

        //constructors
        public User() {
            IncomeCats = new List<MoneyCategory>();
            NeedsCats = new List<MoneyCategory>();
            WantsCats = new List<MoneyCategory>();
            SavingsCats = new List<MoneyCategory>();
            CreateDefaultUser();
        }

        public User(string fileAttempt) {
            fileName = fileAttempt;
            if (!File.Exists(fileName)) 
            {
                CreateDefaultUser();
                return;
            }
            User loadedUser = LoadFromJson(fileName);
            if (loadedUser != null && loadedUser.ValidateUser())
            {
                this.userName = loadedUser.userName;
                this.needsPercentGoal = loadedUser.needsPercentGoal;
                this.needsDollarGoal = loadedUser.needsDollarGoal;
                this.wantsPercentGoal = loadedUser.wantsPercentGoal;
                this.wantsDollarGoal = loadedUser.wantsDollarGoal;
                this.savingsPercentGoal = loadedUser.savingsPercentGoal;
                this.savingsDollarGoal = loadedUser.savingsDollarGoal;
                this.totalMonthlyIncome = loadedUser.totalMonthlyIncome;
                this.monthlyNeedsTotal = loadedUser.monthlyNeedsTotal;
                this.monthlyWantsTotal = loadedUser.monthlyWantsTotal;
                this.monthlySavingsTotal = loadedUser.monthlySavingsTotal;
                this.IncomeCats = loadedUser.IncomeCats;
                this.NeedsCats = loadedUser.NeedsCats;
                this.WantsCats = loadedUser.WantsCats;
                this.SavingsCats = loadedUser.SavingsCats;
        }
        else
        {
            CreateDefaultUser();
        }
        }
        //save data management - for the sake of the demo, very very basic
        public static void SaveToJson(User user, string fileName)
        {
            user.fileName = fileName;
            string jsonString = JsonSerializer.Serialize(user, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(fileName, jsonString);
        }

        public static User LoadFromJson(string fileName)
        {
            string jsonString = File.ReadAllText(fileName);
            return JsonSerializer.Deserialize<User>(jsonString);
        }

        //check if load was successful
        public bool ValidateUser()
        {
            if (string.IsNullOrEmpty(userName)) return false;

            if (IncomeCats == null || NeedsCats == null || WantsCats == null || SavingsCats == null)
                return false;

            if (needsPercentGoal < 0 || wantsPercentGoal < 0 || savingsPercentGoal < 0 ||
                needsPercentGoal > 100 || wantsPercentGoal > 100 || savingsPercentGoal > 100)
                return false;

            if (needsPercentGoal + wantsPercentGoal + savingsPercentGoal != 100) return false;

            return true;
        }

        private void CreateDefaultUser()
        {
            this.userName = "Creech";
            this.fileName = "default.json";
            this.needsPercentGoal = 50;
            this.wantsPercentGoal = 30;
            this.savingsPercentGoal = 20;
            this.totalMonthlyIncome = 0;
            this.needsDollarGoal = totalMonthlyIncome * (needsPercentGoal / 100.0);
            this.wantsDollarGoal = totalMonthlyIncome * (wantsPercentGoal / 100.0);
            this.savingsDollarGoal = totalMonthlyIncome * (savingsPercentGoal / 100.0);
            this.monthlyNeedsTotal = 0;
            this.monthlyWantsTotal = 0;
            this.monthlySavingsTotal = 0;

            // Initialize empty categories as defaults
            IncomeCats.Add(new MoneyCategory("Salary", "⚒️", 1000, true, IncomeCats.Count));
            IncomeCats.Add(new MoneyCategory("Money from mom", "🙏", 300, true, IncomeCats.Count));
            NeedsCats.Add(new MoneyCategory("Rent", "🏠", 400, true, NeedsCats.Count));
            NeedsCats.Add(new MoneyCategory("Food", "🍴", 200, true, NeedsCats.Count));
            WantsCats.Add(new MoneyCategory("Social", "🎈", 600, false, WantsCats.Count));
            SavingsCats.Add(new MoneyCategory("HYSA Deposit", "🤑", 100, true, SavingsCats.Count));

            Recalculate();
        }




        //category matching functions

        public string AllCatsList() {
            string allCats = "";
            for (int i = 0; i < IncomeCats.Count; i++) allCats += IncomeCats[i].title + ", ";
            for (int i = 0; i < NeedsCats.Count; i++) allCats += NeedsCats[i].title+ ", ";
            for (int i = 0; i < WantsCats.Count; i++) allCats += WantsCats[i].title + ", ";
            for (int i = 0; i < SavingsCats.Count; i++) allCats += SavingsCats[i].title + ", ";
            return allCats;
        }
        public char CheckStringInCats(string searchString)
        {
            if (IncomeCats.Any(category => category.title.Equals(searchString, StringComparison.OrdinalIgnoreCase)))
                return 'i'; 
            if (NeedsCats.Any(category => category.title.Equals(searchString, StringComparison.OrdinalIgnoreCase)))
                return 'n';
            if (WantsCats.Any(category => category.title.Equals(searchString, StringComparison.OrdinalIgnoreCase)))
                return 'w';
            if (SavingsCats.Any(category => category.title.Equals(searchString, StringComparison.OrdinalIgnoreCase)))
                return 's';  // Found in list4
            
            return 'x';  // Not found in any list
        }

    public void AddTransactionToCat(string searchString, Transaction pendingTransaction, char listChar)
    {

        MoneyCategory category = null;

        // Check which list to search in
        if (listChar == 'i')
        {
            category = IncomeCats.FirstOrDefault(cat => cat.title.Equals(searchString, StringComparison.OrdinalIgnoreCase));
        }
        else if (listChar == 'n')
        {
            category = NeedsCats.FirstOrDefault(cat => cat.title.Equals(searchString, StringComparison.OrdinalIgnoreCase));
        }
        else if (listChar == 'w')
        {
            category = WantsCats.FirstOrDefault(cat => cat.title.Equals(searchString, StringComparison.OrdinalIgnoreCase));
        }
        else if (listChar == 's')
        {
            category = SavingsCats.FirstOrDefault(cat => cat.title.Equals(searchString, StringComparison.OrdinalIgnoreCase));
        }
        else
        {
            Console.WriteLine("Invalid list character provided.");
            return;
        }

        if (category != null)
        {
            category.AddTransaction(pendingTransaction);
            Console.WriteLine($"Transaction added to {listChar.ToString().ToUpper()} category: {category.title}");
        }
        else
        {
            Console.WriteLine($"Category not found: {searchString}");
        }

        Recalculate(); 
    }



}
}