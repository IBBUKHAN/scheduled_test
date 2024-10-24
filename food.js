import { universities } from "src/add-on/universities";

// const CampUniversities = universities
//   .filter((elem) => elem.status && !elem.hasCampus)
//   .filter(
//     (elem) =>
//       universities.filter((e) => e.displayName == elem.displayName).length == 1
//   )
//   .map((elem) => elem.displayName)
//   .join(",");

const handleGetAccomodationDeclaration = {
  name: "handle_get_accommodation",
  description: `Gets triggered when all the required parameters have been provided by the student
      - student_name
      - university_college_name
      - campus_name
      - city
      - room_type
      - budget
      - rent_type
      NOTE:- If user says week or month it should be considered as WEEKLY or MONTHLY.
            `,
  parameters: {
    type: "object",
    properties: {
      student_name: {
        type: "string",
        description: `Name provided by the student, and also if the student_name is changed, update the student_name accordingly. If not provided, trigger "handle_get_missing_values"`,
      },
      university_college_name: {
        type: "string",
        description: `Full name of the university/college for which the student wants the accomodation. if not provided, trigger "handle_get_missing_values"`,
      },
      campus_name: {
        type: "string",
        description: `Name of the campus of the university. if not provided, trigger "handle_get_missing_values"`,
      },
      city: {
        type: "string",
        description: `Name of the city for which the student wants the accomodation. null if not provided`,
      },
      room_type: {
        type: "string",
        description: `Type of the room that is required by the student. if not provided, trigger "handle_get_missing_values"`,
        enum: ["Ensuite", "Studio", "Apartments"],
      },
      budget: {
        type: "string",
        description: `Budget of the student under which they want the accomodation. For example: <x, >x, =x, x<y. if not provided, trigger "handle_get_missing_values`,
      },
      rent_type: {
        type: "string",
        description: `Type of rent provided by the student, and also considered week = WEEKLY and month = MONTHLY. If not provided, trigger "handle_get_missing_values"`,
        enum: ["WEEKLY", "MONTHLY"],
      },
    },
    required: [
      "student_name",
      "university_college_name",
      "campus_name",
      "city",
      "room_type",
      "budget",
      "rent_type",
    ],
  },
};

const handleGetMissingValuesDeclaration = {
  name: "handle_get_missing_values",
  description: `This function is triggered when any required value is missing in the "handle_get_accommodation" process.
            The flow for collecting values is strictly prioritized as follows: 
            1. student_name
            2. university_college_name
            3. campus_name (only if university_college_name is provided)
            4. room_type
            5. budget
            6. rent_type

            NOTE: If any one of them is already provided proceed directly to the next step.
            
            Once all the required_value are provided, trigger "handle_get_accommodation".

            IMPORTANT: Never use placeholders anywhere, if data is not available, just ask the user.
           
            If the city is provided or student want accomodation near or in a city, university_college_name and campus_name will be skipped, and the flow will proceed directly to room_type. 
            For example: If the student says "I want a room in London," the flow should ask for student_name, then room_type, budget, and finally rent_type.
            For example: If the student says "my name is ss, i am looking for accom near new york and my budget is 4000/month" the flow should ask for room_type and finally rent_type.
            For example: If the student says "I want accom near kcl", the flow should ask for student_name (if not provided), then campus_name, room_type, budget, and finally rent_type.
            For example: If city is in lowercase always considered as city such as new york.
            
            NOTE: If user provide the property_name then direct trigger "handle_get_property" don't need to ask student_name.
            Additionally, if the student mentions 'week' or 'month' when discussing rent, these should be interpreted as WEEKLY or MONTHLY, respectively.
            
            NOTE: If the student provides a university_college_name along with a city, treat it as a university.
            For example: "I am looking for a room near Amity University Noida" → (required_value: <next required_value>, university_college_name: "Amity University Noida"). 
            
            Example 1: "I want accomodation/room/apartment/housing" -> handle_get_missing_values (required_value: <next required_value>).
            Example 2: "my name is <student_name>" -> handle_get_missing_values (required_value: <next required_value>, student_name: <student_name>).
            Example 3: "<university_college_name> college" -> handle_get_missing_values (required_value: <next required_value>, university_college_name: <university_college_name>).
            Example 4: "need to change name" -> handle_get_missing_values (required_value: <student_name>).`,

  parameters: {
    type: "object",
    properties: {
      required_value: {
        type: "string",
        description:
          "The name of the next required value that needs to be collected next based on the priority order. It should never be null or unknown and it always be present.",
      },
      student_name: {
        type: "string",
        description: `The name of the student. If it changes during the process, update accordingly. Default is null if not provided.`,
      },
      university_college_name: {
        type: "string",
        description: `The full name of the university or college where the student seeks accommodation. Must be provided for campus_name to be asked. Default is null if not provided.
                      Example: "KCL", "Windsor college", "Toronto School of Management", Kingston University`,
      },
      campus_name: {
        type: "string",
        description: `The name of the campus, only asked if university_college_name is provided. Should always be formatted as "university_college_name - campus_name". Default is null if not provided.
                      Example: "King’s College London (KCL) - Knights Park Campus"`,
      },
      city: {
        type: "string",
        description: `The city where the student wants accommodation. If provided, university_college_name and campus_name are skipped. Default is null if not provided.`,
      },
      room_type: {
        type: "string",
        description: `The type of room the student requires. 
                      Options are: Ensuite, Studio, or Apartments.`,
        enum: ["Ensuite", "Studio", "Apartments"],
      },
      budget: {
        type: "string",
        description: `The student's budget for accommodation. The format could be expressed as <x, >x, =x, or x<y.`,
      },
      rent_type: {
        type: "string",
        description: `The type of rent preferred by the student. 'Week' should be interpreted as WEEKLY and 'Month' as MONTHLY.`,
        enum: ["WEEKLY", "MONTHLY"],
      },
    },
    required: [
      "required_value",
      "student_name",
      "university_college_name",
      "campus_name",
      "city",
      "room_type",
      "budget",
      "rent_type",
    ],
  },
};

