<script>
    import Header from "./components/Header.svelte";
</script>

<Header></Header>
<main class="grid p-2 gap-2 grid-flow-col grid-rows-4">
    <div
        class="row-span-2 bg-slate-900 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <div class="flex gap-2 place-content-between">
            <div>
                <p class="text-lg text-bold text-neutral-100">
                    Delays per Station
                </p>
                <p class="text-md italic text-neutral-400">
                    Of a specific line
                </p>

                <p class="text-neutral-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Earum dolor neque minus minima vitae cumque omnis, fugiat
                    laudantium velit similique reiciendis iusto! Dolorum
                    deserunt unde est, blanditiis doloremque exercitationem
                    reiciendis.
                </p>
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
    </div>
    <div
        class="row-span-2 bg-slate-900 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <div class="flex gap-2 place-content-between">
            <div>
                <p class="text-lg text-bold text-neutral-100">
                    Delays per Station
                </p>
                <p class="text-md italic text-neutral-400">On Average</p>

                <p class="text-neutral-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Earum dolor neque minus minima vitae cumque omnis, fugiat
                    laudantium velit similique reiciendis iusto! Dolorum
                    deserunt unde est, blanditiis doloremque exercitationem
                    reiciendis.
                </p>
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
    </div>
    <div
        class="row-span-4 bg-slate-900 p-4 rounded-md border border-slate-600 duration-300 ease-out hover:border-emerald-600"
    >
        <div class="flex gap-2 place-content-between">
            <div>
                <p class="text-lg text-bold text-neutral-100">
                    Delays per Line
                </p>
                <p class="text-md italic text-neutral-400">On Average</p>

                <p class="text-neutral-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Earum dolor neque minus minima vitae cumque omnis, fugiat
                    laudantium velit similique reiciendis iusto! Dolorum
                    deserunt unde est, blanditiis doloremque exercitationem
                    reiciendis.
                </p>
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
    </div>
</main>

<style>
    main {
        height: calc(100vh - var(--header-height));
    }
</style>
