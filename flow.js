// Sample code for a basic room booking flow with entity extraction

// Dialogue Manager
function handleUserInput(input, context) {
  switch (context.stage) {
    case "INIT":
      // If the conversation is at the initial stage
      if (input.toLowerCase().includes("book a room")) {
        // If the user wants to book a room, proceed to entity extraction
        context.stage = "ENTITY_EXTRACTION";
        return "Sure! Please specify the type of room and duration.";
      } else {
        // If the user's input doesn't match the expected pattern, handle appropriately
        return "I'm sorry, I can only help with room bookings.";
      }
    case "ENTITY_EXTRACTION":
      // If the conversation is in the entity extraction stage
      const extractedEntities = extractEntities(input);
      if (extractedEntities.roomType && extractedEntities.duration) {
        // If room type and duration are successfully extracted, save them to the context
        context.bookingDetails.roomType = extractedEntities.roomType;
        context.bookingDetails.duration = extractedEntities.duration;
        context.stage = "AVAILABILITY_CHECK";
        return `Great! You want to book a ${extractedEntities.roomType} room for ${extractedEntities.duration} days. Let me check availability...`;
      } else {
        // If room type and/or duration couldn't be extracted, handle appropriately
        return "I'm sorry, I couldn't extract the room type and duration from your input. Please specify them (e.g., '5-star room for 2 days').";
      }
    // Other cases and stages go here
    default:
      return "I'm sorry, I didn't understand that.";
  }
}

// Function to extract entities (room type and duration) using regex
function extractEntities(input) {
  const roomTypeRegex = /(\d+)\s*-\s*star\s+room/i;
  const durationRegex = /for\s+(\d+)\s+day/i;
  const roomTypeMatch = input.match(roomTypeRegex);
  const durationMatch = input.match(durationRegex);
  return {
    roomType: roomTypeMatch ? `${roomTypeMatch[1]}-star` : null,
    duration: durationMatch ? parseInt(durationMatch[1]) : null,
  };
}

// Function to simulate the chat flow
function startBookingFlow() {
  const context = {
    stage: "INIT", // Initial stage of the conversation
    bookingDetails: {
      roomType: "", // Placeholder for room type
      duration: 0, // Placeholder for duration
    },
  };

  console.log("Chatbot: Hi! How can I assist you today?");
  process.stdin.on("data", function (input) {
    input = input.toString().trim();
    const response = handleUserInput(input, context); // Pass the input and context to the dialogue manager
    console.log("User:", input);
    console.log("Chatbot:", response);
    // Handle the completion or cancellation of the conversation
    if (context.stage === "COMPLETE" || context.stage === "CANCELLED") {
      process.exit(); // Exit the process if the conversation is complete or cancelled
    }
  });
}

// Start the booking flow
startBookingFlow();
