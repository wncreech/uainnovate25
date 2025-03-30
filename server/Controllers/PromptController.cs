using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Text.Json;

namespace INNOVATE;

[ApiController]
[Route("api/[controller]")]
public class PromptController : ControllerBase
{
    // POST: /api/prompt
    [HttpPost]
    public async Task<IActionResult> ProcessGeminiPrompt([FromBody] string input)
    {
        try 
        {
            if (string.IsNullOrEmpty(input))
                return BadRequest("Input cannot be empty");
                
            // Trim any whitespace from the input
            input = input.Trim();
            
            GeminiPrompt prompt = new GeminiPrompt(input);
            string json = prompt.ToJson();
            
            string response = await GeminiAPIHelper.MakeApiRequestAsync(json);
            
            if (response.StartsWith("Error"))
                return StatusCode(500, response);
                
            GeminiResponse reply = JsonSerializer.Deserialize<GeminiResponse>(response);
            string answer = GeminiResponse.SanitizeString(reply.ExtractText());
            return Ok(new { response = answer });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}