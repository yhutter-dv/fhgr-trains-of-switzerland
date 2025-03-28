<script>
    import { onMount } from "svelte";
    import maplibregl, { Marker } from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";

    const FAST_API_URL = import.meta.env.VITE_API_URL;

    let stationMarkers = [];

    async function populateMarkersFromStations(map) {
        console.log(FAST_API_URL);
        const response = await fetch(`${FAST_API_URL}/stations`);
        const stations = await response.json();
        for (let i = 0; i < stations.length; i++) {
            const station = stations[i];
            const longitude = station["longitude"];
            const latitude = station["latitude"];
            let marker = new Marker()
                .setLngLat([longitude, latitude])
                .addTo(map); // add the marker to the map
            stationMarkers.push(marker);
        }
    }

    onMount(async () => {
        const map = new maplibregl.Map({
            container: "map",
            style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [7.4474, 46.9481],
            zoom: 12,
        });
        await populateMarkersFromStations(map);
    });
</script>

<div
    class="row-span-2 bg-slate-950 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
>
    <div class="flex gap-2 place-content-between">
        <div>
            <p class="text-lg text-bold text-neutral-100">Delays per Station</p>
            <p class="text-md italic text-neutral-400">On Average</p>
        </div>
        <div class="self-start">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="size-5 stroke-2 stroke-neutral-300"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
            </svg>
        </div>
    </div>
    <div id="map" class="h-[80%] w-[100%] my-4 rounded-lg"></div>
</div>

<style>
</style>
