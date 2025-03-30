using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INNOVATE
{
    public class CategorizationPrompt : GeminiPrompt
    {
        private void ParseCatPrompt(string input, User user, Transaction transaction) {
            string context =
            "The sole purpose of this prompt is to categorize this expense into one of the provided categories.\n"
            + "Reply with ONLY the title of the category you decide. Please try to learn based on past prompts.\n"
            + $"Categories: [{user.AllCatsList()}]\n"
            + $"Cost: {transaction.amount:F2}"
            + $"Description: {transaction.description}";
            contents[0].parts[0].text = context;
        }
        public CategorizationPrompt(string input, User user, Transaction transaction) : base(input)
        {
            ParseCatPrompt(input, user, transaction);
        }
    }
}
