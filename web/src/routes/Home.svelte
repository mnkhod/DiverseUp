<script>
  import { Link } from "svelte-navigator";
  import ConnectMetamask from '../lib/ConnectMetamask.svelte'
  import CreateSmartContractForm from '../lib/CreateSmartContractForm.svelte'
  import CreateExchangeForm from '../lib/CreateExchangeForm.svelte'
  import Snowflakes from 'magic-snowflakes'
  import { fade } from 'svelte/transition';

  let upgradeFormState = false;
  let tokenExchangeFormState = false;
  let metamaskState = false;

  const snowflakes = new Snowflakes({
      speed: 2,
      count: 25,
      wind: true,
      rotation: 3,
      zIndex: 10
  })
  const flakes = new Snowflakes({
      speed: 2,
      color: "#2450b5",
      count: 25,
      wind: true,
      rotation: 3,
      zIndex: 80
  })

  snowflakes.start()

  function handleUpgradeTokenFormBtn(event) {
      upgradeFormState = true

      flakes.start()
      flakes.show()
      snowflakes.stop()
      snowflakes.hide()
  }

  function handleExitBtn(event){
      upgradeFormState = false
      tokenExchangeFormState = false

      flakes.hide()
      flakes.stop()
      snowflakes.start()
      snowflakes.show()
  }

  function updateMetamaskUpdate(v){
     metamaskState = v 
  }


</script>

<main class="w-full min-h-screen bg-gray-800 flex flex-col justify-center items-center text-center snap-y snap-mandatory overflow-hidden">

  {#if upgradeFormState}
    <div class="absolute z-50 top-0 left-0 w-full h-screen overflow-hidden" in:fade out:fade >
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="text-5xl font-bold">Generating Smart Contracts</h1>
            <p class="py-6">Permissionless Token Upgrade Pattern for Evmos Chain</p>
            {#if metamaskState == false }
              <ConnectMetamask updateMetamaskUpdate={updateMetamaskUpdate} handleExitBtn={handleExitBtn} />
            {/if}

            {#if metamaskState == true }
              <CreateSmartContractForm handleExitBtn={handleExitBtn} />
            {/if}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center flex-col h-screen">
      <h1 class="text-9xl font-bold bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 text-transparent">Diverse Up</h1>

      <h2 class="text-white my-12 text-4xl font-extralight">Permissionless Token Upgrade Pattern for Evmos Chain</h2>

      <div class="w-8/12 flex justify-around w-full">
        <button class="btn btn-lg btn-info text-white capitalize font-normal text-xl" on:click={handleUpgradeTokenFormBtn}>Upgrade Token</button>
        <Link to="exchange" class="btn btn-lg btn-info text-white capitalize font-normal text-xl">Token Exchange</Link>
        <a href="https://mnkhod-dev.gitbook.io/diverse-up/" class="btn btn-outline border-4 btn-lg btn-info text-white capitalize font-normal text-xl">Read Doc</a>
      </div>

    </div>

    <div class="bg-transparent h-screen flex justify-center items-center">
      <div class="max-w-7xl mx-auto">
        <div class="rounded-2xl">
          <div class="max-w-xl mx-auto lg:max-w-none">
            <div class="text-center">
              <h1 class="text-6xl font-extrabold bg-clip-text bg-gradient-to-r from-blue-100 to-blue-600 text-transparent">Permissionless Service</h1>
            </div>
            <div class="mt-24 max-w-sm mx-auto grid grid-cols-1 gap-y-10 gap-x-20 sm:max-w-none lg:grid-cols-3">
              <div class="text-center sm:flex sm:text-left lg:block lg:text-center">
                <div class="sm:flex-shrink-0">
                  <div class="flex justify-center">
                    <svg class="text-blue-300 w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 36 36"><path fill="currentColor" d="M8 8.2h16v1.6H8zm0 8h8.086v1.6H8zm15.378-4H8v1.6h13.779l1.599-1.6zM12.793 29.072a2.47 2.47 0 0 0 2.195.824h7.803a.7.7 0 0 0 0-1.4h-7.803c-.911-.016-.749-.807-.621-1.052a3.962 3.962 0 0 0 .387-.915a1.183 1.183 0 0 0-.616-1.322a1.899 1.899 0 0 0-2.24.517c-.344.355-.822.898-1.28 1.426c.283-1.109.65-2.532 1.01-3.92a1.315 1.315 0 0 0-.755-1.626a1.425 1.425 0 0 0-1.775.793c-.432.831-3.852 6.562-3.886 6.62a.7.7 0 1 0 1.202.718c.128-.215 2.858-4.788 3.719-6.315c-.648 2.5-1.362 5.282-1.404 5.532a.869.869 0 0 0 .407.969a.92.92 0 0 0 1.106-.224c.126-.114.362-.385.957-1.076a62.093 62.093 0 0 1 1.703-1.921c.218-.23.35-.128.222.098a2.291 2.291 0 0 0-.33 2.274Z"></path><path fill="currentColor" d="M28 21.695V32H4V4h24v4.993l1.33-1.33a4.304 4.304 0 0 1 .67-.54V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V21.427a2.91 2.91 0 0 1-2 .268Z"></path><path fill="currentColor" d="m34.128 11.861l-.523-.523a1.898 1.898 0 0 0-.11-2.423a1.956 1.956 0 0 0-2.75.162L18.22 21.6l-.837 3.142a.234.234 0 0 0 .296.294l3.131-.847l11.692-11.692l.494.495a.371.371 0 0 1 0 .525l-4.917 4.917a.8.8 0 0 0 1.132 1.131l4.917-4.917a1.972 1.972 0 0 0 0-2.788Z"></path></svg>
                  </div>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                  <h3 class="text-md font-medium text-white">Smart Contract</h3>
                  <p class="mt-2 text-sm text-gray-200">Permissionless henceforth anyone can use</p>
                </div>
              </div>
              <div class="text-center sm:flex sm:text-left lg:block lg:text-center">
                <div class="sm:flex-shrink-0">
                  <div class="flex justify-center">
                    <svg class="text-blue-300 w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path></svg>
                  </div>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                  <h3 class="text-md font-medium text-white">OpenZeppelin ERC20 Presets</h3>
                  <p class="mt-2 text-sm text-gray-200">Presets are secure smart contracts of OpenZeppelin</p>
                </div>
              </div>
              <div class="text-center sm:flex sm:text-left lg:block lg:text-center">
                <div class="sm:flex-shrink-0">
                  <div class="flex justify-center">
                    <svg class="text-blue-300 w-12 h-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11h-2V9h2v2m2 0h2V9h-2v2m-.6 10H12v-3.5h-2V21H4V3h14v10.1c.3-.1.7-.1 1-.1c.3 0 .7 0 1 .1V1H2v22h12.5c-.5-.6-.9-1.3-1.1-2M14 7h2V5h-2v2m2 6.8V13h-2v2h.5c.5-.5 1-.9 1.5-1.2M8 5H6v2h2V5m0 4H6v2h2V9M6 19h2v-2H6v2m6-14h-2v2h2V5m-2 10h2v-2h-2v2m-2-2H6v2h2v-2m10 2v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2Z"></path></svg>
                  </div>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                  <h3 class="text-md font-medium text-white">Modular Architecture</h3>
                  <p class="mt-2 text-sm text-gray-200">Future ERC20 standards will be supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
</main>
