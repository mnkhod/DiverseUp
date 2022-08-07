<script>
  export let updateMetamaskUpdate,handleExitBtn;

  async function handleMetamaskConnection() {
    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.selectedAddress == undefined) {
        await ethereum.request({ method: "eth_requestAccounts" });
        updateMetamaskUpdate(true)
      } else {
        updateMetamaskUpdate(true)
      }
    }
  }
</script>

<main>
  <div class="flex gap-5 justify-center">
    <button
      class="btn btn-lg btn-info text-white capitalize font-normal text-xl"
      on:click={handleMetamaskConnection}>Connect Metamask</button
    >
    <button
      class="btn btn-outline border-3 btn-lg btn-info text-white capitalize font-normal text-xl"
      on:click={handleExitBtn}>Exit</button
    >
  </div>
</main>