const handleGreetingsDeclaration = {
  name: "handle_greetings",
  description: `Handles the greetings/small talks initiated by the student. Like Hi, Hello etc.
            Student telling his name doesn't fall in this category`,
  parameters: {
    type: "object",
    properties: {
      student_message: {
        type: "string",
        description:
          "message of the student. For example: Hi => student_message: Hi",
      },
    },
    required: ["student_message"],
  },
};

const handleGetPropertyDeclaration = {
  name: "handle_get_property",
  description: `This function is triggered in two cases:
    1. When only property_name is provided.
    2. When property_name, room_type, budget, and rent_type are all provided.

    Note: If 'rent_type' is not provided, directly trigger "handle_get_missing_property".
    Note: Interpret "week" or "month" as "WEEKLY" or "MONTHLY".
    
    IMPORTANT: If only room_type or any other single value (besides property_name) is provided, do not trigger this function.
  
    Example:
   "I want a room in IQ City" → Activates this function.`,

  parameters: {
    type: "object",
    properties: {
      property_name: {
        type: "string",
        description: `The name of the property provided by the student. For Example :- IQ City, IQ Shoreditch, IQ Bloomsbury.`,
      },
      room_type: {
        type: "string",
        description: `Type of room required by the student. Options include Ensuite, Studio, and Apartments. If not provided, trigger "handle_get_missing_property"`,
        enum: ["Ensuite", "Studio", "Apartments"],
      },
      budget: {
        type: "string",
        description: `The budget within which the student wants accommodation. Examples: <x, >x, =x, x<y. It should always be in string.`,
      },
      rent_type: {
        type: "string",
        description: `The type of rent specified by the student. Options include WEEKLY and MONTHLY, and also considered week = WEEKLY and month = MONTHLY.`,
        enum: ["WEEKLY", "MONTHLY"],
      },
      show_offers: {
        type: "boolean",
        description: `Indicates whether the student is looking for special offers related to the property.`,
        default: false,
      },
      show_amenities: {
        type: "boolean",
        description: `Indicates whether the student is interested in amenities related to the property.`,
        default: false,
      },
      show_description: {
        type: "boolean",
        description: `Indicates whether the student is interested in a description related to the property.`,
        default: false,
      },
      student_name: {
        type: "string",
        description: "The name of the student",
      },
    },
    required: [
      "property_name",
      "room_type",
      "budget",
      "rent_type",
      "show_offers",
      "show_amenities",
      "show_description",
      "student_name",
    ],
  },
};

