using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace INNOVATE
{
    public class GeminiAPIHelper
    {
    public static async Task<string> MakeApiRequestAsync(string json)
    {
        string apiKey = "AIzaSyA--kPxviB9W2Z3QAnOoBo19cryc8y0cyA"; // Replace with your actual Gemini API key
        string apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
        using (var client = new HttpClient())
        {
            try
            {
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request to the API
                HttpResponseMessage responseMessage = await client.PostAsync(apiUrl, content);

                // Ensure we received a successful response
                responseMessage.EnsureSuccessStatusCode();

                // Read the response content as a string
                string responseContent = await responseMessage.Content.ReadAsStringAsync();

                return responseContent;
            }
            catch (Exception ex)
            {
                return $"Error making API request: {ex.Message}";
            }
        }
    }
    }
}
