import GraphErrors from "./GraphErrors";
import GraphsRenderer from "./GraphsRenderer";
import LoadingGrid from "./LoadingGrid";

export default function DashboardBase({ state }: any) {
    return <div className="p-0 pt-4 md:p-4">
        {state.loading && <LoadingGrid />}
        {state.graphs.length === 0 && state.error && <GraphErrors error={state.error} />}
        {state.graphs?.length > 0 && !state.loading && <GraphsRenderer graphs={state.graphs} />}
    </div>
}