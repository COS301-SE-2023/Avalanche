import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

import ParentNode from "./ParentNode";
import SelectorNode from "./SelectorNode"

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { parentNode: ParentNode, selectorNode: SelectorNode };

function Star() {
  const initialNodes: Node[] = [
    {
      id: "fact",
      type: "parentNode",
      position: { x: 50, y: 50 },
    style: {
      width: 170,
      height: 140,
    },
      data: {
        value: 123,
        heading: "Select Data",
        description: "This is a cool description",
        
      },
    },
    {
        id: "dim1",
        type: "selectorNode",
        position: { x: 10, y: 10 },
        parentNode: 'fact',
        extent: 'parent',
        data: {
          value: 123,
          heading: "Test",
          description: "Column Name",
          
        },
      },
  ];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
  );
}

export default Star;
