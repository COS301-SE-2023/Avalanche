interface IqAndA {
  question: string;
  answer: string[];
  image?: string; // Optional field for image URLs
}

const qAndAs: IqAndA[] = [
  {
    question: "What can I expect on the Homepage?",
    answer: [
      "When you log in, you will be taken to the homepage.",
      "On the homepage you wind find many cards.",
      "Press on a card and it will take you directly to that page",
    ],
  },
  {
    question: "How can I get to the Integrate as a Registrar Page?",
    answer: [
      "1. When you log in for the first time, you will be prompted to press the I am a registrar button from our pop up.",
      "2. This will direct you to your data products page",
      "3. If you did not receive the pop up don't sweat, we have you covered.",
      "4. You can press the 'Are you a registrar?' integrate button on the navbar.",
      "5. Again it will take you to the data products page",
    ],
  },
  {
    question:
      "How do I Integrate as a Registrar once I am on the Data Products Page?",
    answer: [
      "1. You will press the Add a new Data Product button on the right of the page",
      "2. A pop up will appear where you will chose which registry to integrate with.",
      "3. Once you have chosen your registry, you will be prompted to provide your login credentials for your portal or epp login.",
      "4. You have the choice of either upgrading your personal account to a registrar or one of your user groups in your organisation.",
      "5. Once you have submitted you will authenticate with the epp and then your account will change from a public to a registar user for that registry.",
      "6. Once you close the pop up, you will see for that registry, you changed from a public user to a registrar user",
    ],
  },
  {
    question:
      "How do I Create an Organisation?",
    answer: [
      "1. Navigate to the second tab of Settings",
      "2. Click Add Organisation",
      "3. Name your organisation",
      "4. Well done!"
    ],
  },
  {
    question:
      "How do I Create a User Group?",
    answer: [
      "1. Click Create User Group",
      "2. Name your User Group",
      "3. Well done!"
    ],
  },
  {
    question:
      "How do I Add Users to a User Group?",
    answer: [
      "1. Click Add User to User Group",
      "2. Decide which User Group to add a user to",
      "3. Invite the user by email",
      "3. Well done!"
    ],
  },
  {
    question: "What can I expect on a dashboard?",
    answer: [
      "1. You will see a skeleton loader indicating that we are getting your graphs",
      "2. After graphs have loaded, you will see the data appear in a graph format sutable for the data",
      "3. You can filter by pressing the filter icon",
      "4. You can zoom into the graph by pressing the magnifying glass icon",
      "5. You can download the data as a csv or raw json data by pressing the download button",
      "6. You can change the graph display, eg from a pie chart to a bar chart, by pressing the bar chart icon",
    ],
  },
  {
    question:
      "How do I Create a Custom Dashboard?",
    answer: [
      "1. Click on the 'Custom Dashboard' button",
      "2. Give your custom dashboard a name",
      "3. Add graph(s) to you dashboard",
      "4. Remember to save your dashboard with the button on the top right!"
    ],
  },
  {
    question:
      "How do I add a Graph to a Custom Dashboard?",
    answer: [
      "1. Click on the 'Add Graph' button",
      "2. Choose the Data Source",
      "3. Choose the type of graph",
      "4. Name your  graph",
      "5. Add graph",
      "4. Remember to save your dashboard!"
    ],
  },
  {
    question:
      "What can I do with my graphs on Custom Dashboards",
    answer: [
      "Filters can be applied to graphs on custom dashboards",
      "These filters will persist when your dashboard is saved",
      "You can also comment on graphs when zoomed into the graph",
      "These comments are also persisted"
    ],
  },
  {
    question:
      "What is Domain Watch",
    answer: [
      "A service that allows you to explore the domains across ZARC, AFRICA and RyCE.",
      "This acts as a brand protection tool that can analyse the similarity of your domain to other domains in the registries"
    ],
  },
  {
    question:
      "How do I make a Domain Watch Request",
    answer: [
      "1. Enter your domain string (without the zone)",
      "2. Choose you metrics and metric scores",
      "3. Decide whether you want to check whether matching domain resolve",
      "4. Check for matching domains"
    ],
  },
  {
    question:
      "What is Passive Domain Watch",
    answer: [
      "Passive domain watch is a passive version of active domain watch",
      "You will be notified as soon as a matching domain in the registry is created"
    ],
  },
  {
    question:
      "What can I access with the API key",
    answer: [
      "Only publicly accessible resources are available with the API key"
    ],
  },
];

// Further expand with additional logic or props in accordions
export default qAndAs;
