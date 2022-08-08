<script>
  import Swal from 'sweetalert2'
  import { ethers } from "ethers"
  import ContractAddress from '../../address.json'
  import PausibleProxyAbi from '../../abi/contracts/PausibleProxy.sol/PausibleProxy.json'

  export let handleExitBtn;

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  let deployBtnLoading = false;

  let tokenPresetOptions = "Pausible";
  let oldTokenAddress = ""
  let tokenName = ""
  let tokenSymbol = ""
  let adminAddress = window.ethereum.selectedAddress

  let newTokenAddress = ""
  let exchangeAddress = ""

  async function handleCreateToken(){
      // Mock Token Address - 0x582f598539dB91e3349b14f3B2459AA84deAb480
      deployBtnLoading = true

      try{
        const pausibleProxyContract = new ethers.Contract(ContractAddress.pausibleProxyContract,PausibleProxyAbi, provider);
        const contract = pausibleProxyContract.connect(signer);

        let tx = await contract.updateToken(
          oldTokenAddress,
          tokenName,
          tokenSymbol,
          adminAddress,
        )
        let result = await tx.wait()

        result.events.forEach((ev) => {
            if(ev.event != undefined && ev.event == "UpdatedToken"){
              newTokenAddress = ev.args[1]
              exchangeAddress = ev.args[2]
            }
        })

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            html:
            '<p class="text-lg">Successfully updated token</p>' +
            `<p class="my-2">Upgraded Token Address - ${newTokenAddress}</p>` +
            `<p>Exchange Address - ${exchangeAddress}</p>`,
            confirmButtonText: 'Nice',
            showConfirmButton: true,
        })
      }catch(e){
        console.log(e)
        errorAlert("Check console log!")
      }

      deployBtnLoading = false
  }

  function handleCheckContract(){
    let contractAddress = ""
    switch(tokenPresetOptions){
      case "Pausible":
        contractAddress = ContractAddress.pausibleProxyContract
      default:
        contractAddress = ContractAddress.pausibleProxyContract
    }

    window.open(`https://evm.evmos.dev/address/${contractAddress}`, '_blank').focus();
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

<main>
  <div class="flex flex-col items-center gap-5">

    <div class="form-control w-full max-w-xs">
      <label class="label" for="tokenAddress">
        <span class="label-text">Original Token Address</span>
      </label>
      <input type="text" bind:value={oldTokenAddress} id="tokenAddress" placeholder="0xAb..." class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label" for="tokenName">
        <span class="label-text">Upgraded Token Name</span>
      </label>
      <input type="text" bind:value={tokenName} id="tokenName" placeholder="Ethereum" class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label" for="tokenSymbol">
        <span class="label-text">Upgraded Token Symbol</span>
      </label>
      <input type="text" bind:value={tokenSymbol} id="tokenSymbol" placeholder="ETH" class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label" for="adminAddress">
        <span class="label-text">Admin Address</span>
      </label>
      <input type="text" bind:value={adminAddress} id="adminAddress" placeholder="0xea..." class="input input-bordered w-full max-w-xs" />
    </div>

    <div class="flex gap-4">
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Pausible</span> 
          <input type="radio" name="radio-6" class="radio checked:bg-red-500" bind:group={tokenPresetOptions} value={"Pausible"} />
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Permit</span> 
          <input type="radio" name="radio-6" class="radio checked:bg-red-500" bind:group={tokenPresetOptions} value={"Permit"} disabled />
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Vote</span> 
          <input type="radio" name="radio-6" class="radio checked:bg-red-500" bind:group={tokenPresetOptions} value={"Vote"} disabled />
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text mr-2">Snapshot</span> 
          <input type="radio" name="radio-6" class="radio checked:bg-red-500" bind:group={tokenPresetOptions} value={"Snapshot"} disabled />
        </label>
      </div>
    </div>

    <div class="flex gap-5 flex-col w-full">
      <button class={`btn ${deployBtnLoading ? "loading" : "" } btn-info text-white capitalize font-normal text-xl`} on:click={handleCreateToken}>Deploy Upgrade</button>
      <div class="btn-group w-full">
        <a target="_blank" href="https://github.com/mnkhod/DiverseUp/tree/main/contracts" class={`btn btn-primary w-2/12 text-white capitalize font-normal text-lg`} >
          <svg class="text-white w-8 h-8" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"></path></svg>
        </a>
        <button class={`btn btn-warning w-10/12 text-white capitalize font-normal text-lg`} on:click={handleCheckContract} >Check Upgrade Contract On Evmos Explorer</button>
      </div>
      <button class="btn btn-outline border-3 btn-info text-white capitalize font-normal text-xl" on:click={handleExitBtn}>Exit</button>
    </div>

  </div>
</main>
