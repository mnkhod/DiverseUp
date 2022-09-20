<script>
  import { Link,useParams } from "svelte-navigator";
  import CreateExchangeForm from '../lib/CreateExchangeForm.svelte'
  import Snowflakes from 'magic-snowflakes'
  import { fade } from 'svelte/transition';

  import Swal from "sweetalert2";
  import { ethers } from "ethers";
  import TokenExchangeAbi from "../../abi/contracts/TokenExchange.sol/TokenExchange.json";
  import IERC20TokenAbi from "../../abi/contracts/IERC20Token.sol/IERC20Token.json";

  let metamaskState = false;
  const params = useParams();

  /* $: exchangeAddress = $params.exchangeAddress; */
  /* $: oldTokenAddress = $params.oldTokenAddress; */
  /* $: newTokenAddress = $params.newTokenAddress; */

  const flakes = new Snowflakes({
      speed: 2,
      color: "#2450b5",
      count: 25,
      wind: true,
      rotation: 3,
      zIndex: 80
  })

  flakes.start()

  function updateMetamaskUpdate(v){
     metamaskState = v 
  }

  let adminUiState = false;
  let tabIndex = "deposit";
  // Token v1 - 0x582f598539dB91e3349b14f3B2459AA84deAb480
  // Token v2 - 0x2410363DE6EB8A5105d5Bd96345887659c4f1c1F
  // Exchange - 0x323335ea766744E53e7695D18d4Ab52773eD7F5E
  let exchangeAddress = "";
  let oldTokenAddress = "";
  let newTokenAddress = "";
  let amountInput = undefined;
  console.log(exchangeAddress)

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let deployBtnLoading = false;
  let depositBtnLoading = false;
  let withdrawBtnLoading = false;

  function updateAdminUiState(state) {
    if (exchangeAddress != "") {
      if (ethers.utils.isAddress(exchangeAddress)) {
        adminUiState = state;
      } else {
        errorAlert("Address isn't correct!");
      }
    } else {
      errorAlert("Exchange input empty!")
    }
  }

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

  function updateTabIndex(val){
    tabIndex = val;
  }

  async function handleDeposit() {
    depositBtnLoading = true;

    try {
      const exchangeContract = new ethers.Contract(
        exchangeAddress,
        TokenExchangeAbi,
        provider
      );
      const erc20TokenContract = new ethers.Contract(
        oldTokenAddress,
        IERC20TokenAbi,
        provider
      );
      const tokenContract = erc20TokenContract.connect(signer);
      const exContract = exchangeContract.connect(signer);

      let amountBN = ethers.utils.parseEther(amountInput.toString(),"18")
      await (await tokenContract.approve(exchangeAddress,amountBN)).wait()
      await (await exContract.deposit(amountBN)).wait()

      successAlert("Successfully Deposited Token")
    }catch (e){
      console.log(e)
      errorAlert("Check console log!")
    }

    oldTokenAddress = "";
    newTokenAddress = "";
    amountInput = undefined;
    depositBtnLoading = false;
  }

  async function handleWithdraw() {
    withdrawBtnLoading = true;

    try {
      const exchangeContract = new ethers.Contract(
        exchangeAddress,
        TokenExchangeAbi,
        provider
      );
      const erc20TokenContract = new ethers.Contract(
        newTokenAddress,
        IERC20TokenAbi,
        provider
      );
      const tokenContract = erc20TokenContract.connect(signer);
      const exContract = exchangeContract.connect(signer);

      let amountBN = ethers.utils.parseEther(amountInput.toString(),"18")
      await (await tokenContract.approve(exchangeAddress,amountBN)).wait()
      await (await exContract.withdraw(amountBN)).wait()

      successAlert("Successfully Withdraw Token")
    }catch (e){
      console.log(e)
      errorAlert("Check console log!")
    }

    oldTokenAddress = "";
    newTokenAddress = "";
    amountInput = undefined;
    withdrawBtnLoading = false;
  }

  function errorAlert(content) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: content,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function successAlert(content) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: content,
      showConfirmButton: false,
      timer: 1500,
    });
  }

</script>

