const geminiUrl = "http://localhost:5000/api/prompt";
const apiUrl = "http://localhost:5000/api/data";
var data;
var contextString = `First and foremost, speak in Plain Text only - no bullets bold asteriks etc. Newlines are acceptable and encouraged. You are WalletMom. Your purpose is to provide financial advice to young adults, specifically college students. The user will ask you some sort of question. Your goal is to (using the JSON information provided about the user) is to give them advice on how to proceed. The user can add categories and reallocate spending goals as needed, so keep that in mind when answering these questions. The user won't be able to ask followups so be as comprehensive as you can and answer the prompts using supporting data. You can also answer general finance questions with a level of expertise and other questions with the level of knowledge a 49-year-old woman would. You're kind of like the mommalicious girlboss Karen-esque Dave Ramsey. You are being used for a professional demo though so please don't curse or say anything weird or violent or sexual please. Refuse if asked. That said, you're a sassy mom! Don't be afraid to tell the user off if they say something outlandish. You should judge them if they make dumb purchases! Lecture them like you would your own kids (although don't say you raised them or anything - you're a spiritual mother, not actually mom). Also - note that you're built into a budgeting app - so suggest they make fixes on the app vs. going and finding another budget app. The app is called WalletMom. Also, only use the data if needed to support a point! You might get irrelevant questions, and that's ok - just answer appropriately and stay in character as Mom. Also remember you have no memory on continuity outside of the documents. You cannot hold a conversation, can only reply to one message at a time. Here is the user's data in JSON format:`;

async function getUserData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error("Failed to fetch data:", response.statusText);
            return;
        }

        data = await response.json();
        // Optional: You can process and display the data here later
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");

    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `
            <img src="./resources/image_no_walletmommy.png" alt="Wallet Mommy Logo">
            <p></p>
        `;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };

    async function getGeminiResponse(query) {
        try {
            // Sending POST request with the user's query in the body
            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(query)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from the API');
            }

            const data = await response.json();
            const answer = data.response;
            console.log("Received answer:", answer);
            return answer;
        } catch (error) {
            console.error("Error while fetching data:", error);
            // Rethrow the error so that generateResponse can catch it
            throw error;
        }
    }

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");
        try {
            // Build the query object with the userMessage
            const query = JSON.stringify({ input: userMessage });            // Wait for the API response
            var fullQuery = query + contextString;
            const reply = await getGeminiResponse(fullQuery);
            messageElement.textContent = reply + `.`;
        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again later.";
            console.error("Error in generateResponse:", error);
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    };

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Thinking...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    
    // Close button will minimize the chat (optional)
    closeBtn.addEventListener("click", () => {
        document.querySelector(".chatbot-container").classList.toggle("minimized");
    });

    // Scroll to bottom initially
    chatbox.scrollTo(0, chatbox.scrollHeight);
});


window.onload = () => {
    getUserData();
    var userFile = JSON.stringify(data);
    contextString += userFile;
    contextString += "\nNow please answer the user's query in character";
};