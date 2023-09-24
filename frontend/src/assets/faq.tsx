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
      //image: "https://astonmartin.sloththe.dev/isawesome/2d55b0e8-2735-4bf2-8eb6-cc61e441f4d7.png"
    },
    {
      question: "What happens after signing up?",
      answer: ["You will be sent an email that contains a 6-digit verification code. Enter this code to continue." ,"Once the email is sent, you have 7 days to enter in this code."],
      //image: "https://astonmartin.sloththe.dev/isawesome/ff662ead-677f-4dec-ba7a-397b502e5688.png"
    },
    // {
    //   question: "How do I log in?",
    //   answer: "1. Enter the email address you created during registration.\n2. Enter the password you created during registration.\n3. Click the sign-in button. If the details are correct, you will be directed to the dashboard.",
    //   //image: "https://astonmartin.sloththe.dev/isawesome/a00f9dc5-67ca-4492-a984-809f3ad1c53e.png"
    // },
    // {
    //   question: "What can I expect on the Homepage?",
    //   answer: "When you log in for the first time, you will be taken to the homepage. This is an example of what a dashboard would look like. Each graph can be interacted with in isolation.",
    //   //image: "https://github.com/COS301-SE-2023/Avalanche/assets/77788584/afcb4263-6c48-4f9f-b77d-f5a2f5589a2a"
    // },
    // ... add all other questions and answers following the above format
  ];
  
  // Further expand with additional logic or props in accordions
  export default qAndAs;