<main class="w-full min-h-screen bg-gray-800 flex flex-col justify-center items-center text-center snap-y snap-mandatory overflow-hidden">
    <div class="absolute z-50 top-0 left-0 w-full h-screen overflow-hidden" in:fade out:fade >
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="text-5xl font-bold">Token Exchange</h1>
            <p class="py-6">Diverse Up Token Exchange Admin UI</p>
            {#if metamaskState == false }
              <div class="flex gap-5 justify-center">
                <button
                  class="btn btn-lg btn-info text-white capitalize font-normal text-xl"
                  on:click={handleMetamaskConnection}>Connect Metamask</button
                >
                <Link
                  class="btn btn-outline border-3 btn-lg btn-info text-white capitalize font-normal text-xl"
                  to="/">Exit</Link
                >
              </div>
            {/if}

            {#if metamaskState == true }
              <div class="flex flex-col items-center gap-5">
                {#if adminUiState == false}
                  <div class="form-control w-full max-w-xs">
                    <label class="label" for="exchangeAddress">
                      <span class="label-text">Exchange Address</span>
                    </label>
                    <input
                        type="text"
                        bind:value={exchangeAddress}
                        id="exchangeAddress"
                        placeholder="0xAb..."
                        class="input input-bordered w-full max-w-xs"
                        />
                  </div>
                  <div class="flex gap-5 justify-center">
                    <button
                        class={`btn ${
                        deployBtnLoading ? "loading" : ""
                        } btn-lg btn-info text-white capitalize font-normal text-xl`}
                        on:click={updateAdminUiState}>Create Admin UI</button
                      >
                      <Link class="btn btn-outline border-3 btn-lg btn-info text-white capitalize font-normal text-xl" to="/">Exit</Link>
                        
                  </div>
                {/if}

                {#if adminUiState}
                  <div class="tabs">
                    <p class={`tab tab-lifted ${tabIndex == "deposit" ? "tab-active" : ""}`} on:click={() => { updateTabIndex("deposit") }}>Deposit</p> 
                    <p class={`tab tab-lifted ${tabIndex == "withdraw" ? "tab-active" : ""}`} on:click={() => { updateTabIndex("withdraw") }}>Withdraw</p> 
                  </div>

                  {#if tabIndex == "deposit"}
                    <div class="form-control w-full max-w-xs">
                      <label class="label" for="oldTokenAddress">
                        <span class="label-text">Original Token Address</span>
                      </label>
                      <input
                          type="text"
                          bind:value={oldTokenAddress}
                          id="tokenAddress"
                          placeholder="0xAb..."
                          class="input text-center input-bordered w-full max-w-xs"
                          />
                    </div>
                  {/if}

                  {#if tabIndex == "withdraw"}
                    <div class="form-control w-full max-w-xs">
                      <label class="label" for="newTokenAddress">
                        <span class="label-text">Upgraded Token Address</span>
                      </label>
                      <input
                          type="text"
                          bind:value={newTokenAddress}
                          id="newTokenAddress"
                          placeholder="0xAb..."
                          class="input text-center input-bordered w-full max-w-xs"
                          />
                    </div>
                  {/if}

                  <div class="form-control w-full max-w-xs">
                    <label class="label" for="amount">
                      <span class="label-text">Amount</span>
                    </label>
                    <input
                        type="number"
                        bind:value={amountInput}
                        id="amount"
                        placeholder="0"
                        class="input text-center input-bordered w-full max-w-xs"
                        />
                  </div>
                  <div class="flex flex-col gap-5 justify-center w-full">
                    {#if tabIndex == "deposit"}
                      <button
                          class={`btn ${
                          depositBtnLoading ? "loading" : ""
                          } btn-success text-white capitalize font-normal text-xl`}
                          on:click={handleDeposit}>Deposit</button
                        >
                    {/if}

                    {#if tabIndex == "withdraw"}
                      <button
                          class={`btn ${
                          withdrawBtnLoading ? "loading" : ""
                          } btn-error text-white capitalize font-normal text-xl`}
                          on:click={handleWithdraw}>Withdraw</button
                        >
                    {/if}
                    <Link class="btn btn-outline border-3 btn-info text-white capitalize font-normal text-xl"
                        to="/">Exit</Link>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

</main>
