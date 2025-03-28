<script>
    import Header from "./components/Header.svelte";
    import StationMap from "./components/StationMap.svelte";
    import TrainLinesGraph from "./components/TrainLinesGraph.svelte";
    import TrainLinesTimeTable from "./components/TrainLinesTimeTable.svelte";
</script>

<Header></Header>
<main class="grid p-2 gap-2 grid-flow-col grid-rows-4">
    <!-- <div
        class="row-span-2 bg-slate-950 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <TrainLinesTimeTable></TrainLinesTimeTable>
    </div> -->
    <div
        class="row-span-4 bg-slate-950 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <StationMap></StationMap>
    </div>
    <!-- <div
        class="row-span-4 bg-slate-950 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <TrainLinesGraph></TrainLinesGraph>
    </div> -->
</main>

<style>
    main {
        height: calc(100vh - var(--header-height));
    }
</style>
