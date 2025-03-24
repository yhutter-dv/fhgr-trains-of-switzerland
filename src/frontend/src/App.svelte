<script>
    import Header from "./components/Header.svelte";
    import StationMap from "./components/StationMap.svelte";
    import TrainLinesGraph from "./components/TrainLinesGraph.svelte";
    import TrainLinesTimeTable from "./components/TrainLinesTimeTable.svelte";
</script>

<Header></Header>
<main class="grid p-2 gap-2 grid-flow-col grid-rows-4">
    <TrainLinesTimeTable></TrainLinesTimeTable>
    <StationMap></StationMap>
    <TrainLinesGraph></TrainLinesGraph>
</main>

<style>
    main {
        height: calc(100vh - var(--header-height));
    }
</style>
