interface IqAndA {
    question: string,
    answer: string[],
    image?: string // Optional field for image URLs
  }
  
  const qAndAs: IqAndA[] = [
    {
      question: "How do I sign up?",
      answer: [
        "1. Enter your first and last name.",
        "2. Enter your email address and confirm that it is correct by entering it again.",
        "3. Enter a password and confirm that it is correct by entering it again.",
        "4. Click 'Create an Account'."
      ],
      // image: "https://astonmartin.sloththe.dev/isawesome/2d55b0e8-2735-4bf2-8eb6-cc61e441f4d7.png"
    },
    {
      question: "What happens after signing up?",
      answer: ["You will be sent an email that contains a 6-digit verification code. Enter this code to continue." ,"Once the email is sent, you have 7 days to enter in this code."],
      //image: "https://astonmartin.sloththe.dev/isawesome/ff662ead-677f-4dec-ba7a-397b502e5688.png"
    },
    {
      question: "How do I log in?",
      answer: ["1. Enter the email address you created during registration.","2. Enter the password you created during registration.","3. Click the sign-in button. If the details are correct, you will be directed to the home page."]
      
    },
    {
      question: "What can I expect on the Homepage?",
      answer: ["When you log in, you will be taken to the homepage. On the homepage you wind find many cards. Press on a card and it will take you directly to that page"],
      
    },
    {
      question: "What can I expect on a dashboard?",
      answer: ["1. You will see a skeleton loader indicating that we are getting your graphs","2. After graphs have loaded, you will see the data appear in a graph format sutable for the data", "3. You can filter by pressing the filter icon", "4. You can zoom into the graph by pressing the magnifying glass icon", "5. You can download the data as a csv or raw json data by pressing the download button", "6. You can change the graph display, eg from a pie chart to a bar chart, by pressing the bar chart icon"],
      
    },
    {
      question: "How can I get to the integrate as a registrar page?",
      answer: ["When you log in for the first time, you will be prompted to press the I am a registrar button from our pop up. This will direct you to your data products page", "If you did not receive the pop up don't sweat, we have you covered. You can press the Are you a registrar? Integrate button on the navbar. Again it will take you to the data products page"]
      
    },
    {
      question: "How do I integrate as a registrar once I am on the data products page?",
      answer: ["1. You will press the Add a new Data Product button on the right of the page", "2. A pop up will appear where you will chose which registry to integrate with.", "3. Once you have chosen your registry, you will be prompted to provide your login credentials for your portal or epp login.", "4. You have the choice of either upgrading your personal account to a registrar or one of your user groups in your organisation.", "5. Once you have submitted you will authenticate with the epp and then your account will change from a public to a registar user for that registry.", "6. Once you close the pop up, you will see for that registry, you changed from a public user to a registrar user"]
      
    },
    // ... add all other questions and answers following the above format
  ];
  
  // Further expand with additional logic or props in accordions
  export default qAndAs;