import { Button, Modal, message } from "antd";
import { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const BoostifySDK = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const aptosConfig = new AptosConfig({ network: Network.RANDOMNET, faucet: "https://faucet.random.aptoslabs.com" });
  const aptos = new Aptos(aptosConfig); // default to devnet
  const { account, signAndSubmitTransaction } = useWallet();
  interface RewardObj {
    reward_active: boolean;
    reward_winners: string[];
  }
  
  const [rewardState, setRewardState] = useState<RewardObj>({
    reward_active: false,
    reward_winners: [],
  });
  useEffect(() => {
    const checkAdmin = async () => {
      if (account?.address) {
        const adminAddress = "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b";
        setIsAdmin(account.address === adminAddress);
      }
    };
    checkAdmin();
  }, [account]);

  const handleAddWallet = async () => {
    try {
      const response = await signAndSubmitTransaction({
        type_arguments: [],
        function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::VarRandomRewardSystem::add_wallet",
        type: "entry_function_payload",
        arguments: [],
      });
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      message.success("Wallet added successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to add wallet.");
    }
  };

  const handleStartReward = async () => {
    try {
      const response = await signAndSubmitTransaction({
        type_arguments: [],
        function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::VarRandomRewardSystem::start_reward",
        type: "entry_function_payload",
        arguments: [],
      });
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      message.success("Reward started successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to start reward.");
    }
  };

  const handleEndReward = async () => {
    try {
      const response = await signAndSubmitTransaction({
        type_arguments: [],
        function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::VarRandomRewardSystem::end_reward",
        type: "entry_function_payload",
        arguments: [100, 1],
      });
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      message.success("Reward ended successfully!");
      setIsModalVisible(false);


    } catch (error) {
      console.error(error);
      message.error("Failed to end reward.");
    }
  };

  const handleGetReward = async () => {

     try{

      const resourceType = "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::VarRandomRewardSystem::RewardState";

      const resource = await aptos.account.getAccountResource({
        accountAddress: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b",
        resourceType,
      });
      setRewardState(resource);
  
      message.success("Reward ended successfully!");
    //   setIsModalVisible(false);
    console.log(resource);
     } catch(error){
        console.error(error);
        message.error("Failed to get reward.");
     }
  }

  const handleResetReward = async () => {
    try {
      const response = await signAndSubmitTransaction({
        type_arguments: [],
        function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::VarRandomRewardSystem::reset_reward",
        type: "entry_function_payload",
        arguments: [],
      });
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      message.success("Reward reset successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to reset reward.");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        BoostifySDK
      </Button>
      <Modal
        title="Reward System"
        visible={isModalVisible}
        width={800}

        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          isAdmin ? (
            <>
            <Button key="add" type="primary" onClick={handleAddWallet}>
              Add Wallet
            </Button>
              <Button key="start" type="primary" onClick={handleStartReward}>
                Start Reward
              </Button>
              <Button key="end" type="primary" onClick={handleEndReward}>
                End Reward
              </Button>
              <Button key="reset" type="primary" onClick={handleResetReward}>
                Reset Reward
              </Button>
              <Button key="add" type="primary" onClick={handleGetReward}>
              Get Reward
            </Button>
            </>
          ) : (
            <>
            <Button key="add" type="primary" onClick={handleAddWallet}>
              Add Wallet
            </Button>
            <Button key="add" type="primary" onClick={handleGetReward}>
              Get Reward
            </Button>
            </>
          ),
        ]}
      >
        {isAdmin ? (
         <>
         <p>You are the admin. You can start, end, or reset the reward.</p>
         {/* {winningWallet && (
           <p>
             <strong>Winning Wallet:</strong> {winningWallet}
           </p>
         )} */}
         <Button onClick={handleGetReward}>Get Winning Wallet</Button>
      {rewardState && (
        <>
          <p>
            <strong>Reward Active:</strong> {rewardState.reward_active ? "Yes" : "No"}
          </p>
          {rewardState.reward_winners.length > 0 && (
            <p>
              <strong>Winning Wallet:</strong> {rewardState.reward_winners}

            </p>
          )}
        </>
      )}
       </>
        ) : (
          <p>Add your wallet to participate in the reward system.</p>
        )}
      </Modal>
    </>
  );
};

export default BoostifySDK;