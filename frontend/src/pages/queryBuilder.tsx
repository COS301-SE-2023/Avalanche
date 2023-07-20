import Sidebar from "@/components/Navigation/SideBar";
import PageHeader from "@/components/Util/PageHeader";
import { CubeIcon, HomeIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import Builder from "../components/QueryBuilder/Builder";

export default function QueryBuilder() {
  return (
    <>
      <Head>
        <title>Q-Bee</title>
      </Head>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Q-Bee"
            subtitle="Crafting your queries - effortless with QBee."
            icon={<CubeIcon className="h-16 w-16 text-black dark:text-white" />}
          />
        </div>
        <div style={{ height: '100vh', width: '100%' }}>
            <Builder></Builder>
        </div>
      </div>
    </>
  );
}
