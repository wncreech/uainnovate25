using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace INNOVATE
{
    public class GeminiResponse
    {
        public List<Candidate> candidates { get; set; }

        public string ExtractText()
        {
            if (candidates?.Count > 0 && candidates[0]?.content.parts.Count > 0)
            {
                return candidates[0].content.parts[0].text;
            }
            return "No text found";
        }

        public static string SanitizeString(string input)
        {   
        // Use regex to remove all non-letters at the end
        return Regex.Replace(input, @"[^a-zA-Z]+$", "");
        }
    }

    public class Candidate
    {
        public Content content { get; set; }
    }

    public class Content
    {
        public List<Part> parts { get; set; }
    }

    public class Part
    {
        public string text { get; set; }
    }

}