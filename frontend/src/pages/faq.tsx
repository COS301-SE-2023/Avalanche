import React, { useState } from "react";
import Sidebar from "@/components/Navigation/SideBar";
import Head from "next/head";
import { MainContent, Accordian} from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import  qAndAs  from "@/assets/faq"
import path from "path";
import fs from "fs";


interface IqAndA {
  question: string,
  answer: string[],
  image?: string 
}

export default function FAQPage() {
  const json = [...qAndAs];
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <>
      <Head>
        <title>FAQ Page</title>
      </Head>
      <Sidebar />
      <MainContent>
        <div className="flex justify-between items-center">
          <PageHeader
            title="FAQ"
            subtitle="Frequently Asked Questions"
            icon={<QuestionMarkCircleIcon className="h-16 w-16 text-black dark:text-white" />}
          />
        </div>
        <div>
          {json.map((item, index) => (
            <Accordian
              key={index}
              question={item.question}
              answer={item.answer}
              image={item.image}
              finalQ = {index == json.length-1? true: false}
              firstQ = {index == 0? true: false}
              sectionId={`section${index}`}
              toggleSection={toggleSection}
              activeSection={activeSection}
            />
          ))}
        </div>
      </MainContent>
    </>
  );
}

export async function getStaticProps() {
    try {
      const filePath = path.join(process.cwd(), "src/assets", "user-manual.json");
      const fileContents = fs.readFileSync(filePath, "utf8");
  
      return {
        props: {
          json: fileContents,
        },
      };
    } catch (error) {
      console.error("Failed to read the json file", error);
      return {
        props: {
          json: {},
        },
      };
    }
  }
