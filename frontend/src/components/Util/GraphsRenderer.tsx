import { ChartType } from "@/Enums";
import { ChartCard } from "../Graphs";

export default function GraphsRenderer({ graphs }: any) {
  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
      {graphs?.length > 0 &&
        graphs.map((data: any, index: number) => {
          if (data?.data && data?.data.jsonData && data.data.jsonData.length>0) {
            const firstEntryKeys = Object.keys(data.data.jsonData[0]);
        if (firstEntryKeys.length == 2 && (data.data.jsonData[0].xAxis != 'Date' && data.data.jsonData[0].xAxis != 'Length' && data.data.jsonData[0].xAxis != 'word')) {
                return (
                    <ChartCard
                      title={data.graphName}
                      data={data}
                      defaultGraph={ChartType.PolarArea}
                      key={index}
                    />
                  );
            }else{
                return (
                    <ChartCard
                      title={data.graphName}
                      data={data}
                      defaultGraph={ChartType.Bar}
                      key={index}
                    />
                  );
            }
          }
        })}
    </div>
  );
}
