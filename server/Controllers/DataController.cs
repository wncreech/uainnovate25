using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Text.Json;

namespace INNOVATE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly string filePath = "data/userData.json";
        // GET: /api/data
        [HttpGet]
        public async Task<IActionResult> GetData()
        {
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "Data file not found." });
            }

            try
            {
                string jsonData = await System.IO.File.ReadAllTextAsync(filePath);
                return Ok(jsonData); // Return the JSON data
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error reading data.", error = ex.Message });
            }
        }

        // POST: /api/data
        [HttpPost]
        public async Task<IActionResult> SaveData([FromBody] object updatedData)
        {
            try
            {
                // Convert updated data to JSON and write to first.json
                string jsonData = JsonSerializer.Serialize(updatedData);
                await System.IO.File.WriteAllTextAsync(filePath, jsonData);
                return Ok(new { message = "Data saved successfully." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error saving data.", error = ex.Message });
            }
        }
    }
}