const handleGetMissingProperty = {
  name: "handle_get_missing_property",
  description: `This function is triggered only when 'property_name' and 'room_type' are provided.
            The flow for collecting values is strictly prioritized as follows: :         
            1. budget
            2. rent_type
 
            Special Cases:
            - If 'budget' and 'rent_type' are both available, trigger "handle_get_property".
            - If 'property_name' and 'budget' are provided, collect the missing 'room_type' and then 'rent_type' (if not already provided).
            - If the user mentions 'week' or 'month', interpret them as WEEKLY or MONTHLY.

            Example:
            - "Need stay at IQ City with 120/week budget" → handle_get_missing_property (required_value: <next required_value>, property_name: "IQ City", budget: 120, rent_type: WEEKLY).
            - "I want ensuite room in IQ City" → handle_get_missing_property (required_value: <next required_value>, property_name: <property_name>, room_type: "ensuite").
            `,
  parameters: {
    type: "object",
    properties: {
      required_value: {
        type: "string",
        description:
          "name of the value which is required from the student based on the priority.",
        enum: ["budget", "rent_type"],
      },
      property_name: {
        type: "string",
        description: `The name of the property provided by the student. Example: IQ City, IQ Shoreditch, IQ Bloomsbury.`,
      },
      room_type: {
        type: "string",
        description: `The type of room required by the student. Options include Ensuite, Studio, and Apartments. If not provided, trigger "handle_get_property".`,
        enum: ["Ensuite", "Studio", "Apartments"],
      },
      budget: {
        type: "string",
        description: `The budget for the accommodation, specified in a format such as <x, >x, =x, or x<y. Default value is null if not provided, and it should always be in string.`,
      },
      rent_type: {
        type: "string",
        description: `The rent period preferred by the student, either WEEKLY or MONTHLY. week = WEEKLY and month = MONTHLY. Default value is null if not provided.`,
        enum: ["WEEKLY", "MONTHLY"],
      },
      student_name: {
        type: "string",
        description: "The name of the student",
      },
    },
    required: [
      "required_value",
      "property_name",
      "room_type",
      "budget",
      "rent_type",
      "student_name",
    ],
  },
};

const handle_fallback = {
  name: "handle_fallback",
  description: `Creates a fallback message for a failure type in case of any failure.
  The following are the failure types:
  - API_ERROR: When the API fails to execute.
  - AI_ERROR: When the AI is unable to perform the required task.
  `,
  parameters: {
    type: "object",
    properties: {
      rephrased_questions: {
        type: "array",
        description: `Message to the user apologizing for the inconvenience and asking if they would like to connect to a live agent.
        It must be an array of question which has same meaning but are rephrases in different words.
        IMPORTANT: Number of rephrases: 5
        It must be an array of objects.

        IMPORTANT: Use "’" instead of "'" everywhere.
        NOTE: Use the student's name to make the message more personal.
        NOTE: Don't ask for budget in a particular format. Just simply ask for their budget.
        NOTE: Don't use any emoji's. Be professional.
        NOTE: Format the message by using </br> tag.`,
        items: {
          type: "object",
          properties: {
            question: {
              type: "string",
            },
          },
        },
        nullable: false,
      },
    },
    required: ["rephrased_questions"],
  },
};

const handleViewDetails = (userData) => {
  return {
    name: "handle_view_details",
    description: `Handles the options selected by the user for a particular property.
Following are the options that user can select:
${
  userData
    ? Object.entries(userData).reduce((acc, elem) => {
        acc += `${elem[0]}: ${elem[1]}\n`;
        return acc;
      }, "")
    : `1: Property Description
       2: Property Images, Videos and VR view
       3: Distance of Property
       4: Ongoing offers
       5: Ratings and Reviews
       6: Amenities
       7: Payment info
       8: Cancellation Policy`
}`,
    parameters: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: `Id of the property selected by the user. For Example property_id:-> 65e6dbd183d07682456e00f9`,
        },
        selected_option_id: {
          type: "number",
          description:
            "Id of the option selected by the user, it should never be null",
        },
        selected_option_name: {
          type: "string",
          description: "name of the option selected by the user",
        },
        student_name: {
          type: "string",
          description: "The name of the student",
        },
      },
      required: ["property_id", "selected_option_id", "selected_option_name"],
    },
  };
};

export {
  handleGetAccomodationDeclaration,
  handleGetMissingValuesDeclaration,
  handleGreetingsDeclaration,
  handleGetMissingProperty,
  handleViewDetails,
  handleGetPropertyDeclaration,
  handle_fallback,
};
