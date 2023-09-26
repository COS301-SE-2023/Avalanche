import Sidebar from "@/components/Navigation/SideBar";
import { MainContent } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import fs from 'fs';
import Head from "next/head";
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default function HelpPage({ markdown }: any) {
  return (
    <>
      <Head>
        <title>Help Page</title>
      </Head>
      <Sidebar />
      <MainContent>
        <div className="flex justify-between items-center">
          <PageHeader title="Help" subtitle="Help and Documentation" icon={<QuestionMarkCircleIcon className="h-16 w-16 text-black dark:text-white" />} />
        </div>
        <div className="prose dark:prose-dark max-w-none text-black dark:text-white">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </MainContent>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'src/assets', 'user-manual.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      markdown: fileContents,
    },
  };
}