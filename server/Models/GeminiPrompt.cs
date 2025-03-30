using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace INNOVATE
{
    public class GeminiPrompt
    {
        public List<Content> contents { get; set; }

        public class Content
        {
            public List<Part> parts { get; set; }

            public Content() {
                parts = new List<Part>();
            }
        }

        public class Part
        {
            public string text { get; set; }
        }

        public GeminiPrompt(string input) {
            contents = new List<Content>();
            var content = new Content();
            content.parts.Add(new Part { text = input });
            contents.Add(content);
        }

         public string ToJson()
         {
            return JsonSerializer.Serialize(this);
         }

         
    }
}