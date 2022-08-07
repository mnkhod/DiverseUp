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
  let adminAddress = ""

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
      <button class={`btn btn-warning text-white capitalize font-normal text-lg`} on:click={handleCheckContract} >Check Upgrade Contract On Evmos Explorer</button>
      <button class="btn btn-outline border-3 btn-info text-white capitalize font-normal text-xl" on:click={handleExitBtn}>Exit</button>
    </div>

  </div>
</main>
